import { useEffect, useState } from "react";
import { apiGet } from "../../api/api";
import StatCard from "../../components/StatCard";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#00d084", "#3d9df3", "#ffa502", "#ff4757", "#a55eea"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    teachers: 0,
    students: 0,
    subjects: 0,
    departments: 0,
    classes: 0,
    enrollments: 0,
  });
  const [roleData, setRoleData] = useState([]);
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [recentClasses, setRecentClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await apiGet("/api/dashboard/stats");
      setStats(data.stats);
      setRoleData(data.roleData);
      setRecentTeachers(data.recentTeachers);
      setRecentClasses(data.recentClasses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading...</div>;

  const statCards = [
    { icon: "👥", label: "Total Users", value: stats.totalUsers, color: "rgba(0,208,132,0.15)" },
    { icon: "🎓", label: "Teachers", value: stats.teachers, color: "rgba(61,157,243,0.15)" },
    { icon: "📚", label: "Subjects", value: stats.subjects, color: "rgba(255,165,2,0.15)" },
    { icon: "🏛", label: "Departments", value: stats.departments, color: "rgba(165,94,234,0.15)" },
    { icon: "🎯", label: "Classes", value: stats.classes, color: "rgba(255,71,87,0.15)" },
    { icon: "📋", label: "Enrollments", value: stats.enrollments, color: "rgba(0,208,132,0.15)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Donut Chart */}
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: "1rem" }}>Users by Role</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {roleData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text)"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>New Classes (last 5)</div>
            <div style={{ fontSize: "2.5rem", fontFamily: "Syne", fontWeight: 700 }}>{recentClasses.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Most recent classes added</div>
          </div>
          <div className="card">
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>New Teachers (last 5)</div>
            <div style={{ fontSize: "2.5rem", fontFamily: "Syne", fontWeight: 700 }}>{recentTeachers.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Most recent teachers added</div>
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent Teachers */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: "1rem" }}>Recent Teachers</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {recentTeachers.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td style={{ color: "var(--text-muted)" }}>{t.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Classes */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: "1rem" }}>Recent Classes</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {recentClasses.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td style={{ color: "var(--text-muted)" }}>{c.Subject?.name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}