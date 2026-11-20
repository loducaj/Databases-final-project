// Every page talks to the back end through this file.
import { SAMPLE_POSTINGS, SAMPLE_STATS } from "./sampleData.js";

// ---- Real calls to FastAPI. Vite forwards /api to port 8000 (see vite.config.js). ----

async function request(path, options) {
  const response = await fetch(`/api${path}`, options);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    // FastAPI sends its error message in "detail".
    const message = typeof body?.detail === "string" ? body.detail : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body;
}

export function getApplications() {
  return request("/applications");
}

export function updateStatus(applicationId, status) {
  return request(`/applications/${applicationId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

// ---- Stand-ins until these API calls exist. ----
// They use sample data and only change things in the browser, so a page reload resets them.

let postings = SAMPLE_POSTINGS.map((posting) => ({ ...posting }));
// Every seed posting has at least one application (Alex's or Sam's), so MySQL's ON DELETE RESTRICT
// would refuse to delete any of them. New postings start with no applications.
const postingsWithApplications = new Set(SAMPLE_POSTINGS.map((posting) => posting.posting_id));

export function getDashboardStats() {
  return Promise.resolve(SAMPLE_STATS);
}

export function getPostings() {
  return Promise.resolve(postings.map((posting) => ({ ...posting })));
}

export function addPosting(fields) {
  const posting = {
    ...fields,
    posting_id: Math.max(0, ...postings.map((p) => p.posting_id)) + 1,
    mine: true,
    my_status: null,
    possible_repost: false,
  };
  postings.push(posting);
  return Promise.resolve({ ...posting });
}

export function updatePosting(postingId, fields) {
  postings = postings.map((posting) => (posting.posting_id === postingId ? { ...posting, ...fields } : posting));
  return Promise.resolve({ ...postings.find((posting) => posting.posting_id === postingId) });
}

export function deletePosting(postingId) {
  const posting = postings.find((p) => p.posting_id === postingId);
  if (postingsWithApplications.has(postingId)) {
    return Promise.reject(new Error(`Can't delete ${posting.title} at ${posting.company}: someone applied to it.`));
  }
  postings = postings.filter((p) => p.posting_id !== postingId);
  return Promise.resolve();
}

// The real version will save the company (if new), the posting and the application in one transaction.
export function logApplication(application) {
  let postingId = application.posting_id;
  if (!postingId) {
    postingId = Math.max(0, ...postings.map((p) => p.posting_id)) + 1;
    postings.push({ ...application.posting, posting_id: postingId, mine: true, possible_repost: false });
  }
  postings = postings.map((p) => (p.posting_id === postingId ? { ...p, my_status: "Applied" } : p));
  postingsWithApplications.add(postingId);
  return Promise.resolve();
}

export function deleteApplication() {
  return Promise.resolve();
}

export function logIn() {
  return Promise.resolve();
}

export function signUp() {
  return Promise.resolve();
}
