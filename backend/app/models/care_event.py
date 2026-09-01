from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from datetime import datetime, timezone


class CareEvent(Base):
    __tablename__ = "care_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    plant_id: Mapped[int] = mapped_column(ForeignKey("plants.id"), nullable=False)

    care_schedule_id: Mapped[int | None] = mapped_column(
        ForeignKey("care_schedules.id"),
        nullable=True,
    )

    care_type: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    occurred_on: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="DONE",
    )

    source: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="POTTER",
    )

    plant: Mapped["Plant"] = relationship(
        back_populates="events",
    )

    care_schedule: Mapped["CareSchedule | None"] = relationship(
        back_populates="care_events",
    )
