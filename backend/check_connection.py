"""Week 9 evidence: connects as the app's limited MySQL user and shows what it can see."""
from db import get_connection

conn = get_connection()
cur = conn.cursor()

cur.execute("SELECT CURRENT_USER(), DATABASE(), VERSION()")
user, database, version = cur.fetchone()
print(f"Connected as {user} to database '{database}' (MySQL {version})")

print("Privileges:")
cur.execute("SHOW GRANTS")
for (grant,) in cur.fetchall():
    print("  " + grant)

print("Rows per table:")
cur.execute(
    "SELECT 'app_user', COUNT(*) FROM app_user"
    " UNION ALL SELECT 'company', COUNT(*) FROM company"
    " UNION ALL SELECT 'job_posting', COUNT(*) FROM job_posting"
    " UNION ALL SELECT 'application', COUNT(*) FROM application"
)
for table, rows in cur.fetchall():
    print(f"  {table}: {rows}")
conn.close()
