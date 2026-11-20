-- Extra demo data (fake): more open applications for Alex, so there are plenty of status
-- changes to try in the app. Kept out of seed.sql so the hand-worked answers in queries.sql
-- still match. Run it once after setup.py, e.g. in Workbench (File > Open SQL Script, then run).
USE jobtrail;

INSERT INTO company (company_id, name, industry) VALUES
    (6, 'Harbor Logistics',    'Logistics'),
    (7, 'Pinecrest Bank',      'Finance'),
    (8, 'Riverbend Analytics', 'Software');

INSERT INTO job_posting (posting_id, company_id, title, job_type, location, created_by) VALUES
    (11, 6, 'Software Engineer Intern', 'Internship', 'Milwaukee, WI',   1),
    (12, 6, 'Data Engineer',            'Full-time',  'Milwaukee, WI',   1),
    (13, 7, 'Application Developer',    'Full-time',  'Chicago, IL',     1),
    (14, 7, 'QA Engineer Intern',       'Internship', 'Chicago, IL',     1),
    (15, 8, 'Machine Learning Intern',  'Internship', 'Remote',          1),
    (16, 3, 'Full Stack Developer',     'Full-time',  'Remote',          1),
    (17, 5, 'Embedded Software Intern', 'Internship', 'Minneapolis, MN', 1),
    (18, 2, 'Cloud Engineer',           'Full-time',  'Chicago, IL',     1);

-- All Alex's (user 1): 3 Applied, 2 Screen, 2 Interview, 1 Offer.
INSERT INTO application (application_id, user_id, posting_id, applied_on, applied_via, status, responded_on) VALUES
    (13, 1, 11, '2026-11-10', 'Handshake',    'Applied',   NULL),
    (14, 1, 12, '2026-11-12', 'LinkedIn',     'Applied',   NULL),
    (15, 1, 13, '2026-11-03', 'Company site', 'Applied',   NULL),
    (16, 1, 14, '2026-10-20', 'Handshake',    'Screen',    '2026-10-27'),
    (17, 1, 15, '2026-10-22', 'Referral',     'Screen',    '2026-10-30'),
    (18, 1, 16, '2026-10-08', 'Company site', 'Interview', '2026-10-15'),
    (19, 1, 17, '2026-10-01', 'Handshake',    'Interview', '2026-10-09'),
    (20, 1, 18, '2026-09-21', 'Referral',     'Offer',     '2026-09-29');
