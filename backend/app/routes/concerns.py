from fastapi import APIRouter, Depends, HTTPException
from app.models import (
    User,
    HealthConcern,
    PlantIdentification,
)
from app.models.plant_photo import PlantPhoto
from app.routes.users import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.schemas.assessment import AssessmentMessageResponse
from app.services.assessment_service import AssessmentService
from app.services.health_concern_service import HealthConcernService
from app.services.interaction_service import InteractionService
from app.services.helper_services import (
    link_evidence_to_Assessment,
    link_evidence_to_concern,
)
from app.schemas.route import RequestModel, ResponseModel

router = APIRouter()


@router.get("/")
def get_active_concerns(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):

    stmt = (
        select(HealthConcern, PlantIdentification.species)
        .outerjoin(
            PlantIdentification,
            PlantIdentification.concern_id == HealthConcern.id,
        )
        .where(
            HealthConcern.user_id == current_user.id,
            HealthConcern.status == "OPEN",
        )
    )

    concerns = db.execute(stmt).all()
    return [
        {
            "id": concern.id,
            "plant_id": concern.plant_id,
            "initial_context": concern.initial_context,
            "status": concern.status,
            "occurred_on": concern.occurred_on,
            "reported_on": concern.reported_on,
            "identified_species": species,
        }
        for concern, species in concerns
    ]


@router.post("/assessment", response_model=ResponseModel)
def raise_concern(
    concern: RequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        assessment_service = AssessmentService()
        new_concern = create_health_concern(concern, current_user.id, db)

        link_evidence_to_concern(new_concern.id, concern.evidence_id, db)

        new_assessment = assessment_service.get_or_create_assessment(
            db,
            concern_id=new_concern.id,
            initial_status="WAITING_FOR_AI",
        )

        link_evidence_to_Assessment(
            assessment_id=new_assessment.id,
            evidence_id=concern.evidence_id,
            db=db,
        )

        db.commit()
        db.refresh(new_concern)

    except Exception:
        db.rollback()
        raise

    return {"concern_id": new_concern.id, "assessment_id": new_assessment.id}


@router.post("/reassessment", response_model=ResponseModel)
def create_reassessment(
    concern_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    concern_service = HealthConcernService()
    assessment_service = AssessmentService()

    concern = concern_service.get_health_concern_for_user(
        db,
        concern_id=concern_id,
        user_id=current_user.id,
    )

    if concern is None:
        raise HTTPException(status_code=404)

    previous_assessment = assessment_service.get_latest_completed_assessment(
        db,
        concern_id=concern_id,
    )

    if previous_assessment is None:
        raise HTTPException(
            status_code=400,
            detail="No completed assessment exists.",
        )

    assessment = assessment_service.create_assessment(
        db,
        concern_id=concern.id,
        status="WAITING_FOR_AI",
    )

    link_evidence_to_Assessment(
        assessment_id=assessment.id,
        evidence_id=concern.initial_evidence_id.id,
        db=db,
    )

    db.commit()

    return {
        "assessment_id": assessment.id,
    }


def create_health_concern(
    concern: RequestModel,
    user_id: int,
    db: Session,
) -> HealthConcern:
    new_concern = HealthConcern(
        plant_id=concern.plant_id,
        user_id=user_id,
        initial_context=concern.initial_context,
        submission_id=str(concern.submission_id),
        occurred_on=concern.occurred_on,
        initial_evidence_id=concern.evidence_id,
        status="OPEN",
    )

    db.add(new_concern)
    db.flush()

    return new_concern


@router.get(
    "/{assessment_id}/messages",
    response_model=list[AssessmentMessageResponse],
)
def get_assessment_messages(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interaction_service = InteractionService()

    return interaction_service.get_assessment_messages(
        db,
        assessment_id=assessment_id,
        user_id=current_user.id,
    )
