from app.services.google_calendar import run_cron_to_handle_schedules


def run() -> None:
    run_cron_to_handle_schedules()

if __name__ == "__main__":
    run()
