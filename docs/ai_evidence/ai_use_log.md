# AI-Use Record: CSC 3320 Term Project

Joey LoDuca, solo project: Job-Application Tracker

The project description asks for these fields on every meaningful AI interaction: stage, tool, task, recommendation, affected component, decision (accepted/revised/rejected), verification, responsible student, and lesson learned. Lines marked **TODO (Joey)** need your own words. This file moves into the repo as `/docs/ai_evidence/` in Week 9.

## 1. Choosing the project

- **Date and stage:** 2026-10-29, Week 8 (proposal)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Brainstorm term-project ideas that meet the solo scope, then narrow them to the easiest ones that still meet every requirement.
- **AI recommendation:** About 60 ideas over several rounds. The first recommendation was a meal-prep planner. When asked for the easiest options that still meet every requirement, it ranked a dining-hall ratings app (easiest to build), a job-application tracker (easiest to defend), and a coffee-shop ordering app (same shape as the class CampusEats data), with a table mapping each one to the solo scope (tables, many-to-many, CRUD areas, queries, business rules). It also suggested avoiding time-slot overlaps, row locking, recursive queries, unit conversions, and outside APIs.
- **Affected component:** Project topic and scope
- **Decision:** Accepted the job-application tracker, solo. Did not take the meal-prep planner (the first recommendation).
- **Verification:** TODO (Joey). For example: what you checked against Section 2 of the project description, and why you passed on meal prep.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 2. Technology stack

- **Date and stage:** 2026-10-29, Week 8 (proposal)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Pick a technology stack and explain why it fits (proposal section 3).
- **AI recommendation:** MySQL 8.0 with Workbench, Python 3.12 with FastAPI for the back end, mysql-connector-python with plain parameterized SQL instead of an ORM, React (Vite) for the front end, and pytest with FastAPI's TestClient against a separate test database.
- **Affected component:** Whole application (back end, front end, testing)
- **Decision:** Accepted. I asked whether FastAPI is simple. The answer was yes (endpoints are plain functions, input checking is automatic, and /docs lets you test without a front end), and the harder parts will be login and connecting React to the API.
- **Verification:** TODO (Joey)
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 3. AI plan (proposal section 5)

- **Date and stage:** 2026-10-29, Week 8 (proposal)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Draft the AI plan: anticipated uses, risks, and verification.
- **AI recommendation:** Three planned uses (design and docs, including drafting documents like the proposal; drafting the harder SQL, the trigger, and indexes; code and tests), four risks, and five verification steps.
- **Affected component:** How AI is used for the rest of the project
- **Decision:** Revised. I changed the planned uses so AI reviews the documents I write to check them against the requirements instead of drafting them, and helps me work through the harder queries instead of writing them. The risks and verification steps were accepted.
- **Reason:** TODO (Joey)
- **Verification:** TODO (Joey)
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)


## 4. Week 9–10 build: repo, schema, seed data, and evidence scripts

- **Date and stage:** 2026-11-05, Weeks 9–10 (environment, and database)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Set up the repo and build the Week 9–10 database work, explaining each step along the way.
- **AI recommendation:** Created the repo structure and README, a .gitignore and .env.example so credentials live only in .env, and a Python virtual environment. Wrote schema.sql from the proposal's 4-table design (keys, delete rules, UNIQUE and CHECK constraints), a setup script that rebuilds the database and creates a limited MySQL user, and a connection check.
- **Affected component:** Repository, database schema, seed data,  setup and evidence scripts, README
- **Decision:** TODO (Joey): accepted, revised, or rejected, after going through each file.
- **Verification:**  TODO (Joey): re-check a couple of the results by hand.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 5. Security plan

- **Date and stage:** 2026-10-29 to 2026-11-05, Weeks 8–10 (proposal, then setup)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Come up with the security plan for proposal section 4, then explain how it matches the project description and what's already working.
- **AI recommendation:** Helped come up with the seven security ideas in the proposal: `%s` parameters instead of SQL built from strings, server-side checks with Pydantic and the business rules, bcrypt password hashes with an expiring login token, a MySQL user limited to SELECT, INSERT, UPDATE and DELETE on jobtrail, credentials only in a git-ignored `.env`, filtering every application query by the logged-in user's id, and short general error messages (the last one was added during the 11-02 requirements review). On 11-05 it matched each idea to the project description's security list (parameterized queries, server-side validation, credential protection, safe errors, least privilege, authentication/authorization) and showed which ones already work: parameterized queries in the scripts, the limited MySQL user, `.env`, and the per-user filter.
- **Affected component:** Proposal section 4 (security plan); `backend/db.py`, `database/setup.py`, `.env.example`, `.gitignore`
- **Decision:** TODO (Joey): accepted, revised, or rejected, and which ideas were your own.
- **Verification:** `check_connection.py` shows the app user has only SELECT, INSERT, UPDATE and DELETE on jobtrail (`docs/connection_check.txt`); `git check-ignore` confirmed `.env` won't be committed; `crud_demo.py`'s privacy step returned no rows for another user's application (`docs/crud_demo_output.md`). TODO (Joey): confirm.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey). For example: what you'd do differently after the root password ended up in the chat on 11-05.
