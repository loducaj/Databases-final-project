-- JobTrail sample data (fake). Small enough to check every query result by hand;
-- the hand-worked answers are in queries.sql. Run after schema.sql.
USE jobtrail;

-- password_hash is a placeholder until the back end hashes real passwords (Week 12).
INSERT INTO app_user (user_id, email, password_hash, name) VALUES
    (1, 'alex@example.com', 'placeholder-hash', 'Alex Demo'),
    (2, 'sam@example.com',  'placeholder-hash', 'Sam Demo');

INSERT INTO company (company_id, name, industry) VALUES
    (1, 'Acme Robotics',       'Manufacturing'),
    (2, 'Lakeshore Health',    'Healthcare'),
    (3, 'Brightpath Software', 'Software'),
    (4, 'Northwind Insurance', 'Insurance'),
    (5, 'Cobalt Energy',       'Energy');

-- Posting 2 reposts posting 1 (same company and title). Postings 9 and 10 share a
-- title at different companies, so they are not a repost.
INSERT INTO job_posting (posting_id, company_id, title, job_type, location, created_by) VALUES
    (1,  1, 'Software Engineering Intern', 'Internship', 'Milwaukee, WI',   1),
    (2,  1, 'Software Engineering Intern', 'Internship', 'Milwaukee, WI',   2),
    (3,  1, 'Controls Engineer',           'Full-time',  'Milwaukee, WI',   1),
    (4,  2, 'Data Analyst Intern',         'Internship', 'Chicago, IL',     1),
    (5,  2, 'Software Developer',          'Full-time',  'Chicago, IL',     1),
    (6,  3, 'Backend Engineer',            'Full-time',  'Remote',          1),
    (7,  3, 'Frontend Intern',             'Internship', 'Remote',          1),
    (8,  4, 'IT Intern',                   'Internship', 'Madison, WI',     1),
    (9,  5, 'Software Engineer',           'Full-time',  'Minneapolis, MN', 1),
    (10, 4, 'Software Engineer',           'Full-time',  'Madison, WI',     2);

-- responded_on = date of the first reply (NULL = no reply yet).
-- Applications 1-9 are Alex's; 10-12 are Sam's. Both applied to posting 1.
INSERT INTO application (application_id, user_id, posting_id, applied_on, applied_via, status, responded_on) VALUES
    (1,  1, 1,  '2026-06-08', 'Handshake',    'Rejected',  '2026-06-22'),
    (2,  1, 3,  '2026-06-10', 'Company site', 'Applied',   NULL),
    (3,  1, 4,  '2026-06-15', 'Handshake',    'Interview', '2026-06-25'),
    (4,  1, 5,  '2026-07-01', 'Referral',     'Offer',     '2026-07-08'),
    (5,  1, 6,  '2026-07-06', 'Company site', 'Applied',   NULL),
    (6,  1, 7,  '2026-07-08', 'Handshake',    'Applied',   NULL),
    (7,  1, 8,  '2026-07-20', 'LinkedIn',     'Withdrawn', NULL),
    (8,  1, 9,  '2026-10-05', 'Referral',     'Screen',    '2026-10-09'),
    (9,  1, 10, '2026-10-28', 'Handshake',    'Applied',   NULL),
    (10, 2, 1,  '2026-06-09', 'Handshake',    'Screen',    '2026-06-16'),
    (11, 2, 2,  '2026-10-12', 'Handshake',    'Applied',   NULL),
    (12, 2, 6,  '2026-10-14', 'Referral',     'Applied',   NULL);
