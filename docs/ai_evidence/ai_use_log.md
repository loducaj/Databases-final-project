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

## 6. Setting up the existing repo in VS Code and putting it on GitHub

- **Date and stage:** 2026-11-18, Week 12 (environment)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Find the project repo on my computer, open it in VS Code, and put it on GitHub.
- **AI recommendation:** It first said the repo hadn't been built, because it had only checked GitHub and the proposal folder. When I asked to see the repo, it found it at `C:\jobtrail` (built 11-05 but never pushed) through VS Code's list of recently opened folders, opened it in VS Code, and summarized what was done and what was left. After I made an empty GitHub repo (`Databases-final-project`) and gave it GitHub's push commands, it checked that `.env` was git-ignored and had never been committed, and that no passwords were in any tracked file. Then it committed the 3 files left uncommitted on 11-05 (the simplified queries, their regenerated results, and this log), connected the repo to GitHub, and pushed all 6 commits.
- **Affected component:** Repository (git history and the GitHub remote)
- **Decision:** Accepted. Afterward I told it not to make any more commits. TODO (Joey): confirm or reword.
- **Verification:** After the push, `git status` showed `main` matching `origin/main`, and the file list on GitHub had no `.env`. TODO (Joey): check the repo on GitHub yourself.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 7. First working workflow: changing an application's status

- **Date and stage:** 2026-11-18, Week 12 (back end, rules and security)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Get one workflow running end to end (React → FastAPI → MySQL) for the Week 12 check-in. I picked the status workflow (proposal workflow 3) and had it build the front end first.
- **AI recommendation:** Built a small React page that lists my applications with a status dropdown, then two API calls in `backend/main.py`: GET `/api/applications` and PATCH `/api/applications/{id}/status`.
  - Rule 2 is a `LEGAL_MOVES` dict: Applied → Screen → Interview → Offer → Accepted or Declined, and Rejected or Withdrawn from any open stage. An illegal move gets a 409.
  - Rule 4: every query filters by my user id, so another user's application gets a 404.
  - A status outside the 8 allowed values gets a 422 before any SQL runs.
  - `SELECT … FOR UPDATE` locks the row between the check and the save.
  - The first-reply date fills in automatically on any move except Withdrawn.
  - The dropdown offers all 8 statuses on purpose, so the back end enforces the rule, not the page.
  - Until login exists, every request acts as user 1 (Alex).
- **Affected component:** `backend/main.py`, `requirements.txt` (added fastapi and uvicorn), `frontend/`
- **Decision:** TODO (Joey): accepted, revised, or rejected. One open choice: Applied can't go straight to Interview; it has to pass Screen first. Keep that, or allow the skip?
- **Verification:** It called the API directly:
  - GET returned my 9 applications (1–9; 10–12 are Sam's).
  - Application 1, Rejected → Interview, got 409 "Can't move from Rejected to Interview."
  - Application 10 (Sam's) got 404.
  - The status "Ghosted" got 422.
  - Application 9, Applied → Screen, got 200 with today's reply date. Then it set application 9 back to Applied with a direct UPDATE.
  - A screenshot showed the page's table filled with my applications.
  - TODO (Joey): try the same moves yourself in the page and at http://localhost:8000/docs.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 8. Designing the front end (mockup)

- **Date and stage:** 2026-11-18, Week 12 (front end, an early start on Week 13)
- **Tool:** Claude Code (Claude Opus 5.5) with a Claude Design canvas
- **Task:** Design the full front end for the final project, with a decorative look, before building it.
- **AI recommendation:** It first asked which pages I wanted, whether to connect them to the API yet, and what look. I picked Dashboard, Applications and Postings, front end only for now, and a clean, professional look. When I asked whether login and sign-up were in the proposal, it said yes: the MVP lists accounts, and the security plan has bcrypt passwords and login tokens. So it added Log in and Sign up screens. It then made a clickable 6-screen mockup using the seed data:
  - **Dashboard:** 4 summary numbers and the 6 query results.
  - **Applications:** filters, search, status colors, and the refused-move message.
  - **Log application:** pick a posting or add a new one, saved as one transaction, with a repost warning.
  - **Postings:** list, add form, and the message when a delete is blocked.
  - **Log in** and **Sign up.**
- **Affected component:** Front-end design (pages, layout, look)
- **Decision:** Accepted; I approved the look. TODO (Joey): confirm or reword.
- **Verification:** TODO (Joey). For example: check that each screen matches a feature or query in the proposal.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 9. Building the front end in React

- **Date and stage:** 2026-11-18, Week 12 (front end, an early start on Week 13)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Turn the approved mockup into the real React front end.
- **AI recommendation:** Built the 6 screens as React pages with links between them (React Router). `src/api.js` is the only file that talks to the back end:
  - Its top half calls the real API (listing applications and changing a status).
  - Its bottom half is temporary stand-ins that read `src/sampleData.js`, a copy of the seed data with the same field names as the SQL results. Each stand-in can later be swapped for a real API call without changing any page.
  - Real data so far: the applications list, status changes, and the Dashboard's 4 summary numbers.
  - Still sample data, which resets when the page reloads: the 6 Dashboard charts, postings, saving and deleting an application, and login and sign-up.
  - One change from the mockup: the job-type badge on Postings moved into the job column, because the table was too wide on a 1280-pixel screen.
- **Affected component:** `frontend/` (pages, components, `api.js`, `sampleData.js`, `format.js`, `styles.css`)
- **Decision:** TODO (Joey): accepted, revised, or rejected.
- **Verification:** The build finished with no errors, it took a screenshot of each of the 6 pages, and the browser logged no errors. My own testing changed 4 rows in the real database (applications 2 and 9 to Rejected, 3 to Offer, 4 to Declined), which shows status changes reach MySQL. TODO (Joey): click through each page yourself.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 10. Extra demo data for trying status changes

- **Date and stage:** 2026-11-19, Week 12 (back end, rules and security)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Add more data so I can try more status changes in the app.
- **AI recommendation:** Wrote `database/demo_data.sql`: 3 new companies, 8 postings and 8 applications for Alex, at every open stage (3 Applied, 2 Screen, 2 Interview, 1 Offer). It kept them out of `seed.sql` so the hand-worked answers in `queries.sql` still match the seed. It loaded the file into MySQL with the app's limited login. No restart was needed, because the API reads MySQL on every request.
- **Affected component:** `database/demo_data.sql` (new) and the data in the jobtrail database
- **Decision:** TODO (Joey): accepted, revised, or rejected.
- **Verification:** After loading, the tables had 8 companies, 18 postings and 20 applications. It then ran the workflow through the same path the browser uses and checked MySQL after each step:
  - The API returned 17 applications for Alex, the same as running its query straight in MySQL.
  - Application 13, Applied → Screen, got 200, and MySQL showed Screen with today's reply date.
  - Application 20, Offer → Screen, got 409 and stayed Offer.
  - Application 10 (Sam's) got 404 and didn't change.
  - Then it set application 13 back to Applied.
  - TODO (Joey): look at the new rows in Workbench yourself.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)
