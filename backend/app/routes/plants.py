from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.models import User, Plant
from app.routes.users import get_current_user
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.schemas.plant import PlantResponse, PlantCreate, PlantUpdate, plant_to_response
from typing import Literal

from fastapi import Depends, Query
from sqlalchemy import asc, desc, select
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/", response_model=PlantResponse)
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

    return plant_to_response(new_plant)


@router.get("/", response_model=list[PlantResponse])
def get_all_plants(
    query: str | None = None,
    status: str | None = "ACTIVE",
    location_type: str | None = None,
    sort_by: Literal[
        "name",
        "species",
        "added_on",
        "height_cm",
        "pot_size",
    ] = "added_on",
    sort_order: Literal["asc", "desc"] = "asc",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Plant).where(Plant.user_id == current_user.id)

    if query:
        stmt = stmt.where(
            Plant.name.ilike(f"%{query.strip()}%")
            | Plant.species.ilike(f"%{query.strip()}%")
        )

    if status:
        stmt = stmt.where(Plant.status == status)

    if location_type:
        stmt = stmt.where(Plant.location_type == location_type)

    sort_column = {
        "name": Plant.name,
        "species": Plant.species,
        "added_on": Plant.added_on,
        "height_cm": Plant.height_cm,
        "pot_size": Plant.pot_size,
    }[sort_by]

    stmt = stmt.order_by(
        desc(sort_column) if sort_order == "desc" else asc(sort_column)
    )

    offset = (page - 1) * page_size

    stmt = stmt.offset(offset).limit(page_size)

    plant_list = db.scalars(stmt).all()

    return [plant_to_response(plant) for plant in plant_list]


@router.get("/details/{plant_id}", response_model=PlantResponse)
def get_plant_details(
    plant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Plant).where(Plant.id == plant_id, Plant.user_id == current_user.id)

    plant = db.scalars(stmt).first()

    if plant is None:
        raise HTTPException(status_code=404, detail="Plant not found.")

    return plant_to_response(plant)


@router.patch("/", response_model=PlantResponse)
def update_plant(
    plant_data: PlantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Plant).where(
        Plant.id == plant_data.id, Plant.user_id == current_user.id
    )

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

    return plant_to_response(plant)
