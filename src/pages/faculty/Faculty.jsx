import { useEffect, useState } from "react";
import { apiGet } from "../../api/api";

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadFaculty(); }, []);

  async function loadFaculty() {
    try {
      const data = await apiGet("/api/faculty");
      setFaculty(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div className="search-input">
          <span>🔍</span>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subjects</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>No faculty found</td></tr>
            ) : filtered.map(f => (
              <tr key={f.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: "#fff",
                      flexShrink: 0,
                    }}>
                      {f.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500 }}>{f.name}</span>
                  </div>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{f.email}</td>
                <td>{f.subjectCount || 0}</td>
                <td style={{ color: "var(--text-muted)" }}>
                  {new Date(f.createdAt).toLocaleDateString()}
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