from datetime import datetime

from sqlalchemy import Integer, String, DateTime, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Plant(Base):
    __tablename__ = "plants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str | None] = mapped_column(String(100), nullable=True)

    species: Mapped[str] = mapped_column(String(50), nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    height_cm: Mapped[float | None] = mapped_column(Float, nullable=True)

    pot_size: Mapped[float | None] = mapped_column(Float, nullable=True)

    added_on: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.today, nullable=False
    )

    location_type: Mapped[str | None] = mapped_column(String, nullable=True)

    status: Mapped[str | None] = mapped_column(String, nullable=True)

    avatar_id: Mapped[int | None] = mapped_column(
        ForeignKey("plant_photos.id"), nullable=True
    )

    user: Mapped["User"] = relationship(back_populates="plants")

    shelves: Mapped[list["Shelf"]] = relationship(
        secondary="shelf_plants", back_populates="plants"
    )

    photos: Mapped[list["PlantPhoto"]] = relationship(
        back_populates="plant", foreign_keys="PlantPhoto.plant_id"
    )

    avatar: Mapped["PlantPhoto | None"] = relationship(foreign_keys=[avatar_id])

    events: Mapped[list["CareEvent"]] = relationship(back_populates="plant")

    concerns: Mapped[list["HealthConcern"]] = relationship(back_populates="plant")

    __table_args__ = (UniqueConstraint("user_id", "name", name="uq_user_plant_name"),)
