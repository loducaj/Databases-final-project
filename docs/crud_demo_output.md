# CRUD and constraint evidence

Run on 2026-11-05 as the app's limited MySQL user. Every step runs in one transaction that is rolled back at the end, so the seed data doesn't change.

## Postings
### Create a posting
```sql
INSERT INTO job_posting (company_id, title, job_type, location, created_by) VALUES (%s, %s, %s, %s, %s)
```
Parameters: `(3, 'QA Intern', 'Internship', 'Remote', 1)`

Result: OK, 1 row(s) affected

### Read it back
```sql
SELECT p.posting_id, c.name AS company, p.title, p.location FROM job_posting AS p JOIN company AS c ON c.company_id = p.company_id WHERE p.posting_id = %s
```
Parameters: `(11,)`

| posting_id | company | title | location |
|---|---|---|---|
| 11 | Brightpath Software | QA Intern | Remote |

### Update it (only the user who added it can, so the WHERE also checks created_by)
```sql
UPDATE job_posting SET location = %s WHERE posting_id = %s AND created_by = %s
```
Parameters: `('Milwaukee, WI', 11, 1)`

Result: OK, 1 row(s) affected

### Delete it (allowed, because nobody applied to it)
```sql
DELETE FROM job_posting WHERE posting_id = %s AND created_by = %s
```
Parameters: `(11, 1)`

Result: OK, 1 row(s) affected

## Applications
### Apply to posting 2, the repost (allowed: it's a separate posting; query 4 is what flags it)
```sql
INSERT INTO application (user_id, posting_id, applied_on, applied_via) VALUES (%s, %s, %s, %s)
```
Parameters: `(1, 2, '2026-11-05', 'Handshake')`

Result: OK, 1 row(s) affected

### Update the status after the first reply
```sql
UPDATE application SET status = %s, responded_on = %s WHERE application_id = %s AND user_id = %s
```
Parameters: `('Screen', '2026-11-12', 13, 1)`

Result: OK, 1 row(s) affected

### Read it back (status started as Applied by default, now Screen)
```sql
SELECT a.application_id, c.name AS company, p.title, a.applied_on, a.status, a.responded_on FROM application AS a JOIN job_posting AS p ON p.posting_id = a.posting_id JOIN company AS c ON c.company_id = p.company_id WHERE a.application_id = %s AND a.user_id = %s
```
Parameters: `(13, 1)`

| application_id | company | title | applied_on | status | responded_on |
|---|---|---|---|---|---|
| 13 | Acme Robotics | Software Engineering Intern | 2026-11-05 | Screen | 2026-11-12 |

### Delete it
```sql
DELETE FROM application WHERE application_id = %s AND user_id = %s
```
Parameters: `(13, 1)`

Result: OK, 1 row(s) affected

### Privacy: Alex (user 1) asks for Sam's application 10, but every query filters by the logged-in user
```sql
SELECT application_id, status FROM application WHERE application_id = %s AND user_id = %s
```
Parameters: `(10, 1)`

(no rows)

## Changes MySQL must reject
### Rule 1: apply to the same posting twice
```sql
INSERT INTO application (user_id, posting_id, applied_on, applied_via) VALUES (%s, %s, %s, %s)
```
Parameters: `(1, 1, '2026-11-05', 'Handshake')`

Result: **rejected by MySQL**, error 1062: Duplicate entry '1-1' for key 'application.uq_application_user_posting'

### Rule 3: a reply dated before the application
```sql
INSERT INTO application (user_id, posting_id, applied_on, applied_via, status, responded_on) VALUES (%s, %s, %s, %s, %s, %s)
```
Parameters: `(1, 2, '2026-11-05', 'Handshake', 'Screen', '2026-11-01')`

Result: **rejected by MySQL**, error 3819: Check constraint 'chk_application_reply_date' is violated.

### A status that isn't one of the 8 allowed values
```sql
UPDATE application SET status = %s WHERE application_id = %s
```
Parameters: `('Ghosted', 2)`

Result: **rejected by MySQL**, error 3819: Check constraint 'chk_application_status' is violated.

### Delete a company that still has postings (RESTRICT)
```sql
DELETE FROM company WHERE company_id = %s
```
Parameters: `(1,)`

Result: **rejected by MySQL**, error 1217: Cannot delete or update a parent row: a foreign key constraint fails

### Delete a posting someone applied to (RESTRICT)
```sql
DELETE FROM job_posting WHERE posting_id = %s
```
Parameters: `(1,)`

Result: **rejected by MySQL**, error 1217: Cannot delete or update a parent row: a foreign key constraint fails

## Delete rules when a user deletes their account
### Before
```sql
SELECT (SELECT COUNT(*) FROM application WHERE user_id = 2) AS sams_applications, (SELECT COUNT(*) FROM job_posting WHERE posting_id IN (2, 10)) AS postings_sam_added, (SELECT COUNT(*) FROM job_posting WHERE posting_id IN (2, 10) AND created_by IS NULL) AS created_by_null
```

| sams_applications | postings_sam_added | created_by_null |
|---|---|---|
| 3 | 2 | 0 |

### Delete Sam (user 2)
```sql
DELETE FROM app_user WHERE user_id = %s
```
Parameters: `(2,)`

Result: OK, 1 row(s) affected

### After: Sam's applications are gone (CASCADE); Sam's postings stay with created_by NULL (SET NULL)
```sql
SELECT (SELECT COUNT(*) FROM application WHERE user_id = 2) AS sams_applications, (SELECT COUNT(*) FROM job_posting WHERE posting_id IN (2, 10)) AS postings_sam_added, (SELECT COUNT(*) FROM job_posting WHERE posting_id IN (2, 10) AND created_by IS NULL) AS created_by_null
```

| sams_applications | postings_sam_added | created_by_null |
|---|---|---|
| 0 | 2 | 2 |

## After ROLLBACK
### Row counts are back to the seed data
```sql
SELECT (SELECT COUNT(*) FROM app_user) AS users, (SELECT COUNT(*) FROM company) AS companies, (SELECT COUNT(*) FROM job_posting) AS postings, (SELECT COUNT(*) FROM application) AS applications
```

| users | companies | postings | applications |
|---|---|---|---|
| 2 | 5 | 10 | 12 |
