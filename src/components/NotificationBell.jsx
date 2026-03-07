import { useEffect, useState, useRef } from "react";
import { apiGet, apiPut } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadNotifications() {
    try {
      const data = await apiGet("/api/notifications");
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllRead() {
    await apiPut("/api/notifications/read-all");
    loadNotifications();
  }

  async function handleNotificationClick(notification) {
    await apiPut(`/api/notifications/${notification.id}/read`);
    setOpen(false);
    if (notification.type === "assignment") navigate(`/assignment/${notification.reference_id}`);
    if (notification.type === "announcement") navigate(`/class/${notification.reference_id}`);
    loadNotifications();
  }

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 10, width: 40, height: 40, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", fontSize: "1.1rem"
        }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "var(--danger)", color: "#fff",
            borderRadius: "50%", width: 18, height: 18,
            fontSize: "0.7rem", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontWeight: 700
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: 48,
          width: 340, background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 999,
          overflow: "hidden"
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>Notifications</span>
            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.8rem" }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                No notifications
              </div>
            ) : notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: "12px 16px", cursor: "pointer",
                  background: n.is_read ? "transparent" : "var(--accent-soft)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", gap: 10, alignItems: "flex-start"
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>
                  {n.type === "assignment" ? "📝" : n.type === "announcement" ? "📢" : "⭐"}
                </span>
                <div>
                  <p style={{ fontSize: "0.85rem", marginBottom: 4, color: "var(--text)" }}>{n.message}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!n.is_read && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", marginLeft: "auto", marginTop: 4, flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
