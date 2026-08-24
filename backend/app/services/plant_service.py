from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.plant import Plant


class PlantService(BaseModel):
    def mark_plant_dead(self, plant_id: int, db: Session):

        stmt = select(Plant).where(Plant.id == plant_id)

        plant = db.scalar(stmt)

        plant.status = "INACTIVE"

        db.flush(plant)

        return plant

    def get_plant_list_for_species(
        self, species: str, user_id: int, db: Session
    ) -> list[Plant]:
        stmt = select(Plant).where(Plant.species == species, Plant.user_id == user_id)

        found_plants = db.scalars(stmt).all()

        return found_plants
