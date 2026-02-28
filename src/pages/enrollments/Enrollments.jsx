import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/api";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ class_id: "" });
  const [loading, setLoading] = useState(true);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  useEffect(() => {
    loadEnrollments();
    loadClasses();
  }, []);

  async function loadEnrollments() {
    try {
      const data = await apiGet("/api/enrollments");
      setEnrollments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadClasses() {
    try {
      const data = await apiGet("/api/classes");
      setClasses(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleEnroll() {
    if (!form.class_id) return alert("Please select a class");
    const data = await apiPost("/api/enrollments", { class_id: form.class_id });
    if (data.id) {
      setShowForm(false);
      setForm({ class_id: "" });
      loadEnrollments();
    } else {
      alert(data.message || "Failed to enroll");
    }
  }

  const filtered = enrollments.filter(e =>
    e.Class?.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.User?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div className="search-input">
          <span>🔍</span>
          <input
            placeholder="Search enrollments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loggedUser.role === "student" && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Enroll</button>
        )}
      </div>

      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div className="card" style={{ width: 480 }}>
            <h3 style={{ marginBottom: 20 }}>Enroll in a Class</h3>
            <div className="form-group">
              <label className="form-label">Select Class</label>
              <select className="form-input" value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })}>
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.Subject?.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEnroll}>Enroll</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Enrolled At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>No enrollments found</td></tr>
            ) : filtered.map(e => (
              <tr key={e.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "var(--info)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.85rem", color: "#fff"
                    }}>
                      {e.User?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500 }}>{e.User?.name}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{e.Class?.name}</td>
                <td><span className="badge">{e.Class?.Subject?.code || "-"}</span></td>
                <td style={{ color: "var(--text-muted)" }}>
                  {new Date(e.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 16, gap: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
        <span>Rows per page: 10</span>
        <span>Page 1 of {Math.ceil(filtered.length / 10) || 1}</span>
        <button className="btn btn-outline" style={{ padding: "4px 10px" }}>‹</button>
        <button className="btn btn-outline" style={{ padding: "4px 10px" }}>›</button>
      </div>
    </div>
  );
}