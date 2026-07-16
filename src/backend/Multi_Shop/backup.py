import os
import subprocess
from datetime import datetime

from django.conf import settings


class DatabaseBackupService:

    def create_backup(self):

        backup_dir = os.path.join(
            settings.BASE_DIR,
            "backups"
        )

        os.makedirs(
            backup_dir,
            exist_ok=True
        )

        filename = datetime.now().strftime(
            "backup_%Y_%m_%d_%H_%M.sql"
        )

        filepath = os.path.join(
            backup_dir,
            filename
        )

        database = settings.DATABASES["default"]

        command = [
            "pg_dump",
            "-h",
            database["HOST"],
            "-U",
            database["USER"],
            "-d",
            database["NAME"],
            "-f",
            filepath,
        ]

        env = os.environ.copy()

        env["PGPASSWORD"] = database["PASSWORD"]

        subprocess.run(
            command,
            env=env,
            check=True,
        )

        return filepath