from fastapi import APIRouter, Depends, HTTPException
from app.database import Session, get_db
from app.models import User, Plant
from app.routes.users import get_current_user
from pydantic import BaseModel
from datetime import date
from sqlalchemy import select

router = APIRouter()


class PlantCreate(BaseModel):
    name: str | None = None
    species: str
    location_type: str | None = None
    height_cm: float | None = None
    pot_size: float | None = None
    added_on: date
    avatar_id: int | None = None
    status: str | None = None


class PlantResponse(BaseModel):
    id: int
    name: str | None
    species: str
    height_cm: float | None
    pot_size: float | None
    added_on: date
    location_type: str | None
    status: str | None
    avatar_id: int | None

    model_config = {"from_attributes": True}


class PlantUpdate(BaseModel):
    name: str | None = None
    species: str | None = None
    location_type: str | None = None
    height_cm: float | None = None
    pot_size: float | None = None
    added_on: date | None = None
    avatar_id: int | None = None
    status: str | None = None


@router.post("/add", response_model=PlantResponse)
def create_plant(
    plant_data: PlantCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    try:
        if current_user.id is None:
            raise HTTPException(status_code=403, detail="Not authenticated")

        new_plant = Plant(
            name=plant_data.name,
            species=plant_data.species,
            location_type=plant_data.location_type,
            height_cm=plant_data.height_cm,
            pot_size=plant_data.pot_size,
            added_on=plant_data.added_on,
            avatar_id=plant_data.avatar_id,
            status=plant_data.status,
            user_id=current_user.id,
        )
        db.add(new_plant)
        db.commit()
        db.refresh(new_plant)

    except Exception as e:
        db.rollback()
        raise

    return new_plant


@router.get("/", response_model=list[PlantResponse])
def get_all_plants(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    stmt = select(Plant).where(Plant.user_id == current_user.id)

    plant_list = db.scalars(stmt).all()

    return plant_list


@router.get("/{plant_id}", response_model=PlantResponse)
def get_plant_details(
    plant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Plant).where(Plant.id == plant_id, Plant.user_id == current_user.id)

    plant = db.scalars(stmt).first()

    if plant is None:
        raise HTTPException(status_code=404, detail="Plant not found.")

    return plant


@router.patch("/{plant_id}", response_model=PlantResponse)
def update_plant(
    plant_id: int,
    plant_data: PlantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Plant).where(Plant.id == plant_id, Plant.user_id == current_user.id)

    plant = db.scalars(stmt).first()

    if plant is None:
        raise HTTPException(status_code=404, detail="Plant not found.")

    try:
        updates = plant_data.model_dump(exclude_unset=True)

        for field, value in updates.items():
            setattr(plant, field, value)

        db.commit()
        db.refresh(plant)

    except Exception:
        db.rollback()
        raise

    return plant
