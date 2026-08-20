from sqlalchemy import Integer, String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import date


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    concern_id: Mapped[int] = mapped_column(
        ForeignKey("health_concerns.id"), nullable=False
    )

    problem: Mapped[str] = mapped_column(String(2000), nullable=False)

    problem_cause: Mapped[str] = mapped_column(String(100), nullable=False)

    confidence: Mapped[str] = mapped_column(String(50), nullable=False)

    explanation: Mapped[str] = mapped_column(String(2000), nullable=False)

    status: Mapped[str] = mapped_column(String(30), nullable=False)

    created_on: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    evidences: Mapped[list["Evidence"]] = relationship(
        secondary="assessment_evidences",
        back_populates="assessments",
    )

    concern: Mapped["HealthConcern"] = relationship(
        back_populates="assessments", foreign_keys=[concern_id]
    )

    messages: Mapped[list["AssessmentMessage"]] = relationship(
        back_populates="assessment",
    )
