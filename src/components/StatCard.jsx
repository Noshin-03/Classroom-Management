export default function StatCard({ icon, label, value, color }) {
  return (
    <div className="card" style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      transition: "transform 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 10,
        background: color || "var(--accent-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.4rem",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "Syne" }}>{value}</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}