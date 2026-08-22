from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, String, DateTime

from app.database import Base

from datetime import datetime


class PlantPhoto(Base):
    __tablename__ = "plant_photos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    plant_id: Mapped[int | None] = mapped_column(ForeignKey("plants.id"), nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    photo_url: Mapped[str] = mapped_column(String(500), nullable=False)

    captured_on: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    uploaded_on: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.today, nullable=False
    )

    expires_on: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    plant: Mapped["Plant | None"] = relationship(
        back_populates="photos", foreign_keys=[plant_id]
    )

    user: Mapped["User"] = relationship(back_populates="photos")

    evidences: Mapped[list["Evidence"]] = relationship(
        secondary="evidence_photos", back_populates="photos"
    )
