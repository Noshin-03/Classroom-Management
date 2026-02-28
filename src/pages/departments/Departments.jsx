import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  useEffect(() => { loadDepartments(); }, []);

  async function loadDepartments() {
    try {
      const data = await apiGet("/api/departments");
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!form.code || !form.name) return alert("Code and name are required");
    const data = await apiPost("/api/departments", form);
    if (data.id) {
      setShowForm(false);
      setForm({ code: "", name: "", description: "" });
      loadDepartments();
    } else {
      alert(data.message || "Failed to create");
    }
  }

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="search-input">
            <span>🔍</span>
            <input
              placeholder="Search by name or code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loggedUser.role === "teacher" && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Create
          </button>
        )}
      </div>

      {}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div className="card" style={{ width: 480 }}>
            <h3 style={{ marginBottom: 20 }}>Create Department</h3>
            <div className="form-group">
              <label className="form-label">Code</label>
              <input className="form-input" placeholder="e.g. CS" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" placeholder="e.g. Computer Science" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" placeholder="Brief description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
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
              <th>Code</th>
              <th>Name</th>
              <th>Subjects</th>
              <th>Description</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>No departments found</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id}>
                <td><span className="badge">{d.code}</span></td>
                <td style={{ fontWeight: 500 }}>{d.name}</td>
                <td>{d.subjectCount || 0}</td>
                <td style={{ color: "var(--text-muted)" }}>{d.description}</td>
                <td><button className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 16, gap: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
        <span>Rows per page: 10</span>
        <span>Page 1 of {Math.ceil(filtered.length / 10) || 1}</span>
        <button className="btn btn-outline" style={{ padding: "4px 10px" }}>‹</button>
        <button className="btn btn-outline" style={{ padding: "4px 10px" }}>›</button>
      </div>
    </div>
  );
}