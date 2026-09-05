from datetime import date, datetime, timezone, time

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Index,
    Integer,
    String,
    ForeignKey,
    Time,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CareSchedule(Base):
    __tablename__ = "care_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    plant_id: Mapped[int] = mapped_column(ForeignKey("plants.id"), nullable=False)

    care_type: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    frequency_type: Mapped[str] = mapped_column(String(50), nullable=False)

    interval: Mapped[int | None] = mapped_column(Integer, nullable=True)

    scheduled_time: Mapped[time | None] = mapped_column(Time, nullable=True)

    timezone: Mapped[str] = mapped_column(String(100), nullable=False)

    starts_on: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    ends_on: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    last_occurrence_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
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

    auto_schedule: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    deleted_by_user: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    plant: Mapped["Plant"] = relationship(
        back_populates="care_schedules",
    )

    care_events: Mapped[list["CareEvent"]] = relationship(
        back_populates="care_schedule",
    )

    calendar_event: Mapped["CareScheduleCalendarEvent | None"] = relationship(
        back_populates="care_schedule",
        uselist=False,
    )

    __table_args__ = (
        Index(
            "uq_care_schedule_plant_care_type_active",
            "plant_id",
            "care_type",
            unique=True,
            postgresql_where=(deleted_by_user.is_(False)),
        ),
    )
