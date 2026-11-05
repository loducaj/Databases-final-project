-- JobTrail schema (MySQL 8.0). Drops and rebuilds the jobtrail database.
-- Run it with database/setup.py, or in Workbench followed by seed.sql.

DROP DATABASE IF EXISTS jobtrail;
CREATE DATABASE jobtrail;
USE jobtrail;

CREATE TABLE app_user (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    email          VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    name           VARCHAR(100) NOT NULL,
    CONSTRAINT uq_app_user_email UNIQUE (email)
);

CREATE TABLE company (
    company_id  INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    industry    VARCHAR(100),
    CONSTRAINT uq_company_name UNIQUE (name)
);

CREATE TABLE job_posting (
    posting_id  INT AUTO_INCREMENT PRIMARY KEY,
    company_id  INT NOT NULL,
    title       VARCHAR(150) NOT NULL,
    job_type    VARCHAR(20),
    location    VARCHAR(100),
    url         VARCHAR(500),
    created_by  INT,
    -- Query 4 (reposts) matches postings on company + title. This index also covers
    -- the company_id foreign key, so MySQL doesn't add a separate one.
    INDEX idx_posting_company_title (company_id, title),
    CONSTRAINT fk_posting_company FOREIGN KEY (company_id)
        REFERENCES company (company_id) ON DELETE RESTRICT,
    CONSTRAINT fk_posting_creator FOREIGN KEY (created_by)
        REFERENCES app_user (user_id) ON DELETE SET NULL
);

CREATE TABLE application (
    application_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    posting_id      INT NOT NULL,
    applied_on      DATE NOT NULL,
    applied_via     VARCHAR(50) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'Applied',
    responded_on    DATE,
    -- Rule 1: one application per user per posting.
    CONSTRAINT uq_application_user_posting UNIQUE (user_id, posting_id),
    -- Queries 3 and 5 find one user's applications by date.
    INDEX idx_application_user_applied (user_id, applied_on),
    CONSTRAINT fk_application_user FOREIGN KEY (user_id)
        REFERENCES app_user (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_application_posting FOREIGN KEY (posting_id)
        REFERENCES job_posting (posting_id) ON DELETE RESTRICT,
    CONSTRAINT chk_application_status CHECK (status IN
        ('Applied', 'Screen', 'Interview', 'Offer', 'Accepted', 'Declined', 'Rejected', 'Withdrawn')),
    -- Rule 3: no reply before the application. A NULL responded_on (no reply yet) passes.
    CONSTRAINT chk_application_reply_date CHECK (responded_on >= applied_on)
);
