import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/api";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", description: "", department_id: "" });
  const [loading, setLoading] = useState(true);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  useEffect(() => {
    loadSubjects();
    loadDepartments();
  }, []);

  async function loadSubjects() {
    try {
      const data = await apiGet("/api/subjects");
      setSubjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadDepartments() {
    try {
      const data = await apiGet("/api/departments");
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate() {
    if (!form.code || !form.name || !form.department_id) return alert("Code, name and department are required");
    const data = await apiPost("/api/subjects", form);
    if (data.id) {
      setShowForm(false);
      setForm({ code: "", name: "", description: "", department_id: "" });
      loadSubjects();
    } else {
      alert(data.message || "Failed to create");
    }
  }

  const filtered = subjects.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept ? s.department_id === parseInt(filterDept) : true;
    return matchSearch && matchDept;
  });

  return (
    <div>
      {}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="search-input">
            <span>🔍</span>
            <input
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-input"
            style={{ width: 180, marginBottom: 0 }}
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
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
            <h3 style={{ marginBottom: 20 }}>Create Subject</h3>
            <div className="form-group">
              <label className="form-label">Code</label>
              <input className="form-input" placeholder="e.g. CS101" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" placeholder="e.g. Intro to Programming" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-input" value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
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
              <th>Department</th>
              <th>Description</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>No subjects found</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td><span className="badge">{s.code}</span></td>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    fontSize: "0.8rem"
                  }}>
                    {s.Department?.name || "-"}
                  </span>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{s.description}</td>
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