import Icon from "./Icon.jsx";

const ICONS = { error: "alert", success: "check", info: "info" };

// A message banner. kind is "error", "success" or "info".
export default function Alert({ kind, children, onClose }) {
  return (
    <div className={`alert alert-${kind}`} role={kind === "error" ? "alert" : "status"}>
      <Icon name={ICONS[kind]} />
      <span className="alert-text">{children}</span>
      {onClose && (
        <button type="button" className="icon-button" aria-label="Dismiss message" onClick={onClose}>
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
