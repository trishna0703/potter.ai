from fastapi import APIRouter, Depends, HTTPException
from app.models import (
    User,
    HealthConcern,
    PlantIdentification,
)
from app.models.assessment import Assessment
from app.models.evidence import Evidence
from app.models.evidence_photo import EvidencePhoto
from app.models.plant import Plant
from app.models.plant_photo import PlantPhoto
from app.routes.users import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from app.schemas.assessment import AssessmentMessageResponse
from app.services.assessment_service import AssessmentService
from app.services.health_concern_service import HealthConcernService
from app.services.interaction_service import InteractionService
from app.services.helper_services import (
    link_evidence_to_Assessment,
    link_evidence_to_concern,
)
from app.schemas.route import ReassessmentRequestModel, RequestModel, ResponseModel
from app.services.s3_service import generate_download_url
from app.schemas.recommendation import AIRecommendationResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter()


@router.get("/")
def get_active_concerns(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):

    latest_assessment_id = (
        select(Assessment.id)
        .where(
            Assessment.concern_id == HealthConcern.id,
        )
        .order_by(Assessment.id.desc())
        .limit(1)
        .correlate(HealthConcern)
        .scalar_subquery()
    )

    latest_assessment_status = (
        select(Assessment.status)
        .where(
            Assessment.concern_id == HealthConcern.id,
        )
        .order_by(Assessment.id.desc())
        .limit(1)
        .correlate(HealthConcern)
        .scalar_subquery()
    )

    assessment_count = (
        select(func.count(Assessment.id))
        .where(
            Assessment.concern_id == HealthConcern.id,
        )
        .correlate(HealthConcern)
        .scalar_subquery()
    )

    stmt = (
        select(
            HealthConcern,
            Plant.species.label("species"),
            PlantIdentification.species.label("identified_species"),
            PlantPhoto.id.label("photo_id"),
            PlantPhoto.photo_url,
            latest_assessment_id.label("assessment_id"),
            latest_assessment_status.label("assessment_status"),
            assessment_count.label("assessment_count"),
        )
        .outerjoin(
            Plant,
            Plant.id == HealthConcern.plant_id,
        )
        .outerjoin(
            PlantIdentification,
            PlantIdentification.concern_id == HealthConcern.id,
        )
        .outerjoin(
            Evidence,
            Evidence.id == HealthConcern.initial_evidence_id,
        )
        .outerjoin(
            EvidencePhoto,
            EvidencePhoto.evidence_id == Evidence.id,
        )
        .outerjoin(
            PlantPhoto,
            PlantPhoto.id == EvidencePhoto.photo_id,
        )
        .where(
            HealthConcern.user_id == current_user.id,
            HealthConcern.status == "OPEN",
        )
    )

    concerns = db.execute(stmt).all()

    active_statuses = {"WAITING_FOR_AI", "WAITING_FOR_USER"}

    return [
        {
            "id": concern.id,
            "plant_id": concern.plant_id,
            "identified_species": (
                plant_species if plant_species is not None else identified_species
            ),
            "photo_url": photo_url,
            "photo_id": photo_id,
            "occurred_on": concern.occurred_on,
            "reported_on": concern.reported_on,
            "status": concern.status,
            "initial_context": concern.initial_context,
            "assessment_id": assessment_id,
            "is_reassessing": (
                assessment_count > 1 and assessment_status in active_statuses
            ),
        }
        for (
            concern,
            plant_species,
            identified_species,
            photo_id,
            photo_url,
            assessment_id,
            assessment_status,
            assessment_count,
        ) in concerns
    ]

@router.get("/inactive")
def get_inactive_concerns(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    stmt = (
        select(
            HealthConcern,
            Plant.species.label("species"),
            PlantIdentification.species.label("identified_species"),
            PlantPhoto.id.label("photo_id"),
            PlantPhoto.photo_url,
            Assessment.id.label("assessment_id"),
            Assessment.problem,
            Assessment.problem_cause,
            Assessment.confidence,
            Assessment.explanation,
            Assessment.created_on,
        )
        .join(
            Assessment,
            (Assessment.concern_id == HealthConcern.id)
            & (Assessment.status == "COMPLETED"),
        )
        .outerjoin(Plant, Plant.id == HealthConcern.plant_id)
        .outerjoin(
            PlantIdentification,
            PlantIdentification.concern_id == HealthConcern.id,
        )
        .outerjoin(Evidence, Evidence.id == HealthConcern.initial_evidence_id)
        .outerjoin(EvidencePhoto, EvidencePhoto.evidence_id == Evidence.id)
        .outerjoin(PlantPhoto, PlantPhoto.id == EvidencePhoto.photo_id)
        .where(
            HealthConcern.user_id == current_user.id,
        )
        .order_by(HealthConcern.id, Assessment.id.desc())
    )

    rows = db.execute(stmt).all()

    concerns_by_id: dict[int, dict] = {}

    for (
        concern,
        plant_species,
        identified_species,
        photo_id,
        photo_url,
        assessment_id,
        problem,
        problem_cause,
        confidence,
        explanation,
        created_on,
    ) in rows:
        entry = concerns_by_id.setdefault(
            concern.id,
            {
                "id": concern.id,
                "plant_id": concern.plant_id,
                "identified_species": (
                    plant_species if plant_species is not None else identified_species
                ),
                "photo_url": photo_url,
                "photo_id": photo_id,
                "occurred_on": concern.occurred_on,
                "reported_on": concern.reported_on,
                "status": concern.status,
                "initial_context": concern.initial_context,
                "assessments": [],
            },
        )

        entry["assessments"].append(
            {
                "id": assessment_id,
                "problem": problem,
                "problem_cause": problem_cause,
                "confidence": confidence,
                "explanation": explanation,
                "created_on": created_on,
            }
        )

    return list(concerns_by_id.values())

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

    return {
        "concern_id": new_concern.id,
        "assessment_id": new_assessment.id,
    }


@router.post("/reassessment", response_model=ResponseModel)
def create_reassessment(
    payload: ReassessmentRequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    concern_service = HealthConcernService()
    assessment_service = AssessmentService()

    concern = concern_service.get_health_concern_for_user(
        db,
        concern_id=payload.concern_id,
        user_id=current_user.id,
    )

    if concern is None:
        raise HTTPException(status_code=404)

    previous_assessment = assessment_service.get_latest_completed_assessment(
        db,
        concern_id=payload.concern_id,
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
        evidence_id=concern.initial_evidence_id,
        db=db,
    )

    db.commit()

    return {"assessment_id": assessment.id, "concern_id": concern.id}


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


@router.get(
    "/recommendations/{assessment_id}", response_model=AIRecommendationResponse | None
)
def get_assessment_recommendations(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recommendation_service = RecommendationService()

    return recommendation_service.get_recommendations_for_assessment(
        db,
        assessment_id=assessment_id,
    )


@router.get("/assessment/{assessment_id}")
def get_assessment_by_id(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(Assessment)
        .join(HealthConcern, Assessment.concern_id == HealthConcern.id)
        .where(
            Assessment.id == assessment_id,
            HealthConcern.user_id == current_user.id,
        )
    )
    return db.scalars(stmt).first()
