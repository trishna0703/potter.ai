from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.routes.users import get_current_user
from app.schemas.care_recommendations import (
    CareScheduleRecommendationCreate,
    CareScheduleRecommendationRespons,
)
from app.services.care_schedule_recommendation_service import (
    CareScheduleAlreadyExistsError,
    CareScheduleRecommendationError,
    CareScheduleRecommendationService,
    PlantNotFoundError,
)
from app.services.plant_service import PlantService

router = APIRouter()


@router.post(
    "/{plant_id}",
    response_model=CareScheduleRecommendationRespons,
    status_code=status.HTTP_201_CREATED,
)
def generate_care_schedule_recommendation(
    plant_id: int,
    payload: CareScheduleRecommendationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    plant_service = PlantService()

    if not plant_service.does_plant_belong_to_user(
        plant_id=plant_id, user_id=current_user.id, db=db
    ):
        raise HTTPException(
            detail="Plant does not belong to this user.", status_code=403
        )

    try:
        service = CareScheduleRecommendationService(db)

        return service.generate_recommendation(
            plant_id=plant_id,
            care_type=payload.care_type,
        )

    except PlantNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    except CareScheduleAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )

    except CareScheduleRecommendationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
