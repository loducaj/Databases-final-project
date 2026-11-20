import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { deleteApplication, getApplications, updateStatus } from "../api.js";
import { OPEN_STATUSES, STATUSES, formatDate, isGhosted, statusClass } from "../format.js";
import Alert from "../components/Alert.jsx";
import Icon from "../components/Icon.jsx";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
];

const isOpen = (app) => OPEN_STATUSES.includes(app.status);

export default function Applications() {
  const location = useLocation();
  const [applications, setApplications] = useState(null);
  // "Log an application" sends a message here when it comes back to this page.
  const [message, setMessage] = useState(location.state?.message ?? null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch((err) => setMessage({ kind: "error", text: `Couldn't load your applications: ${err.message}` }));
  }, []);

  async function changeStatus(app, newStatus) {
    setSavingId(app.application_id);
    setMessage(null);
    try {
      const saved = await updateStatus(app.application_id, newStatus);
      // Show what the database saved, including a first-reply date it may have just set.
      setApplications((rows) => rows.map((row) => (row.application_id === saved.application_id ? saved : row)));
      setMessage({ kind: "success", text: `${saved.company}: ${app.status} → ${saved.status}` });
    } catch (err) {
      // Nothing changed, so the dropdown goes back to the saved status.
      setMessage({ kind: "error", text: err.message });
    } finally {
      setSavingId(null);
    }
  }

  async function remove(app) {
    await deleteApplication(app.application_id);
    setApplications((rows) => rows.filter((row) => row.application_id !== app.application_id));
    setMessage({
      kind: "info",
      text: `Removed ${app.title} at ${app.company} from this list. Deleting from the database isn't connected yet.`,
    });
  }

  const all = applications ?? [];
  const counts = { all: all.length, open: all.filter(isOpen).length };
  counts.closed = counts.all - counts.open;
  const term = search.trim().toLowerCase();
  const visible = all
    .filter((app) => filter === "all" || (filter === "open") === isOpen(app))
    .filter((app) => `${app.company} ${app.title}`.toLowerCase().includes(term));

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Applications</h1>
          <p>
            {counts.all} applications · {counts.open} still open
          </p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <Icon name="plus" strokeWidth={2.2} />
          Log application
        </Link>
      </header>

      <div className="toolbar">
        <div className="chips">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className="chip"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="chip-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <div className="search">
          <label htmlFor="app-search" className="visually-hidden">
            Search applications
          </label>
          <Icon name="search" size={16} />
          <input
            id="app-search"
            type="search"
            placeholder="Search company or title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <Alert kind={message.kind} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <div className="card table-card">
        <div className="table-inner">
          <div className="table-head apps-cols" aria-hidden="true">
            <span>Job</span>
            <span>Applied</span>
            <span>Via</span>
            <span>First reply</span>
            <span>Status</span>
            <span />
          </div>
          <ul className="table-rows">
            {visible.map((app) => (
              <li key={app.application_id} className="table-row apps-cols">
                <div>
                  <div className="cell-title">{app.title}</div>
                  <div className="cell-sub">{app.company}</div>
                </div>
                <span>{formatDate(app.applied_on)}</span>
                <span>{app.applied_via}</span>
                <div className="cell-stack">
                  {formatDate(app.responded_on)}
                  {isGhosted(app) && <span className="badge badge-warn">Ghosted</span>}
                </div>
                <span className={`status-select ${statusClass(app.status)}`}>
                  <select
                    aria-label={`Status for ${app.title} at ${app.company}`}
                    value={app.status}
                    disabled={savingId === app.application_id}
                    onChange={(e) => changeStatus(app, e.target.value)}
                  >
                    {STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <Icon name="chevron" size={14} strokeWidth={2.4} />
                </span>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Delete ${app.title} at ${app.company}`}
                  onClick={() => remove(app)}
                >
                  <Icon name="trash" />
                </button>
              </li>
            ))}
          </ul>
          {applications && visible.length === 0 && <p className="empty">No applications match.</p>}
        </div>
      </div>
    </div>
  );
}
