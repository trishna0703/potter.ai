from sqlalchemy import JSON, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import datetime


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    assessment_id: Mapped[int] = mapped_column(
        ForeignKey("assessments.id"),
        nullable=False,
    )

    generation_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
        index=True,
    )

    option_id: Mapped[str] = mapped_column(String(500), nullable=False)

    position: Mapped[int] = mapped_column(Integer, nullable=False)

    title: Mapped[str] = mapped_column(String(300), nullable=False)

    summary: Mapped[str] = mapped_column(String(1000), nullable=False)

    steps: Mapped[list] = mapped_column(JSON, nullable=False)

    materials: Mapped[list] = mapped_column(JSON, nullable=False)

    frequency: Mapped[str | None] = mapped_column(String(300))

    duration: Mapped[str | None] = mapped_column(String(300))

    caution: Mapped[str | None] = mapped_column(String(1000))

    expected_result: Mapped[str] = mapped_column(String(1000), nullable=False)

    recommendation_score: Mapped[int] = mapped_column(Integer, nullable=False)

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="AVAILABLE",
    )

    selected_at: Mapped[datetime | None] = mapped_column(DateTime)

    performed_on: Mapped[datetime | None] = mapped_column(DateTime)

    schema_version: Mapped[str] = mapped_column(String(30), nullable=False)

    model: Mapped[str] = mapped_column(String(200), nullable=False)

    prompt_version: Mapped[str] = mapped_column(String(30), nullable=False)

    input_payload: Mapped[dict] = mapped_column(JSON, nullable=False)

    response_payload: Mapped[dict] = mapped_column(JSON, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.today,
        nullable=False,
    )

    assessment: Mapped["Assessment"] = relationship(back_populates="recommendations")

    outcome: Mapped["Outcome | None"] = relationship(
        back_populates="recommendation",
        uselist=False,
        cascade="all, delete-orphan",
    )
