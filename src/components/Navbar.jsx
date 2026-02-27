import { useTheme } from "../context/ThemeContext";

export default function Navbar({ title, subtitle }) {
  const { dark, setDark } = useTheme();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  return (
    <header style={{
      height: 64,
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      position: "sticky",
      top: 0,
      zIndex: 99,
    }}>
      <div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{subtitle}</p>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Theme Toggle */}
        <button
          onClick={() => setDark(!dark)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--text)",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#fff",
          }}>
            {loggedUser?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{loggedUser?.name || "User"}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{loggedUser?.role || "student"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}