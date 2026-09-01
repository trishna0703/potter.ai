from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.care_schedule import CareSchedule
from app.models.plant import Plant


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
    ) -> CareSchedule:

        plant = self._get_user_plant(
            user_id=user_id,
            plant_id=plant_id,
        )

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
        )

        self.db.add(schedule)
        self.db.flush()

        return schedule

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
