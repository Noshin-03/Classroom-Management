import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/api";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [form, setForm] = useState({ name: "", subject_id: "" });
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(true);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  useEffect(() => {
    loadClasses();
    loadSubjects();
  }, []);

  async function loadClasses() {
    try {
      const data = await apiGet("/api/classes");
      setClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubjects() {
    try {
      const data = await apiGet("/api/subjects");
      setSubjects(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate() {
    if (!form.name || !form.subject_id) return alert("Name and subject are required");
    const data = await apiPost("/api/classes", form);
    if (data.id) {
      setShowForm(false);
      setForm({ name: "", subject_id: "" });
      loadClasses();
    } else {
      alert(data.message || "Failed to create");
    }
  }

  async function handleJoin() {
    if (!joinCode) return alert("Please enter a join code");
    const data = await apiPost("/api/classes/join", { join_code: joinCode.toUpperCase() });
    if (data.message === "Joined successfully") {
      alert("Joined successfully!");
      setShowJoinForm(false);
      setJoinCode("");
      loadClasses();
    } else {
      alert(data.message || "Failed to join");
    }
  }

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div className="search-input">
          <span>🔍</span>
          <input
            placeholder="Search classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {loggedUser.role === "student" && (
            <button className="btn btn-outline" onClick={() => setShowJoinForm(true)}>
              + Join with Code
            </button>
          )}
          {loggedUser.role === "teacher" && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Create
            </button>
          )}
        </div>
      </div>

      {}
      {showJoinForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div className="card" style={{ width: 400 }}>
            <h3 style={{ marginBottom: 8 }}>Join a Class</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>
              Ask your teacher for the class join code
            </p>
            <div className="form-group">
              <label className="form-label">Join Code</label>
              <input
                className="form-input"
                placeholder="e.g. ABC123"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "1.2rem", textAlign: "center" }}
              />
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn btn-outline" onClick={() => setShowJoinForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleJoin}>Join Class</button>
            </div>
          </div>
        </div>
      )}

      {}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div className="card" style={{ width: 480 }}>
            <h3 style={{ marginBottom: 20 }}>Create Class</h3>
            <div className="form-group">
              <label className="form-label">Class Name</label>
              <input className="form-input" placeholder="e.g. CS101-A" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select className="form-input" value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })}>
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Department</th>
              {loggedUser.role === 'teacher' && <th>Join Code</th>}
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>No classes found</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td><span className="badge">{c.Subject?.code || "-"}</span></td>
                <td style={{ color: "var(--text-muted)" }}>{c.Subject?.Department?.name || "-"}</td>
                {loggedUser.role === 'teacher' && (
                <td>
                  {c.join_code ? (
                    <span style={{
                      fontFamily: "monospace",
                      fontSize: "1rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      color: "var(--accent)",
                      background: "var(--accent-soft)",
                      padding: "4px 10px",
                      borderRadius: 6,
                    }}>
                      {c.join_code}
                    </span>
                  ) : "-"}
                </td>
                )}
                <td>{c.studentCount || 0}</td>
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