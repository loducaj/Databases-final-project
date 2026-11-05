"""Opens MySQL connections with the settings in .env, so no password is ever in the code."""
import os
from pathlib import Path

import mysql.connector
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


def get_connection(admin=False, use_database=True):
    """The app's limited login by default. admin=True is only for database/setup.py."""
    prefix = "MYSQL_ADMIN" if admin else "APP_DB"
    settings = {
        "host": os.environ["MYSQL_HOST"],
        "port": int(os.environ.get("MYSQL_PORT", "3306")),
        "user": os.environ[f"{prefix}_USER"],
        "password": os.environ[f"{prefix}_PASSWORD"],
    }
    if use_database:
        settings["database"] = os.environ["DB_NAME"]
    return mysql.connector.connect(**settings)
