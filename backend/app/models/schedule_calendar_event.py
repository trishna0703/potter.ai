from datetime import datetime

from sqlalchemy import (
    DateTime,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CareScheduleCalendarEvent(Base):
    __tablename__ = "care_schedule_calendar_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    care_schedule_id: Mapped[int] = mapped_column(
        ForeignKey("care_schedules.id"), nullable=False, unique=True
    )

    google_event_id: Mapped[str] = mapped_column(String(255), nullable=False)

    calendar_id: Mapped[str] = mapped_column(String(255), nullable=False)

    event_start_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    event_end_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="ACTIVE",
    )

    last_synced_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    care_schedule: Mapped["CareSchedule"] = relationship(
        back_populates="calendar_event",
    )
