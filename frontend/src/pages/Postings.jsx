import { useEffect, useState } from "react";
import { Link } from "react-router";
import { addPosting, deletePosting, getPostings, updatePosting } from "../api.js";
import { statusClass, typeClass } from "../format.js";
import Alert from "../components/Alert.jsx";
import Icon from "../components/Icon.jsx";

const TYPES = ["All", "Internship", "Full-time"];
const EMPTY_FORM = { company: "", industry: "", title: "", job_type: "Internship", location: "", url: "" };

const byCompanyThenTitle = (a, b) =>
  a.company.localeCompare(b.company) || a.title.localeCompare(b.title) || a.posting_id - b.posting_id;

export default function Postings() {
  const [postings, setPostings] = useState([]);
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getPostings().then(setPostings);
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  function startEdit(posting) {
    setEditingId(posting.posting_id);
    setForm({
      company: posting.company,
      industry: posting.industry ?? "",
      title: posting.title,
      job_type: posting.job_type,
      location: posting.location ?? "",
      url: posting.url ?? "",
    });
  }

  function stopEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function save(e) {
    e.preventDefault();
    const fields = { ...form, company: form.company.trim(), title: form.title.trim() };
    if (editingId) {
      const saved = await updatePosting(editingId, fields);
      setPostings((rows) => rows.map((p) => (p.posting_id === editingId ? saved : p)));
      setMessage({ kind: "success", text: `Saved changes to ${saved.title} at ${saved.company}.` });
    } else {
      const saved = await addPosting(fields);
      setPostings((rows) => [...rows, saved]);
      setMessage({ kind: "success", text: `Added ${saved.title} at ${saved.company}.` });
    }
    stopEdit();
  }

  async function remove(posting) {
    try {
      await deletePosting(posting.posting_id);
      setPostings((rows) => rows.filter((p) => p.posting_id !== posting.posting_id));
      if (editingId === posting.posting_id) stopEdit();
      setMessage({ kind: "success", text: `Deleted ${posting.title} at ${posting.company}.` });
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
    }
  }

  const term = search.trim().toLowerCase();
  const visible = postings
    .filter((p) => type === "All" || p.job_type === type)
    .filter((p) => `${p.company} ${p.title}`.toLowerCase().includes(term))
    .sort(byCompanyThenTitle);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>
            Postings <span className="badge badge-sample">Sample data</span>
          </h1>
          <p>The shared job list. Everyone sees these, and you can edit or delete the ones you added.</p>
        </div>
      </header>

      {message && (
        <Alert kind={message.kind} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <div className="split">
        <div className="split-main">
          <div className="toolbar">
            <div className="chips">
              {TYPES.map((t) => (
                <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="search">
              <label htmlFor="posting-search" className="visually-hidden">
                Search postings
              </label>
              <Icon name="search" size={16} />
              <input
                id="posting-search"
                type="search"
                placeholder="Search company or title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="card table-card">
            <div className="table-inner postings">
              <div className="table-head postings-cols" aria-hidden="true">
                <span>Job</span>
                <span>Location</span>
                <span>You</span>
                <span />
              </div>
              <ul className="table-rows">
                {visible.map((p) => (
                  <li key={p.posting_id} className="table-row postings-cols">
                    <div>
                      <div className="cell-title">{p.title}</div>
                      <div className="cell-sub">
                        {p.industry ? `${p.company} · ${p.industry}` : p.company}
                        <span className={`type-badge ${typeClass(p.job_type)}`}>{p.job_type}</span>
                        {p.possible_repost && <span className="badge badge-warn">Possible repost</span>}
                      </div>
                    </div>
                    <span>{p.location || "—"}</span>
                    <div>
                      {p.my_status ? (
                        <span className={`pill ${statusClass(p.my_status)}`}>{p.my_status}</span>
                      ) : (
                        <Link to={`/applications/new?posting=${p.posting_id}`} className="btn btn-soft">
                          Apply
                        </Link>
                      )}
                    </div>
                    <div className="cell-actions">
                      {/* Only the person who added a posting can edit or delete it. */}
                      {p.mine && (
                        <>
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`Edit ${p.title} at ${p.company}`}
                            onClick={() => startEdit(p)}
                          >
                            <Icon name="edit" size={17} />
                          </button>
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`Delete ${p.title} at ${p.company}`}
                            onClick={() => remove(p)}
                          >
                            <Icon name="trash" size={17} />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {visible.length === 0 && <p className="empty">No postings match.</p>}
            </div>
          </div>
        </div>

        <form className="card side-form" onSubmit={save}>
          <div>
            <h2>{editingId ? "Edit posting" : "Add a posting"}</h2>
            <p className="card-text">
              {editingId ? "Your changes show for everyone." : "It joins the shared list for everyone."}
            </p>
          </div>
          <div className="field">
            <label htmlFor="new-company">Company</label>
            <input id="new-company" required placeholder="Company name" value={form.company} onChange={update("company")} />
            <span className="hint">A new company is added in the same step.</span>
          </div>
          <div className="field">
            <label htmlFor="new-industry">
              Industry <span className="optional">(optional)</span>
            </label>
            <input id="new-industry" placeholder="Software, Healthcare…" value={form.industry} onChange={update("industry")} />
          </div>
          <div className="field">
            <label htmlFor="new-title">Job title</label>
            <input id="new-title" required placeholder="Software Engineering Intern" value={form.title} onChange={update("title")} />
          </div>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="new-type">Job type</label>
              <select id="new-type" value={form.job_type} onChange={update("job_type")}>
                <option>Internship</option>
                <option>Full-time</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="new-location">Location</label>
              <input id="new-location" placeholder="Remote" value={form.location} onChange={update("location")} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="new-url">
              Posting link <span className="optional">(optional)</span>
            </label>
            <input id="new-url" type="url" placeholder="https://" value={form.url} onChange={update("url")} />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? "Save changes" : "Add posting"}
          </button>
          {editingId ? (
            <button type="button" className="btn btn-secondary" onClick={stopEdit}>
              Cancel
            </button>
          ) : (
            <p className="note">
              Applying right now? <Link to="/applications/new">Log an application</Link> adds the posting and your
              application together.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
