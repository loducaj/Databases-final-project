"""Rebuilds the jobtrail database from schema.sql and seed.sql, then creates the app's
limited MySQL user. Uses the admin login from .env. WARNING: drops the database first."""
import os
import sys

from sqltools import sql_blocks
from db import get_connection

unset = [k for k in ("MYSQL_ADMIN_PASSWORD", "APP_DB_PASSWORD") if os.environ.get(k, "") in ("", "change-me")]
if unset:
    sys.exit("Fill in " + " and ".join(unset) + " in .env first.")

conn = get_connection(admin=True, use_database=False)
cur = conn.cursor()
for filename in ("schema.sql", "seed.sql"):
    for _, _, statement in sql_blocks(filename):
        cur.execute(statement)
    conn.commit()
    print(f"Ran {filename}")

# Least privilege: the app's login can only read and change rows in jobtrail.
app_user, password = os.environ["APP_DB_USER"], os.environ["APP_DB_PASSWORD"]
cur.execute("CREATE USER IF NOT EXISTS %s@'localhost' IDENTIFIED BY %s", (app_user, password))
cur.execute("ALTER USER %s@'localhost' IDENTIFIED BY %s", (app_user, password))
cur.execute("GRANT SELECT, INSERT, UPDATE, DELETE ON jobtrail.* TO %s@'localhost'", (app_user,))
conn.commit()
print(f"MySQL user {app_user} can SELECT, INSERT, UPDATE and DELETE on jobtrail, nothing else")
conn.close()
