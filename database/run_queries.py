"""Runs every query in queries.sql as the app user and saves the results, next to the
hand-worked expected answers, to docs/query_results.md.
Usage: python database/run_queries.py [user_id]   (default 1)"""
import sys
from datetime import date

from sqltools import DOCS_DIR, md_table, sql_blocks
from db import get_connection

user_id = int(sys.argv[1]) if len(sys.argv) > 1 else 1
conn = get_connection()
cur = conn.cursor()
report = ["# Dashboard query results", "",
          f"Run on {date.today()} for user_id {user_id}, as the app's limited MySQL user.", ""]

for title, notes, statement in sql_blocks("queries.sql"):
    if statement.upper().startswith("SET @USER_ID"):
        cur.execute("SET @user_id = %s", (user_id,))
        continue
    cur.execute(statement)
    if not title:
        continue
    rows = cur.fetchall()
    report += [f"## {title}", "", "> " + " ".join(notes), "",
               "```sql", statement + ";", "```", "", md_table(cur.column_names, rows), ""]
    print(f"{title}: {len(rows)} row(s)")
conn.close()

out = DOCS_DIR / ("query_results.md" if user_id == 1 else f"query_results_user{user_id}.md")
out.write_text("\n".join(report), encoding="utf-8")
print(f"Saved {out}")
