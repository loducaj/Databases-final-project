import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { getPostings, logApplication } from "../api.js";
import { todayIso } from "../format.js";
import Alert from "../components/Alert.jsx";
import Icon from "../components/Icon.jsx";

const SOURCES = ["Handshake", "LinkedIn", "Company site", "Referral"];

export default function LogApplication() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // The Postings page links here with ?posting=<id> so that posting is already picked.
  const preselected = searchParams.get("posting") ?? "";
  const [mode, setMode] = useState(preselected ? "pick" : "new");
  const [postings, setPostings] = useState([]);
  const [form, setForm] = useState({
    posting_id: preselected,
    company: "",
    industry: "",
    title: "",
    job_type: "Internship",
    location: "",
    url: "",
    applied_on: todayIso(),
    applied_via: "Handshake",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    getPostings().then(setPostings);
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const notApplied = postings.filter((p) => !p.my_status);
  const applied = postings.filter((p) => p.my_status);
  const picked = postings.find((p) => String(p.posting_id) === form.posting_id);

  async function save(e) {
    e.preventDefault();
    const application = { applied_on: form.applied_on, applied_via: form.applied_via };
    let job;
    if (mode === "pick") {
      application.posting_id = picked.posting_id;
      job = `${picked.title} at ${picked.company}`;
    } else {
      application.posting = {
        company: form.company.trim(),
        industry: form.industry.trim(),
        title: form.title.trim(),
        job_type: form.job_type,
        location: form.location.trim(),
        url: form.url.trim(),
      };
      job = `${application.posting.title} at ${application.posting.company}`;
    }
    try {
      await logApplication(application);
      navigate("/applications", {
        state: {
          message: {
            kind: "info",
            text: `Logged ${job}. Saving new applications isn't connected to the database yet, so it won't show in this list.`,
          },
        },
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page narrow">
      <Link to="/applications" className="back-link">
        <Icon name="back" size={16} strokeWidth={2.2} />
        Back to applications
      </Link>

      <header className="page-header">
        <div>
          <h1>Log an application</h1>
          <p>Pick a job from the shared list, or add a new one.</p>
        </div>
      </header>

      {error && (
        <Alert kind="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form className="form-stack" onSubmit={save}>
        <section className="card form-card">
          <h2>The job</h2>
          <div className="segmented">
            <button type="button" aria-pressed={mode === "pick"} onClick={() => setMode("pick")}>
              Pick a posting
            </button>
            <button type="button" aria-pressed={mode === "new"} onClick={() => setMode("new")}>
              Add a new posting
            </button>
          </div>

          {mode === "pick" ? (
            <>
              <div className="field">
                <label htmlFor="posting">Posting</label>
                <select id="posting" required value={form.posting_id} onChange={update("posting_id")}>
                  <option value="">Choose a posting</option>
                  <optgroup label="Not applied yet">
                    {notApplied.map((p) => (
                      <option key={p.posting_id} value={p.posting_id}>
                        {`${p.company} · ${p.title} · ${p.location}`}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Already applied">
                    {applied.map((p) => (
                      <option key={p.posting_id} value={p.posting_id} disabled>
                        {`${p.company} · ${p.title}`}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <span className="hint">You can only apply to each posting once.</span>
              </div>
              {picked?.possible_repost && (
                <div className="warning">
                  <Icon name="repost" />
                  <span>
                    <strong>Possible repost.</strong> You already applied to a posting at {picked.company} with the
                    same title.
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="field-grid">
              <div className="field">
                <label htmlFor="company">Company</label>
                <input id="company" required placeholder="Company name" value={form.company} onChange={update("company")} />
                <span className="hint">A new company is added in the same step.</span>
              </div>
              <div className="field">
                <label htmlFor="industry">
                  Industry <span className="optional">(optional)</span>
                </label>
                <input id="industry" placeholder="Software, Healthcare…" value={form.industry} onChange={update("industry")} />
              </div>
              <div className="field">
                <label htmlFor="title">Job title</label>
                <input id="title" required placeholder="Software Engineering Intern" value={form.title} onChange={update("title")} />
              </div>
              <div className="field">
                <label htmlFor="job-type">Job type</label>
                <select id="job-type" value={form.job_type} onChange={update("job_type")}>
                  <option>Internship</option>
                  <option>Full-time</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input id="location" placeholder="Milwaukee, WI or Remote" value={form.location} onChange={update("location")} />
              </div>
              <div className="field">
                <label htmlFor="url">
                  Posting link <span className="optional">(optional)</span>
                </label>
                <input id="url" type="url" placeholder="https://" value={form.url} onChange={update("url")} />
              </div>
            </div>
          )}
        </section>

        <section className="card form-card">
          <h2>Your application</h2>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="applied-on">Applied on</label>
              <input id="applied-on" type="date" required value={form.applied_on} onChange={update("applied_on")} />
            </div>
            <div className="field">
              <label htmlFor="applied-via">Applied via</label>
              <select id="applied-via" value={form.applied_via} onChange={update("applied_via")}>
                {SOURCES.map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="note">New applications start at Applied. You'll update the status as replies come in.</p>
        </section>

        <div className="info-box">
          <Icon name="shield" size={20} />
          {mode === "new" ? (
            <span>
              <strong>Saved in one step.</strong> The company (if it's new), the posting and your application are saved
              together. If anything fails, nothing is saved.
            </span>
          ) : (
            <span>
              <strong>Only your application is added.</strong> The posting is already in the shared list.
            </span>
          )}
        </div>

        <div className="form-actions">
          <Link to="/applications" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Save application
          </button>
        </div>
      </form>
    </div>
  );
}
