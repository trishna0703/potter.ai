from app.database import Base
from sqlalchemy import Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime


class PlantIdentification(Base):

    __tablename__ = "plant_identifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    concern_id: Mapped[int | None] = mapped_column(
        ForeignKey("health_concerns.id"), nullable=True
    )

    evidence_id: Mapped[int] = mapped_column(ForeignKey("evidences.id"), nullable=False)

    species: Mapped[str | None] = mapped_column(String(30), nullable=True)

    confidence: Mapped[float] = mapped_column(Float, nullable=True)

    status: Mapped[str] = mapped_column(String(20), default="PENDING", nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.today, nullable=False
    )

    concern: Mapped["HealthConcern"] = relationship(back_populates="identification")

    evidence: Mapped["Evidence"] = relationship(back_populates="identification")
