from celery import shared_task

from .backup import DatabaseBackupService


@shared_task(
    name="daily_database_backup"
)
def daily_database_backup():

    service = DatabaseBackupService()

    backup_path = service.create_backup()

    return {
        "status": "success",
        "file": backup_path,
    }