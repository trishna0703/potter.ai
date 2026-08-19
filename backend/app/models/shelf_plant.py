from app.database import Base

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, PrimaryKeyConstraint


class ShelfPlant(Base):
    __tablename__ = "shelf_plants"

    shelf_id: Mapped[int] = mapped_column(ForeignKey("shelves.id"), nullable=False)

    plant_id: Mapped[int] = mapped_column(ForeignKey("plants.id"), nullable=False)

    __table_args__ = (PrimaryKeyConstraint("shelf_id", "plant_id"),)
