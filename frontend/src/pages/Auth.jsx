import { Link, useNavigate } from "react-router";
import { logIn, signUp } from "../api.js";
import Icon from "../components/Icon.jsx";

const FEATURES = [
  "Track each application from Applied to Offer",
  "See which sources actually get replies",
  "Catch reposts before you apply twice",
];

// The indigo brand panel next to the log in and sign up forms.
function AuthLayout({ heading, text, children }) {
  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="auth-logo">
          <span className="brand-mark">
            <Icon name="trail" size={20} strokeWidth={2.2} />
          </span>
          JobTrail
        </div>
        <div className="auth-pitch">
          <div>
            <h2>{heading}</h2>
            <p>{text}</p>
          </div>
          <ul>
            {FEATURES.map((feature) => (
              <li key={feature}>
                <span className="auth-check">
                  <Icon name="check" size={15} strokeWidth={2.6} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="auth-main">{children}</main>
    </div>
  );
}

// Front end only for now: both forms go straight to the dashboard.
export function Login() {
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await logIn(data.get("email"), data.get("password"));
    navigate("/");
  }

  return (
    <AuthLayout
      heading="Every application, in one place."
      text="For students applying to a lot of jobs at once, across Handshake, LinkedIn and company sites."
    >
      <form className="auth-form" onSubmit={submit}>
        <div>
          <h1>Log in</h1>
          <p className="lede">Welcome back. Log in to see your applications.</p>
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button type="submit" className="btn btn-primary">
          Log in
        </button>
        <p className="auth-switch">
          New to JobTrail? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function SignUp() {
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await signUp(data.get("name"), data.get("email"), data.get("password"));
    navigate("/");
  }

  return (
    <AuthLayout heading="Your job search, organized." text="Log every application once, then see what's working.">
      <form className="auth-form" onSubmit={submit}>
        <div>
          <h1>Create your account</h1>
          <p className="lede">It takes a minute. Your applications are only visible to you.</p>
        </div>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" placeholder="Your name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          <span className="hint">At least 8 characters.</span>
        </div>
        <button type="submit" className="btn btn-primary">
          Create account
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
