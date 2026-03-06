import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet } from "../../api/api";

export default function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartment();
  }, [id]);

  async function loadDepartment() {
    try {
      const data = await apiGet(`/api/departments/${id}`);
      setDepartment(data?.id ? data : null);
    } catch (err) {
      console.error(err);
      setDepartment(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading...</div>;
  if (!department) return <div style={{ color: "var(--text-muted)" }}>Department not found</div>;

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate("/departments")}
          className="btn btn-outline"
          style={{ marginBottom: 16 }}
        >
          ← Back to Departments
        </button>
        <h2 style={{ marginBottom: 8 }}>{department.name}</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <span className="badge">{department.code}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {department.Subjects?.length || 0} subjects • {department.totalClasses || 0} classes
          </span>
        </div>
        <p style={{ color: "var(--text-muted)" }}>{department.description || "No description"}</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Teacher</th>
              <th>Classes</th>
            </tr>
          </thead>
          <tbody>
            {!department.Subjects?.length ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                  No subjects in this department
                </td>
              </tr>
            ) : department.Subjects.map(subject => (
              <tr key={subject.id}>
                <td><span className="badge">{subject.code}</span></td>
                <td style={{ fontWeight: 500 }}>{subject.name}</td>
                <td>{subject.User?.name || "-"}</td>
                <td>{subject.classCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
