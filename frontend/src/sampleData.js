// Stand-in data for the pages whose API calls don't exist yet.
// It matches database/seed.sql for user 1 (Alex), and the field names match what the queries return,
// so swapping in the real API later doesn't change the pages.

// The 6 dashboard queries' results (docs/query_results.md).
export const SAMPLE_STATS = {
  responseRate: [
    { source: "Referral", applications: 2, replies: 2, reply_rate_pct: 100 },
    { source: "Handshake", applications: 4, replies: 2, reply_rate_pct: 50 },
    { source: "Company site", applications: 2, replies: 0, reply_rate_pct: 0 },
    { source: "LinkedIn", applications: 1, replies: 0, reply_rate_pct: 0 },
  ],
  daysToReply: [
    { job_type: "Internship", avg_days_to_reply: 12.0 },
    { job_type: "Full-time", avg_days_to_reply: 5.5 },
  ],
  ghosted: [
    { company: "Brightpath Software", ghosted: 2 },
    { company: "Acme Robotics", ghosted: 1 },
  ],
  reposts: [{ company: "Acme Robotics", title: "Software Engineering Intern", applied_to: 1, repost: 2 }],
  weekly: [
    { year_week: 202624, applications: 2, running_total: 2 },
    { year_week: 202625, applications: 1, running_total: 3 },
    { year_week: 202627, applications: 1, running_total: 4 },
    { year_week: 202628, applications: 2, running_total: 6 },
    { year_week: 202630, applications: 1, running_total: 7 },
    { year_week: 202641, applications: 1, running_total: 8 },
    { year_week: 202644, applications: 1, running_total: 9 },
  ],
  companyRank: [
    { company: "Lakeshore Health", applications: 2, replies: 2, reply_rate_pct: 100, company_rank: 1 },
    { company: "Acme Robotics", applications: 2, replies: 1, reply_rate_pct: 50, company_rank: 2 },
    { company: "Brightpath Software", applications: 2, replies: 0, reply_rate_pct: 0, company_rank: 3 },
    { company: "Northwind Insurance", applications: 2, replies: 0, reply_rate_pct: 0, company_rank: 3 },
  ],
};

// The 10 seed postings. mine = Alex added it; my_status = Alex's application status (null = not applied).
export const SAMPLE_POSTINGS = [
  { posting_id: 1, company: "Acme Robotics", industry: "Manufacturing", title: "Software Engineering Intern", job_type: "Internship", location: "Milwaukee, WI", mine: true, my_status: "Rejected", possible_repost: false },
  { posting_id: 2, company: "Acme Robotics", industry: "Manufacturing", title: "Software Engineering Intern", job_type: "Internship", location: "Milwaukee, WI", mine: false, my_status: null, possible_repost: true },
  { posting_id: 3, company: "Acme Robotics", industry: "Manufacturing", title: "Controls Engineer", job_type: "Full-time", location: "Milwaukee, WI", mine: true, my_status: "Applied", possible_repost: false },
  { posting_id: 4, company: "Lakeshore Health", industry: "Healthcare", title: "Data Analyst Intern", job_type: "Internship", location: "Chicago, IL", mine: true, my_status: "Interview", possible_repost: false },
  { posting_id: 5, company: "Lakeshore Health", industry: "Healthcare", title: "Software Developer", job_type: "Full-time", location: "Chicago, IL", mine: true, my_status: "Offer", possible_repost: false },
  { posting_id: 6, company: "Brightpath Software", industry: "Software", title: "Backend Engineer", job_type: "Full-time", location: "Remote", mine: true, my_status: "Applied", possible_repost: false },
  { posting_id: 7, company: "Brightpath Software", industry: "Software", title: "Frontend Intern", job_type: "Internship", location: "Remote", mine: true, my_status: "Applied", possible_repost: false },
  { posting_id: 8, company: "Northwind Insurance", industry: "Insurance", title: "IT Intern", job_type: "Internship", location: "Madison, WI", mine: true, my_status: "Withdrawn", possible_repost: false },
  { posting_id: 9, company: "Cobalt Energy", industry: "Energy", title: "Software Engineer", job_type: "Full-time", location: "Minneapolis, MN", mine: true, my_status: "Screen", possible_repost: false },
  { posting_id: 10, company: "Northwind Insurance", industry: "Insurance", title: "Software Engineer", job_type: "Full-time", location: "Madison, WI", mine: false, my_status: "Applied", possible_repost: false },
];
