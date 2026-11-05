# Database design notes (Week 10)

## Tables and keys

| Table | Primary key | Other keys | One row per |
|---|---|---|---|
| app_user | user_id | email (UNIQUE) | account |
| company | company_id | name (UNIQUE) | company |
| job_posting | posting_id | company_id → company, created_by → app_user | posting, shared by all users |
| application | application_id | (user_id, posting_id) UNIQUE; user_id → app_user, posting_id → job_posting | user per posting: the many-to-many between users and postings |

## Normalization rationale

- **1NF:** every column holds one value. An application has one current status, and no table has lists or repeated groups of columns.
- **2NF:** application's natural key is the pair (user_id, posting_id). Its other columns (applied_on, applied_via, status, responded_on) describe that one application, so they depend on the whole pair, not on just the user or just the posting. The other tables have one-column keys, so they can't have partial dependencies.
- **3NF:** no column depends on another non-key column. Company details live in company, not job_posting. Storing them in job_posting would repeat them for every posting and create the transitive dependency posting → company → industry.
- **Calculated, not stored:** response rates, days to a reply and ghosted counts come from queries, so they can't go out of date.
- **Trade-off:** status is a column, so the database keeps only the current status and the first reply date, not every change. A status_event history table is a stretch goal.

## Constraints and delete rules

| Constraint | Enforces |
|---|---|
| uq_application_user_posting | Rule 1: one application per user per posting |
| chk_application_status | status is one of the 8 workflow values |
| chk_application_reply_date | Rule 3: responded_on can't be before applied_on (NULL = no reply yet, which passes) |
| fk_application_user, ON DELETE CASCADE | deleting a user deletes their applications |
| fk_posting_creator, ON DELETE SET NULL | a deleted user's postings stay, with created_by set to NULL |
| fk_posting_company and fk_application_posting, ON DELETE RESTRICT | a company with postings, or a posting someone applied to, can't be deleted |
| NOT NULL | email, password_hash, name, company name, title, company_id, user_id, posting_id, applied_on, applied_via, status |

Rules 2 (legal status moves) and 4 (privacy) are enforced in the back end (Week 12).

## Indexes

MySQL indexes every primary key and UNIQUE constraint on its own. It also adds an index for a foreign key unless an existing index already starts with that column.

| Index | Columns | Why |
|---|---|---|
| uq_application_user_posting | user_id, posting_id | Rule 1. Because user_id comes first, it also serves every "my applications" lookup and the user_id foreign key. |
| idx_application_user_applied | user_id, applied_on | Queries 3 (ghosted) and 5 (per week) find one user's applications by date. |
| idx_posting_company_title | company_id, title | Query 4 (reposts) matches postings on company and title. It also covers the company_id foreign key. |
| uq_app_user_email, uq_company_name | email; name | Stop duplicates, and find a user at login or a company by name when adding a posting. |
| fk_application_posting, fk_posting_creator (added by MySQL) | posting_id; created_by | Foreign-key checks, and joins from a posting to its applications. |
