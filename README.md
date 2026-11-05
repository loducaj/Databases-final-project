# JobTrail

A job-application tracker for students applying to a lot of jobs at once: one place to log
postings and applications, track each application's status, and see what's working.
CSC 3320 term project (solo), Joey LoDuca.

**Stack:** MySQL 8.0, Python 3.12 (FastAPI back end, Week 12), React front end (Week 13).

## Project structure

| Folder | Contents |
|---|---|
| `database/` | `schema.sql` (tables and constraints), `seed.sql` (sample data), `queries.sql` (dashboard queries), and the scripts that build the database and produce the evidence files |
| `backend/` | `db.py` (connects to MySQL with the settings in `.env`), `check_connection.py` |
| `frontend/` | React app (Week 13) |
| `tests/` | Test matrix and pytest tests (Weeks 12–14) |
| `docs/` | Database design notes, query results, CRUD evidence |
| `docs/ai_evidence/` | AI-use log |

## Setup (Windows)

You need MySQL Server 8.0 (running) and Python 3.12.

1. Clone the repo and open a terminal in its folder.
2. Create a virtual environment and install the packages:
   ```
   py -3.12 -m venv .venv
   .venv\Scripts\pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in both passwords. `.env` is in `.gitignore`, so it is never committed.
   - `MYSQL_ADMIN_PASSWORD`: your MySQL admin (root) password. Only `setup.py` uses it.
   - `APP_DB_PASSWORD`: any new password. `setup.py` creates the app's limited MySQL user with it.
4. Build the database. This **drops and recreates** `jobtrail`, loads the sample data, and creates the app user:
   ```
   .venv\Scripts\python database\setup.py
   ```
5. Check that the app's login works:
   ```
   .venv\Scripts\python backend\check_connection.py
   ```
   It prints `Connected as jobtrail_app@localhost`, that user's privileges (SELECT, INSERT, UPDATE and DELETE on `jobtrail` only), and each table's row count.
6. Optional: regenerate the evidence files in `docs/`:
   ```
   .venv\Scripts\python database\run_queries.py
   .venv\Scripts\python database\crud_demo.py
   ```

Without Python, you can run `database/schema.sql` and then `database/seed.sql` in MySQL Workbench as the admin user. That builds the tables and data but not the app user.

## Security

- Credentials live only in `.env`, never in the code or the repo.
- The app connects as `jobtrail_app`, which can only SELECT, INSERT, UPDATE and DELETE rows in `jobtrail`.
- Every query takes user input as `%s` parameters, never as SQL built from strings.
