from pydantic import BaseModel
from pydantic import ConfigDict
from datetime import date
from app.models.plant import Plant


class PlantIdentificationResult(BaseModel):
    species: str
    confidence: float


class PlantResponse(BaseModel):
    id: int
    name: str | None
    species: str
    avatar: str | None

    model_config = ConfigDict(from_attributes=True)


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
    avatar: str | None
    avatar_id: int | None

    model_config = {"from_attributes": True}


def plant_to_response(plant: Plant) -> PlantResponse:
    return PlantResponse(
        id=plant.id,
        name=plant.name,
        species=plant.species,
        height_cm=plant.height_cm,
        pot_size=plant.pot_size,
        added_on=plant.added_on,
        location_type=plant.location_type,
        status=plant.status,
        avatar=plant.avatar.photo_url if plant.avatar else None,
        avatar_id=plant.avatar_id,
    )


class PlantUpdate(BaseModel):
    id: int
    name: str | None = None
    species: str | None = None
    location_type: str | None = None
    height_cm: float | None = None
    pot_size: float | None = None
    added_on: date | None = None
    avatar_id: int | None = None
    status: str | None = None
