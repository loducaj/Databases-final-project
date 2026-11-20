import { NavLink, Outlet } from "react-router";
import Icon from "./Icon.jsx";

const LINKS = [
  { to: "/", label: "Dashboard", icon: "grid" },
  { to: "/applications", label: "Applications", icon: "briefcase" },
  { to: "/postings", label: "Postings", icon: "list" },
];

// The sidebar around every signed-in page. <Outlet /> is where the current page renders.
export default function Layout() {
  return (
    <div className="layout">
      <nav className="sidebar" aria-label="Main">
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <Icon name="trail" size={20} strokeWidth={2.2} />
          </span>
          JobTrail
        </NavLink>

        <div className="nav-links">
          {LINKS.map((link) => (
            // NavLink marks the current page with the "active" class and aria-current.
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className="nav-link">
              <Icon name={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Until login exists, the app always acts as user 1 (Alex in the seed data). */}
        <div className="user">
          <span className="avatar" aria-hidden="true">AD</span>
          <div className="user-text">
            <div className="user-name">Alex Demo</div>
            <div className="user-email">alex@example.com</div>
          </div>
          <NavLink to="/login" className="icon-button" aria-label="Log out">
            <Icon name="logout" />
          </NavLink>
        </div>
      </nav>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
