"""JobTrail API. Run it from the repo root:
    .venv\\Scripts\\python -m uvicorn main:app --app-dir backend --reload
Then try every call at http://localhost:8000/docs
"""
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel

from db import get_connection

app = FastAPI(title="JobTrail API")

# The 8 statuses from the schema's CHECK constraint. Anything else gets a 422 from FastAPI.
Status = Literal["Applied", "Screen", "Interview", "Offer", "Accepted", "Declined", "Rejected", "Withdrawn"]

# Rule 2: the moves allowed from each status (proposal workflow 3).
# Rejected and Withdrawn are allowed from any open stage; the 4 statuses not listed here are final.
LEGAL_MOVES = {
    "Applied": {"Screen", "Rejected", "Withdrawn"},
    "Screen": {"Interview", "Rejected", "Withdrawn"},
    "Interview": {"Offer", "Rejected", "Withdrawn"},
    "Offer": {"Accepted", "Declined", "Rejected", "Withdrawn"},
}

# One row per application, with its company and posting.
# Rule 4: every query filters by the user's id, so you only ever see your own applications.
APPLICATION_SELECT = """
    SELECT a.application_id, c.name AS company, p.title, a.applied_on,
           a.applied_via, a.status, a.responded_on
    FROM application a
    JOIN job_posting p ON p.posting_id = a.posting_id
    JOIN company c ON c.company_id = p.company_id
    WHERE a.user_id = %s
"""


class StatusChange(BaseModel):
    status: Status


def current_user_id() -> int:
    # Login comes later. Until then every request acts as user 1 (Alex in the seed data).
    return 1


@app.get("/api/applications")
def list_applications(user_id: int = Depends(current_user_id)):
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(APPLICATION_SELECT + " ORDER BY a.applied_on DESC, a.application_id DESC", (user_id,))
        return cur.fetchall()
    finally:
        conn.close()


@app.patch("/api/applications/{application_id}/status")
def change_status(application_id: int, change: StatusChange, user_id: int = Depends(current_user_id)):
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        # FOR UPDATE locks the row until the commit, so nothing can change it between the check and the save.
        cur.execute(
            "SELECT status FROM application WHERE application_id = %s AND user_id = %s FOR UPDATE",
            (application_id, user_id),
        )
        row = cur.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Application not found.")

        current = row["status"]
        if change.status not in LEGAL_MOVES.get(current, set()):
            raise HTTPException(status_code=409, detail=f"Can't move from {current} to {change.status}.")

        # The first reply date is saved automatically. Withdrawing is my move, not a reply,
        # and COALESCE keeps a reply date that's already set.
        if change.status == "Withdrawn":
            sql = "UPDATE application SET status = %s WHERE application_id = %s AND user_id = %s"
        else:
            sql = (
                "UPDATE application SET status = %s, responded_on = COALESCE(responded_on, CURDATE())"
                " WHERE application_id = %s AND user_id = %s"
            )
        cur.execute(sql, (change.status, application_id, user_id))
        conn.commit()

        cur.execute(APPLICATION_SELECT + " AND a.application_id = %s", (user_id, application_id))
        return cur.fetchone()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
