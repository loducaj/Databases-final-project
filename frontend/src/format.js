// Small helpers shared by the pages.

export const STATUSES = ["Applied", "Screen", "Interview", "Offer", "Accepted", "Declined", "Rejected", "Withdrawn"];
export const OPEN_STATUSES = ["Applied", "Screen", "Interview", "Offer"];

// "2026-10-28" -> a local date. new Date("2026-10-28") would read it as UTC and show Oct 27 here.
function parseDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(isoDate) {
  if (!isoDate) return "—";
  return parseDate(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function todayIso() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Same rule as dashboard query 3: still Applied 3+ months after applying.
export function isGhosted(app) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 3);
  return app.status === "Applied" && parseDate(app.applied_on) <= cutoff;
}

// Query 5 returns YEARWEEK(date, 1), e.g. 202624. Those are ISO weeks: they start on Monday,
// and week 1 is the week with January 4 in it. This turns one back into "Jun 8".
export function weekStartLabel(yearWeek) {
  const year = Math.floor(yearWeek / 100);
  const week = yearWeek % 100;
  const daysBackToMonday = (new Date(year, 0, 4).getDay() + 6) % 7;
  const monday = new Date(year, 0, 4 - daysBackToMonday + (week - 1) * 7);
  return monday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const statusClass = (status) => `status-${status.toLowerCase()}`;
export const typeClass = (jobType) => `type-${jobType.toLowerCase()}`;
