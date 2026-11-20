import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getApplications, getDashboardStats } from "../api.js";
import { OPEN_STATUSES, formatDate, isGhosted, weekStartLabel } from "../format.js";
import Alert from "../components/Alert.jsx";
import Icon from "../components/Icon.jsx";

// The 4 summary cards come from your real applications, so they change when you update a status.
function summaryCards(applications) {
  if (!applications) {
    return ["Applications", "Reply rate", "Still open", "Ghosted"].map((label) => ({ label, value: "—", note: "" }));
  }
  const total = applications.length;
  const replies = applications.filter((app) => app.responded_on).length;
  const firstApplied = applications.map((app) => app.applied_on).sort()[0];
  return [
    { label: "Applications", value: total, note: firstApplied ? `Since ${formatDate(firstApplied)}` : "None yet" },
    { label: "Reply rate", value: `${total ? Math.round((100 * replies) / total) : 0}%`, note: `${replies} of ${total} got a reply` },
    { label: "Still open", value: applications.filter((app) => OPEN_STATUSES.includes(app.status)).length, note: "Applied, Screen, Interview or Offer" },
    { label: "Ghosted", value: applications.filter(isGhosted).length, note: "No reply after 3+ months" },
  ];
}

export default function Dashboard() {
  const [applications, setApplications] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch((err) => setError(`Couldn't load your applications: ${err.message}`));
    getDashboardStats().then(setStats);
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Hi Alex, here's how your search is going.</p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <Icon name="plus" strokeWidth={2.2} />
          Log application
        </Link>
      </header>

      {error && <Alert kind="error">{error}</Alert>}

      <section className="kpis" aria-label="Summary">
        {summaryCards(applications).map((card) => (
          <div key={card.label} className="card kpi">
            <div className="kpi-label">{card.label}</div>
            <div className="kpi-value">{card.value}</div>
            <div className="kpi-note">{card.note}</div>
          </div>
        ))}
      </section>

      {stats && <Charts stats={stats} />}
    </div>
  );
}

// One card per dashboard query. Sample data for now (see api.js).
function Charts({ stats }) {
  const mostInAWeek = Math.max(...stats.weekly.map((week) => week.applications));
  const longestWait = Math.max(...stats.daysToReply.map((row) => row.avg_days_to_reply));

  return (
    <>
      <p className="note">The charts below use sample data until the stats API is built.</p>
      <div className="chart-grid">
        <section className="card">
          <h2>Response rate by source</h2>
          <p className="card-text">Share of applications from each source that got any reply.</p>
          <div className="bar-rows">
            {stats.responseRate.map((row) => (
              <div key={row.source} className="bar-row">
                <span>{row.source}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${row.reply_rate_pct}%` }} />
                </div>
                <span className="bar-value">
                  <strong>{row.reply_rate_pct}%</strong> · {row.replies} of {row.applications}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Applications per week</h2>
          <p className="card-text">Weeks you applied in, with a running total.</p>
          <div className="columns">
            {stats.weekly.map((week) => (
              <div key={week.year_week} className="column">
                <div className="column-plot">
                  {week.applications}
                  <div className="column-bar" style={{ height: `${(week.applications / mostInAWeek) * 96}px` }} />
                </div>
                <span className="column-label">{weekStartLabel(week.year_week)}</span>
                <span className="column-total">total {week.running_total}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Companies ranked by reply rate</h2>
          <p className="card-text">Companies you've applied to at least twice.</p>
          <ol className="stat-list">
            {stats.companyRank.map((row) => (
              <li key={row.company}>
                <span className={row.company_rank === 1 ? "rank first" : "rank"}>{row.company_rank}</span>
                <div className="stat-grow">
                  <div className="stat-name">{row.company}</div>
                  <div className="stat-sub">
                    {row.replies} of {row.applications} replied
                  </div>
                </div>
                <span className="stat-big">{row.reply_rate_pct}%</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card">
          <h2>Days to a reply by job type</h2>
          <p className="card-text">Average days from applying to the first reply.</p>
          <div className="bar-stack">
            {stats.daysToReply.map((row) => (
              <div key={row.job_type}>
                <div className="bar-head">
                  {row.job_type}
                  <span>
                    <strong>{row.avg_days_to_reply.toFixed(1)}</strong> days
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(row.avg_days_to_reply / longestWait) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Ghosted by company</h2>
          <p className="card-text">Still at Applied 3+ months after you applied.</p>
          <ul className="stat-list">
            {stats.ghosted.map((row) => (
              <li key={row.company}>
                <span className="tile-icon">
                  <Icon name="hourglass" size={16} />
                </span>
                <span className="stat-grow stat-name">{row.company}</span>
                <span className="stat-sub">
                  {row.ghosted} {row.ghosted === 1 ? "application" : "applications"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Possible reposts</h2>
          <p className="card-text">A newer posting with the same company and title as one you applied to.</p>
          {stats.reposts.map((row) => (
            <div key={row.repost} className="callout">
              <span className="callout-icon">
                <Icon name="repost" />
              </span>
              <div>
                <strong>
                  {row.company} · {row.title}
                </strong>
                You applied to posting #{row.applied_to}. Posting #{row.repost} has the same company and title, so
                it's probably a repost. <Link to="/postings">See postings</Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
