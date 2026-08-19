from sqlalchemy import Integer, String, Date, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import date


class EvidencePhoto(Base):
    __tablename__ = "evidence_photos"

    photo_id: Mapped[int] = mapped_column(ForeignKey("plant_photos.id"), nullable=False)

    evidence_id: Mapped[int] = mapped_column(ForeignKey("evidences.id"), nullable=False)

    __table_args__ = (PrimaryKeyConstraint("photo_id", "evidence_id"),)
