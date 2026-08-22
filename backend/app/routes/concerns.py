from fastapi import APIRouter, Depends
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
from app.services.interaction_service import InteractionService
from app.services.helper_services import (
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


@router.post("/", response_model=ResponseModel)
def raise_concern(
    concern: RequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        new_concern = create_health_concern(concern, current_user.id, db)

        link_evidence_to_concern(new_concern.id, concern.evidence_id, db)

        db.commit()
        db.refresh(new_concern)

    
    # TODO: Update AssessmentEvidence Table after raise concern

    except Exception:
        db.rollback()
        raise

    return {
        "concern_id": new_concern.id,
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
        status="OPEN",
    )

    db.add(new_concern)
    db.flush()

    return new_concern


@router.get(
    "/{concern_id}/messages",
    response_model=list[AssessmentMessageResponse],
)
def get_assessment_messages(
    concern_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interaction_service = InteractionService()

    return interaction_service.get_messages_for_concern(
        db,
        concern_id=concern_id,
        user_id=current_user.id,
    )
