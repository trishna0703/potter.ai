from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import datetime


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    assessment_id: Mapped[int] = mapped_column(
        ForeignKey("assessments.id"),
        nullable=False,
        unique=True,
    )

    recommendation_type: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str] = mapped_column(String(2000), nullable=False)

    performed_on: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    assessment: Mapped["Assessment"] = relationship(back_populates="recommendation")

    outcome: Mapped["Outcome | None"] = relationship(
        back_populates="recommendation",
        uselist=False,
        cascade="all, delete-orphan",
    )
