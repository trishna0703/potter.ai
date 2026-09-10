from app.services.google_calendar import (
    GoogleCalendarService,
)


def run() -> None:
    GoogleCalendarService.run_backfill_existing_calendar_events()


if __name__ == "__main__":
    run()
