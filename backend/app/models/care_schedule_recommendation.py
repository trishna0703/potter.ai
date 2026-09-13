from datetime import date, datetime, time, timezone

from sqlalchemy import JSON, Date, DateTime, ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CareScheduleRecommendation(Base):
    __tablename__ = "care_schedule_recommendations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    plant_id: Mapped[int] = mapped_column(
        ForeignKey("plants.id"),
        nullable=False,
    )

    care_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    frequency_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    interval: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    reasoning: Mapped[str | None] = mapped_column(
        String(4000),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PENDING",
    )

    generation_context: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    plant: Mapped["Plant"] = relationship(
        back_populates="care_schedule_recommendations"
    )
