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

## 2. Revising proposal section 1 (workflows and stretch goals)

- **Date and stage:** 2026-10-29, Week 8 (proposal)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Draft section 1 of the proposal (problem, users, workflows, MVP, stretch goals).
- **AI recommendation:** A draft with the workflow step "Schedule interviews for an application" and five stretch goals, including read-only sharing with a mentor.
- **Affected component:** Proposal section 1, project scope
- **Decision:** Revised. I asked what "schedule interviews" meant because it sounded like making another job posting; it actually meant recording interviews I already set up, so the step was reworded to "Log interviews for an application (date, round, and type), then record how each one went." I also didn't see why mentor sharing was needed, so it was cut and the stretch goals went from five to four.
- **Verification:** Compared the reworded step against the interview table in the design (one application, several interview rounds). TODO (Joey): confirm or reword.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 3. Dropping the skills tables

- **Date and stage:** 2026-10-29, Week 8 (proposal, database design)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Draft the table design for the proposal.
- **AI recommendation:** A 10-table design that included `skill` and `posting_skill` (a many-to-many between postings and skills) to support a "skills in jobs that led to interviews" stat. When asked what those tables were for, it explained them and said they were optional, since `application` already makes users and postings many-to-many.
- **Affected component:** Database design (tables, the many-to-many requirement, one dashboard query)
- **Decision:** Rejected `skill` and `posting_skill`. The design is now 8 tables, and the skills stat was replaced with "average days spent at each stage."
- **Reason:** Skills were only one small part of the information the app shows, so they weren't worth two extra tables.
- **Verification:** Checked that the solo minimums still hold without them: 8 tables (4 required), `application` is still a many-to-many between users and postings, and there are still 6+ non-trivial query ideas. TODO (Joey): confirm or reword.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 4. Business rules and constraints

- **Date and stage:** 2026-10-29, Week 8 (proposal, database design)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Draft the business rules and constraints for proposal section 2.
- **AI recommendation:** Six business rules: legal status moves only (a composite foreign key to status_transition, saved in one transaction with the current status), one application per posting (UNIQUE), closing an application cancels its upcoming interviews, no interview before the application date (a trigger, because a CHECK can't read another table), a grad-date check that needs an override note, and privacy for each user's data. Plus NOT NULL and CHECK constraints and ON DELETE CASCADE/RESTRICT rules.
- **Affected component:** Database design (constraints, triggers, transactions)
- **Decision:** Accepted without changes.
- **Verification:** TODO (Joey). For example: for each rule, name what enforces it and the failing case you'll demo in Week 10 (such as trying Rejected → Interview and getting a foreign-key error).
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 5. Assumptions and design decisions

- **Date and stage:** 2026-10-29, Week 8 (proposal, database design)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Draft the assumptions and design decisions for proposal section 2.
- **AI recommendation:** Four assumptions (one kind of user, how an application starts, unique company names, and counting an application as ghosted after 21 days with no status change, with a note that the 7-day reminder stretch goal fires sooner) and four design decisions (shared postings, two deliberate duplicates, rules stored as data, stats calculated instead of stored).
- **Affected component:** Database design and the ghosted-applications dashboard query
- **Decision:** Revised. I changed the ghosted cutoff from 21 days to 3 months, and the 7-day reminder note was dropped. The rest was accepted.
- **Reason:** TODO (Joey)
- **Verification:** TODO (Joey)
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 6. Technology stack

- **Date and stage:** 2026-10-29, Week 8 (proposal)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Pick a technology stack and explain why it fits (proposal section 3).
- **AI recommendation:** MySQL 8.0 with Workbench, Python 3.12 with FastAPI for the back end, mysql-connector-python with plain parameterized SQL instead of an ORM, React (Vite) for the front end, and pytest with FastAPI's TestClient against a separate test database.
- **Affected component:** Whole application (back end, front end, testing)
- **Decision:** Accepted. I asked whether FastAPI is simple. The answer was yes (endpoints are plain functions, input checking is automatic, and /docs lets you test without a front end), and the harder parts will be login and connecting React to the API.
- **Verification:** TODO (Joey)
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 7. AI plan (proposal section 5)

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

## 8. Draft ERD

- **Date and stage:** 2026-10-29, Week 8 (proposal, database design)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Draw the draft ERD for proposal section 2.
- **AI recommendation:** A crow's-foot ERD of the 8 tables with PK, FK, and unique markers, drawn as an SVG and saved as `erd/draft_erd.png`. It shows job_posting.created_by as optional (ON DELETE SET NULL), so a posting other people applied to survives if the person who added it deletes their account.
- **Affected component:** Database design (ERD)
- **Decision:** Accepted, no changes requested. TODO (Joey): confirm after checking it against the table list.
- **Verification:** TODO (Joey). For example: check every table, key, and relationship in the ERD against the table in section 2.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 9. Starting-point reflection (proposal section 6)

- **Date and stage:** 2026-10-29, Week 8 (proposal)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Help turn my notes into the 250–400 word starting-point reflection.
- **AI recommendation:** Gave prompts for the six required topics, organized my notes into paragraphs while keeping my wording, pointed out that the first version was about 130 words and didn't say how I'd check AI's work, and asked follow-up questions (with options to pick from for two of them) until it reached 255 words.
- **Affected component:** Proposal section 6
- **Decision:** Accepted. All of the content came from my answers: my experience, the challenges, why I use AI the way I do, what I want to learn, and the support I need. For why I want to learn this, I picked one of the options it offered.
- **Verification:** TODO (Joey). For example: reread it and confirm every sentence is true and sounds like you.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 10. Requirements review and cutting the proposal to 3 pages

- **Date and stage:** 2026-11-02, Week 8 (proposal)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Check the finished proposal against the Week 8 requirements, then cut it from 6 pages to the required 2–3.
- **AI recommendation:** The review found every required item but six weak spots: the delete rules didn't say what happens to postings when the user who added them deletes their account (the ERD shows SET NULL), the 8 statuses were never listed, normalization was one sentence, the two CRUD areas weren't named, the security plan didn't mention safe error messages, and the test matrix had fewer columns than the project description asks for. To get to 3 pages it dropped the table list (the ERD shows it) and the timeline (not required), turned sub-headings into run-in labels, shortened the query ideas and security bullets, made the ERD and margins smaller, and added four fixes: the SET NULL rule, the full status list, postings and applications named as the two CRUD areas, and a safe-errors bullet. The reflection was kept word for word, and the original 6-page files were left as they were.
- **Affected component:** Proposal sections 1–5
- **Decision:** TODO (Joey): accepted, revised, or rejected, after reading `Term_Project_Proposal_LoDuca_3page.pdf`.
- **Verification:** TODO (Joey). For example: compare it with the 6-page version section by section and confirm nothing you need was lost.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 11. Cutting the design from 8 tables to 4

- **Date and stage:** 2026-11-03, Week 8 (proposal, database design)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Shrink the database design to the 4-table minimum and shorten the scope.
- **AI recommendation:** When I asked whether I needed all 8 tables, it said the minimum is 4 but recommended keeping all 8: the two status lookup tables cost little and let MySQL enforce the legal moves, and interview was the only cut that saved real work. When I asked for 4 tables anyway, it proposed app_user, company, job_posting, and application. Status becomes a column limited by a CHECK, the legal moves are checked in the back end, responded_on records the first reply, status history and interviews become stretch goals, and six query ideas replace the old seven. It redrew the ERD (`erd/draft_erd_4tables.png`) and rebuilt the proposal as `Term_Project_Proposal_LoDuca_4tables`.
- **Affected component:** Database design, ERD, and proposal sections 1, 2, and 4
- **Decision:** Revised. The AI recommended keeping all 8 tables, and I cut the design to 4.
- **Reason:** I have to be able to explain every part of the project myself in the defenses, so I wanted a smaller design I fully understand. TODO (Joey): confirm or reword.
- **Verification:** TODO (Joey). For example: check that the 4-table design still meets every solo minimum (4 tables, a many-to-many, 2 CRUD areas, 5 non-trivial queries, 1 business rule, 1 workflow).
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)

## 12. Week 9–10 build: repo, schema, seed data, queries and evidence scripts

- **Date and stage:** 2026-11-05, Weeks 9–10 (environment, database and queries)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Task:** Set up the repo and build the Week 9–10 database work, explaining each step along the way.
- **AI recommendation:** Created the repo structure and README, a .gitignore and .env.example so credentials live only in .env, and a Python virtual environment. Wrote schema.sql from the proposal's 4-table design (keys, delete rules, UNIQUE and CHECK constraints, plus two indexes tied to queries 3–5), fake seed data designed so every query answer can be worked out by hand, the 6 dashboard queries with those hand-worked answers, a setup script that rebuilds the database and creates a limited MySQL user, a connection check, and scripts that save the query results and the CRUD/constraint evidence in docs/.
- **Affected component:** Repository, database schema, seed data, queries, setup and evidence scripts, README
- **Decision:** TODO (Joey): accepted, revised, or rejected, after going through each file.
- **Verification:** All 6 query results matched the hand-worked answers (docs/query_results.md). crud_demo.py showed MySQL rejecting a duplicate application, a reply dated before the application, an invalid status and two RESTRICT deletes (docs/crud_demo_output.md). TODO (Joey): re-check a couple of the results by hand.
- **Responsible student:** Joey LoDuca
- **Lesson learned:** TODO (Joey)
