import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { path: "/dashboard", icon: "⊞", label: "Home" },
  { path: "/subjects", icon: "📚", label: "Subjects" },
  { path: "/departments", icon: "🏛", label: "Departments" },
  { path: "/faculty", icon: "👤", label: "Faculty" },
  { path: "/enrollments", icon: "📋", label: "Enrollments" },
  { path: "/classes", icon: "🎓", label: "Classes" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    navigate("/login");
  }

  return (
    <aside style={{
      width: 240,
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      zIndex: 100,
    }}>
      {}
      <div style={{ padding: "0 24px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            background: "var(--accent)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}>🎓</div>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1rem" }}>EduPanel</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Management System</div>
          </div>
        </div>
      </div>

      {}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 4,
              fontSize: "0.9rem",
              fontWeight: 500,
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              background: isActive ? "var(--accent-soft)" : "transparent",
              transition: "all 0.2s",
              textDecoration: "none",
            })}
          >
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {}
      <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ width: "100%", justifyContent: "center" }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}