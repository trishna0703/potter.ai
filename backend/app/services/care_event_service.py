from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.care_schedule import CareSchedule
from app.models.plant import Plant
from app.models.schedule_calendar_event import CareScheduleCalendarEvent


class CareScheduleService:
    def __init__(self, db: Session):
        self.db = db

    def create_schedule(
        self,
        *,
        user_id: int,
        plant_id: int,
        care_type: str,
        description: str | None,
        frequency_type: str,
        interval: int,
        scheduled_time: time,
        timezone: str,
        starts_on: date | None = None,
        ends_on: date | None = None,
        auto_schedule: bool = False,
    ) -> CareSchedule:

        plant = self._get_user_plant(
            user_id=user_id,
            plant_id=plant_id,
        )

        existing_schedule = self.get_existing_care_type_schedule(
            plant_id=plant.id,
            care_type=care_type,
        )

        if existing_schedule and not existing_schedule.deleted_by_user:
            message = f"{care_type} schedule already exists for this plant"

            if not existing_schedule.is_active:
                message += ". Set it active to continue reminders"

            raise ValueError(message)

        self._validate_schedule(
            frequency_type=frequency_type,
            interval=interval,
            timezone=timezone,
            starts_on=starts_on,
            ends_on=ends_on,
        )

        schedule = CareSchedule(
            plant_id=plant.id,
            care_type=care_type,
            description=description,
            frequency_type=frequency_type,
            interval=interval,
            scheduled_time=scheduled_time,
            timezone=timezone,
            starts_on=starts_on or date.today(),
            ends_on=ends_on,
            is_active=True,
            auto_schedule=auto_schedule,
            deleted_by_user=False,
        )

        self.db.add(schedule)
        self.db.flush()

        return schedule

    def get_existing_care_type_schedule(
        self,
        *,
        plant_id: int,
        care_type: str,
    ) -> CareSchedule | None:
        stmt = select(CareSchedule).where(
            CareSchedule.plant_id == plant_id,
            CareSchedule.care_type == care_type,
            CareSchedule.deleted_by_user.is_(False),
        )

        return self.db.scalar(stmt)

    def get_next_occurrence(
        self,
        schedule: CareSchedule,
        *,
        from_datetime: datetime | None = None,
    ) -> datetime | None:

        tz = ZoneInfo(schedule.timezone)

        if from_datetime is None:
            now = datetime.now(tz)
        else:
            if from_datetime.tzinfo is None:
                from_datetime = from_datetime.replace(tzinfo=tz)

            now = from_datetime.astimezone(tz)

        start_date = schedule.starts_on

        candidate = datetime.combine(
            start_date,
            schedule.scheduled_time,
            tzinfo=tz,
        )

        if candidate < now:
            if schedule.frequency_type == "DAYS":
                days_since_start = (now.date() - start_date).days

                intervals_passed = days_since_start // schedule.interval

                candidate_date = start_date + timedelta(
                    days=(intervals_passed + 1) * schedule.interval
                )

                candidate = datetime.combine(
                    candidate_date,
                    schedule.scheduled_time,
                    tzinfo=tz,
                )

            elif schedule.frequency_type == "WEEKS":
                days_since_start = (now.date() - start_date).days

                weeks_since_start = days_since_start // 7

                intervals_passed = weeks_since_start // schedule.interval

                candidate_date = start_date + timedelta(
                    weeks=(intervals_passed + 1) * schedule.interval
                )

                candidate = datetime.combine(
                    candidate_date,
                    schedule.scheduled_time,
                    tzinfo=tz,
                )

        if schedule.ends_on and candidate.date() > schedule.ends_on:
            return None

        return candidate

    def _get_user_plant(
        self,
        *,
        user_id: int,
        plant_id: int,
    ) -> Plant:
        stmt = select(Plant).where(
            Plant.id == plant_id,
            Plant.user_id == user_id,
        )

        plant = self.db.scalar(stmt)

        if plant is None:
            raise ValueError("Plant not found")

        return plant

    @staticmethod
    def _validate_schedule(
        *,
        frequency_type: str,
        interval: int,
        timezone: str,
        starts_on: date | None,
        ends_on: date | None,
    ) -> None:
        if frequency_type not in {"DAYS", "WEEKS"}:
            raise ValueError("frequency_type must be DAYS or WEEKS")

        if interval <= 0:
            raise ValueError("interval must be greater than 0")

        try:
            ZoneInfo(timezone)
        except ZoneInfoNotFoundError:
            raise ValueError(f"Invalid timezone: {timezone}")

        if starts_on is not None and ends_on is not None and ends_on < starts_on:
            raise ValueError("ends_on cannot be before starts_on")

    def save_calendar_event(
        self,
        *,
        schedule: CareSchedule,
        google_event: dict,
        event_start_at: datetime,
        event_end_at: datetime,
    ) -> CareScheduleCalendarEvent:
        calendar_event = CareScheduleCalendarEvent(
            care_schedule_id=schedule.id,
            google_event_id=google_event["id"],
            calendar_id="primary",
            event_start_at=event_start_at,
            event_end_at=event_end_at,
            status="ACTIVE",
        )

        self.db.add(calendar_event)
        self.db.flush()

        return calendar_event

    def get_schedule_for_user(
        self,
        *,
        schedule_id: int,
        user_id: int,
    ) -> CareSchedule | None:
        stmt = (
            select(CareSchedule)
            .join(Plant, Plant.id == CareSchedule.plant_id)
            .where(
                CareSchedule.id == schedule_id,
                Plant.user_id == user_id,
            )
        )

        return self.db.scalar(stmt)

    def get_schedules_for_user(
        self, *, user_id: int, plant_id: int
    ) -> list[CareSchedule]:
        stmt = (
            select(CareSchedule)
            .join(Plant, Plant.id == CareSchedule.plant_id)
            .where(
                Plant.user_id == user_id,
                CareSchedule.plant_id == plant_id,
                CareSchedule.deleted_by_user == False,
            )
            .order_by(CareSchedule.id.asc())
        )

        return list(self.db.scalars(stmt).all())

    def update_schedule(
        self,
        *,
        schedule_id: int,
        user_id: int,
        description: str | None = None,
        frequency_type: str | None = None,
        interval: int | None = None,
        scheduled_time: time | None = None,
        timezone: str | None = None,
        is_active: bool | None = None,
        auto_schedule: bool | None = None,
    ) -> CareSchedule | None:

        schedule = self.get_schedule_for_user(
            schedule_id=schedule_id,
            user_id=user_id,
        )

        if schedule is None or schedule.deleted_by_user is not False:
            return None

        if frequency_type is not None:
            schedule.frequency_type = frequency_type

        if interval is not None:
            schedule.interval = interval

        if timezone is not None:
            schedule.timezone = timezone

        self._validate_schedule(
            frequency_type=schedule.frequency_type,
            interval=schedule.interval,
            timezone=schedule.timezone,
            starts_on=schedule.starts_on,
            ends_on=schedule.ends_on,
        )

        if description is not None:
            schedule.description = description

        if scheduled_time is not None:
            schedule.scheduled_time = scheduled_time

        if is_active is not None:
            schedule.is_active = is_active

        if auto_schedule is not None:
            schedule.auto_schedule = auto_schedule

        self.db.flush()

        return schedule
