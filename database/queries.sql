-- JobTrail dashboard queries (Week 10 drafts). Each one shows stats for one user.
-- @user_id stands in for the logged-in user; the back end will pass it as a %s parameter.
-- "Expected" = worked out by hand from seed.sql for user 1, as of 2026-11-05.
USE jobtrail;
SET @user_id = 1;

-- 1. Response rate by source (conditional aggregation: the CASE counts only replied rows)
-- Expected: Referral 2/2 = 100.0, Handshake 2/4 = 50.0, Company site 0/2 = 0.0, LinkedIn 0/1 = 0.0
SELECT applied_via AS source,
       COUNT(*) AS applications,
       SUM(CASE WHEN responded_on IS NOT NULL THEN 1 ELSE 0 END) AS replies,
       ROUND(100 * SUM(CASE WHEN responded_on IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*), 1) AS reply_rate_pct
FROM application
WHERE user_id = @user_id
GROUP BY applied_via
ORDER BY reply_rate_pct DESC, source;

-- 2. Days to a reply by job type (join + DATEDIFF + AVG; only applications that got a reply)
-- Expected: Full-time (7 + 4) / 2 = 5.5 days, Internship (14 + 10) / 2 = 12.0 days
SELECT p.job_type,
       COUNT(*) AS replied_applications,
       ROUND(AVG(DATEDIFF(a.responded_on, a.applied_on)), 1) AS avg_days_to_reply
FROM application AS a
JOIN job_posting AS p ON p.posting_id = a.posting_id
WHERE a.user_id = @user_id
  AND a.responded_on IS NOT NULL
GROUP BY p.job_type
ORDER BY avg_days_to_reply;

-- 3. Ghosted applications by company (3-table join + date math): no reply after 3+ months
-- Expected: Brightpath Software 2, Acme Robotics 1. Application 7 was withdrawn and 9 is too recent.
SELECT c.name AS company,
       COUNT(*) AS ghosted
FROM application AS a
JOIN job_posting AS p ON p.posting_id = a.posting_id
JOIN company AS c     ON c.company_id = p.company_id
WHERE a.user_id = @user_id
  AND a.responded_on IS NULL
  AND a.status <> 'Withdrawn'
  AND a.applied_on <= CURDATE() - INTERVAL 3 MONTH
GROUP BY c.company_id, c.name
ORDER BY ghosted DESC, company;

-- 4. Possible reposts (self-join + EXISTS): same company and title, and I applied to one of them
-- Expected: one row, Acme Robotics "Software Engineering Intern", posting 2 looks like a repost of 1
SELECT c.name AS company,
       newer.title,
       newer.posting_id AS posting,
       older.posting_id AS looks_like_repost_of
FROM job_posting AS newer
JOIN job_posting AS older
  ON older.company_id = newer.company_id
 AND older.title = newer.title
 AND older.posting_id < newer.posting_id
JOIN company AS c ON c.company_id = newer.company_id
WHERE EXISTS (
    SELECT 1
    FROM application AS a
    WHERE a.user_id = @user_id
      AND a.posting_id IN (newer.posting_id, older.posting_id)
)
ORDER BY company, posting;

-- 5. Applications per week with a running total (CTE + SUM() window function)
-- Expected weeks (Monday start): 06-08: 2, 06-15: 1, 06-29: 1, 07-06: 2, 07-20: 1, 10-05: 1, 10-26: 1
--          running total: 2, 3, 4, 6, 7, 8, 9
WITH weekly AS (
    SELECT DATE_SUB(applied_on, INTERVAL WEEKDAY(applied_on) DAY) AS week_start,
           COUNT(*) AS applications
    FROM application
    WHERE user_id = @user_id
    GROUP BY week_start
)
SELECT week_start,
       applications,
       SUM(applications) OVER (ORDER BY week_start) AS running_total
FROM weekly
ORDER BY week_start;

-- 6. Companies ranked by response rate, at least 2 applications (joins + HAVING + RANK())
-- Expected: 1 Lakeshore Health 100.0, 2 Acme Robotics 50.0, then Brightpath Software and
--           Northwind Insurance tied at rank 3 with 0.0. Cobalt Energy has only 1 application.
WITH per_company AS (
    SELECT c.name AS company,
           COUNT(*) AS applications,
           SUM(CASE WHEN a.responded_on IS NOT NULL THEN 1 ELSE 0 END) AS replies
    FROM application AS a
    JOIN job_posting AS p ON p.posting_id = a.posting_id
    JOIN company AS c     ON c.company_id = p.company_id
    WHERE a.user_id = @user_id
    GROUP BY c.company_id, c.name
    HAVING COUNT(*) >= 2
)
SELECT company,
       applications,
       replies,
       ROUND(100 * replies / applications, 1) AS reply_rate_pct,
       RANK() OVER (ORDER BY replies / applications DESC) AS company_rank
FROM per_company
ORDER BY company_rank, company;
