-- JobTrail dashboard queries (Week 10). Each one shows stats for one user.
-- @user_id stands in for the logged-in user; the back end will pass it as a %s parameter.
-- "Expected" = worked out by hand from seed.sql for user 1, as of 2026-11-05.
USE jobtrail;
SET @user_id = 1;

-- 1. Response rate by source (GROUP BY; COUNT(responded_on) skips NULLs, so it counts only replies)
-- Expected: Referral 2 of 2 = 100, Handshake 2 of 4 = 50, Company site 0 of 2 = 0, LinkedIn 0 of 1 = 0
SELECT applied_via AS source,
       COUNT(*) AS applications,
       COUNT(responded_on) AS replies,
       ROUND(100 * COUNT(responded_on) / COUNT(*)) AS reply_rate_pct
FROM application
WHERE user_id = @user_id
GROUP BY applied_via
ORDER BY reply_rate_pct DESC;

-- 2. Average days to a reply by job type (join + DATEDIFF + AVG)
-- Expected: Full-time (7 + 4) / 2 = 5.5, Internship (14 + 10) / 2 = 12.0
SELECT p.job_type,
       ROUND(AVG(DATEDIFF(a.responded_on, a.applied_on)), 1) AS avg_days_to_reply
FROM application a
JOIN job_posting p ON p.posting_id = a.posting_id
WHERE a.user_id = @user_id
  AND a.responded_on IS NOT NULL
GROUP BY p.job_type;

-- 3. Ghosted applications by company: still 'Applied' after 3+ months (3-table join + date math)
-- Expected: Brightpath Software 2, Acme Robotics 1 (application 9 is too recent)
SELECT c.name AS company,
       COUNT(*) AS ghosted
FROM application a
JOIN job_posting p ON p.posting_id = a.posting_id
JOIN company c ON c.company_id = p.company_id
WHERE a.user_id = @user_id
  AND a.status = 'Applied'
  AND a.applied_on <= CURDATE() - INTERVAL 3 MONTH
GROUP BY c.name
ORDER BY ghosted DESC;

-- 4. Possible reposts: a newer posting with the same company and title as one I applied to (self-join)
-- Expected: Acme Robotics "Software Engineering Intern": I applied to posting 1, and posting 2 reposts it
SELECT c.name AS company,
       newer.title,
       older.posting_id AS applied_to,
       newer.posting_id AS repost
FROM application a
JOIN job_posting older ON older.posting_id = a.posting_id
JOIN job_posting newer ON newer.company_id = older.company_id
                      AND newer.title = older.title
                      AND newer.posting_id > older.posting_id
JOIN company c ON c.company_id = older.company_id
WHERE a.user_id = @user_id;

-- 5. Applications per week with a running total (CTE + SUM() window function)
-- Expected (year_week = year + week number): 202624: 2, 202625: 1, 202627: 1, 202628: 2,
--   202630: 1, 202641: 1, 202644: 1, with running totals 2, 3, 4, 6, 7, 8, 9
WITH weekly AS (
    SELECT YEARWEEK(applied_on, 1) AS year_week,
           COUNT(*) AS applications
    FROM application
    WHERE user_id = @user_id
    GROUP BY year_week
)
SELECT year_week,
       applications,
       SUM(applications) OVER (ORDER BY year_week) AS running_total
FROM weekly
ORDER BY year_week;

-- 6. Companies ranked by reply rate, at least 2 applications (joins + HAVING + RANK())
-- Expected: 1 Lakeshore Health (100), 2 Acme Robotics (50), then Brightpath Software and Northwind
--   Insurance tied at 3 (0). Cobalt Energy has only 1 application, so HAVING drops it.
SELECT c.name AS company,
       COUNT(*) AS applications,
       COUNT(a.responded_on) AS replies,
       ROUND(100 * COUNT(a.responded_on) / COUNT(*)) AS reply_rate_pct,
       RANK() OVER (ORDER BY COUNT(a.responded_on) / COUNT(*) DESC) AS company_rank
FROM application a
JOIN job_posting p ON p.posting_id = a.posting_id
JOIN company c ON c.company_id = p.company_id
WHERE a.user_id = @user_id
GROUP BY c.name
HAVING COUNT(*) >= 2
ORDER BY company_rank;
