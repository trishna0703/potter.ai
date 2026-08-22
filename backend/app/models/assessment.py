from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import datetime


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    concern_id: Mapped[int] = mapped_column(
        ForeignKey("health_concerns.id"), nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    current_interaction_id: Mapped[int | None] = mapped_column(
        ForeignKey("assessment_messages.id"),
        nullable=True,
    )

    problem: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    problem_cause: Mapped[str | None] = mapped_column(String(100), nullable=True)

    confidence: Mapped[str | None] = mapped_column(String(50), nullable=True)

    explanation: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    created_on: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.today, nullable=False
    )

    evidences: Mapped[list["Evidence"]] = relationship(
        secondary="assessment_evidences",
        back_populates="assessments",
    )

    concern: Mapped["HealthConcern"] = relationship(
        back_populates="assessments", foreign_keys=[concern_id]
    )

    messages: Mapped[list["AssessmentMessage"]] = relationship(
        "AssessmentMessage",
        back_populates="assessment",
        cascade="all, delete-orphan",
        foreign_keys="AssessmentMessage.assessment_id",
    )
    current_interaction = relationship(
        "AssessmentMessage",
        foreign_keys=[current_interaction_id],
        post_update=True,
    )
