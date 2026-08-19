from sqlalchemy import Integer, String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import date


class HealthConcern(Base):
    __tablename__ = "health_concerns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    plant_id: Mapped[int] = mapped_column(ForeignKey("plants.id"), nullable=False)

    initial_context: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    status: Mapped[str] = mapped_column(String(30), nullable=False)

    occurred_on: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    reported_on: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    plant: Mapped["Plant"] = relationship(back_populates="concerns")

    evidences: Mapped[list["Evidence"]] = relationship(
        secondary="concern_evidences", back_populates="concerns"
    )

    assessments: Mapped[list["Assessment"]] = relationship(
        back_populates="concern", foreign_keys="Assessment.concern_id"
    )

    recommendations: Mapped[list["Recommendation"]] = relationship(
        back_populates="concern", foreign_keys="Recommendation.concern_id"
    )

    outcomes: Mapped[list["Outcome"]] = relationship(
        back_populates="concern", foreign_keys="Outcome.concern_id"
    )
