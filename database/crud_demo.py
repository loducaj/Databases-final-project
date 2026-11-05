"""Week 10 CRUD evidence: create, read, update and delete for postings and applications,
plus changes MySQL must reject. Runs as the app user in one transaction that is rolled
back at the end, so the seed data is left unchanged. Saves docs/crud_demo_output.md."""
from datetime import date

import mysql.connector

from sqltools import DOCS_DIR, md_table
from db import get_connection

conn = get_connection()
cur = conn.cursor()
report = ["# CRUD and constraint evidence", "",
          f"Run on {date.today()} as the app's limited MySQL user. Every step runs in one "
          "transaction that is rolled back at the end, so the seed data doesn't change.", ""]


def step(label, sql, params=None):
    """Runs one statement and records the SQL, its parameters and the result."""
    report.extend([f"### {label}", "```sql", sql, "```"])
    if params:
        report.append(f"Parameters: `{params}`")
    try:
        cur.execute(sql, params)
        if cur.with_rows:
            report.extend(["", md_table(cur.column_names, cur.fetchall())])
        else:
            report.append(f"\nResult: OK, {cur.rowcount} row(s) affected")
    except mysql.connector.Error as err:
        report.append(f"\nResult: **rejected by MySQL**, error {err.errno}: {err.msg}")
    report.append("")
    print(label)


report.append("## Postings")
step("Create a posting",
     "INSERT INTO job_posting (company_id, title, job_type, location, created_by) VALUES (%s, %s, %s, %s, %s)",
     (3, "QA Intern", "Internship", "Remote", 1))
posting_id = cur.lastrowid
step("Read it back",
     "SELECT p.posting_id, c.name AS company, p.title, p.location FROM job_posting AS p "
     "JOIN company AS c ON c.company_id = p.company_id WHERE p.posting_id = %s",
     (posting_id,))
step("Update it (only the user who added it can, so the WHERE also checks created_by)",
     "UPDATE job_posting SET location = %s WHERE posting_id = %s AND created_by = %s",
     ("Milwaukee, WI", posting_id, 1))
step("Delete it (allowed, because nobody applied to it)",
     "DELETE FROM job_posting WHERE posting_id = %s AND created_by = %s", (posting_id, 1))

report.append("## Applications")
step("Apply to posting 2, the repost (allowed: it's a separate posting; query 4 is what flags it)",
     "INSERT INTO application (user_id, posting_id, applied_on, applied_via) VALUES (%s, %s, %s, %s)",
     (1, 2, "2026-11-05", "Handshake"))
application_id = cur.lastrowid
step("Update the status after the first reply",
     "UPDATE application SET status = %s, responded_on = %s WHERE application_id = %s AND user_id = %s",
     ("Screen", "2026-11-12", application_id, 1))
step("Read it back (status started as Applied by default, now Screen)",
     "SELECT a.application_id, c.name AS company, p.title, a.applied_on, a.status, a.responded_on "
     "FROM application AS a JOIN job_posting AS p ON p.posting_id = a.posting_id "
     "JOIN company AS c ON c.company_id = p.company_id WHERE a.application_id = %s AND a.user_id = %s",
     (application_id, 1))
step("Delete it", "DELETE FROM application WHERE application_id = %s AND user_id = %s", (application_id, 1))
step("Privacy: Alex (user 1) asks for Sam's application 10, but every query filters by the logged-in user",
     "SELECT application_id, status FROM application WHERE application_id = %s AND user_id = %s", (10, 1))

report.append("## Changes MySQL must reject")
step("Rule 1: apply to the same posting twice",
     "INSERT INTO application (user_id, posting_id, applied_on, applied_via) VALUES (%s, %s, %s, %s)",
     (1, 1, "2026-11-05", "Handshake"))
step("Rule 3: a reply dated before the application",
     "INSERT INTO application (user_id, posting_id, applied_on, applied_via, status, responded_on) "
     "VALUES (%s, %s, %s, %s, %s, %s)",
     (1, 2, "2026-11-05", "Handshake", "Screen", "2026-11-01"))
step("A status that isn't one of the 8 allowed values",
     "UPDATE application SET status = %s WHERE application_id = %s", ("Ghosted", 2))
step("Delete a company that still has postings (RESTRICT)", "DELETE FROM company WHERE company_id = %s", (1,))
step("Delete a posting someone applied to (RESTRICT)", "DELETE FROM job_posting WHERE posting_id = %s", (1,))

report.append("## Delete rules when a user deletes their account")
counts = ("SELECT (SELECT COUNT(*) FROM application WHERE user_id = 2) AS sams_applications, "
          "(SELECT COUNT(*) FROM job_posting WHERE posting_id IN (2, 10)) AS postings_sam_added, "
          "(SELECT COUNT(*) FROM job_posting WHERE posting_id IN (2, 10) AND created_by IS NULL) AS created_by_null")
step("Before", counts)
step("Delete Sam (user 2)", "DELETE FROM app_user WHERE user_id = %s", (2,))
step("After: Sam's applications are gone (CASCADE); Sam's postings stay with created_by NULL (SET NULL)", counts)

conn.rollback()
report.append("## After ROLLBACK")
step("Row counts are back to the seed data",
     "SELECT (SELECT COUNT(*) FROM app_user) AS users, (SELECT COUNT(*) FROM company) AS companies, "
     "(SELECT COUNT(*) FROM job_posting) AS postings, (SELECT COUNT(*) FROM application) AS applications")
conn.close()

out = DOCS_DIR / "crud_demo_output.md"
out.write_text("\n".join(report), encoding="utf-8")
print(f"Saved {out}")
