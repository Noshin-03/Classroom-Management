import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPut } from "../../api/api";

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [loading, setLoading] = useState(true);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  useEffect(() => {
    loadSubject();
  }, [id]);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadSubject() {
    try {
      const data = await apiGet(`/api/subjects/${id}`);
      setSubject(data?.id ? data : null);
    } catch (err) {
      console.error(err);
      setSubject(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadTeachers() {
    try {
      const data = await apiGet("/api/faculty");
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  const canManageTeacher = loggedUser.role === "admin" || subject?.teacher_id === loggedUser.id;

  function openAssignModal() {
    setSelectedTeacherId(subject?.teacher_id ? String(subject.teacher_id) : "");
    setShowAssignModal(true);
  }

  async function handleSaveTeacher() {
    try {
      setSavingTeacher(true);
      const result = await apiPut(`/api/subjects/${id}`, {
        teacher_id: selectedTeacherId ? Number(selectedTeacherId) : null
      });

      if (result.message === "Updated") {
        if (result.subject?.id) {
          setSubject(prev => ({
            ...(prev || {}),
            ...result.subject,
            Classes: prev?.Classes || [],
            classCount: prev?.classCount || 0
          }));
        } else {
          await loadSubject();
        }
        setShowAssignModal(false);
        return;
      }

      alert(result.message || "Failed to update teacher assignment");
    } catch (err) {
      alert("Failed to update teacher assignment");
    } finally {
      setSavingTeacher(false);
    }
  }

  async function handleRemoveTeacher() {
    try {
      setSavingTeacher(true);
      const result = await apiPut(`/api/subjects/${id}`, { teacher_id: null });
      if (result.message === "Updated") {
        if (result.subject?.id) {
          setSubject(prev => ({
            ...(prev || {}),
            ...result.subject,
            Classes: prev?.Classes || [],
            classCount: prev?.classCount || 0
          }));
        } else {
          await loadSubject();
        }
        return;
      }
      alert(result.message || "Failed to remove teacher");
    } catch (err) {
      alert("Failed to remove teacher");
    } finally {
      setSavingTeacher(false);
    }
  }

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading...</div>;
  if (!subject) return <div style={{ color: "var(--text-muted)" }}>Subject not found</div>;

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate("/subjects")}
          className="btn btn-outline"
          style={{ marginBottom: 16 }}
        >
          ← Back to Subjects
        </button>

        <h2 style={{ marginBottom: 8 }}>{subject.name}</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <span className="badge">{subject.code}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Department: {subject.Department?.name || "-"}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Classrooms: {subject.classCount || 0}
          </span>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>{subject.description || "No description"}</p>

        <div style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 14,
          background: "var(--surface-2)"
        }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>Teacher</div>
          <div style={{ fontWeight: 600 }}>{subject.User?.name || "Not assigned"}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{subject.User?.email || "-"}</div>
          {canManageTeacher && (
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button className="btn btn-primary" style={{ padding: "8px 12px", fontSize: "0.8rem" }} onClick={openAssignModal}>
                {subject.User ? "Reassign" : "Assign"}
              </button>
              {subject.User && (
                <button className="btn btn-outline" style={{ padding: "8px 12px", fontSize: "0.8rem" }} onClick={handleRemoveTeacher}>
                  Remove
                </button>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 10, fontSize: "0.8rem", color: "var(--text-muted)" }}>
          Students join classrooms using join codes. Teacher assignment is controlled here.
        </div>
      </div>

      {showAssignModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div className="card" style={{ width: 460 }}>
            <h3 style={{ marginBottom: 12 }}>{subject.User ? "Reassign Teacher" : "Assign Teacher"}</h3>
            <div className="form-group">
              <label className="form-label">Teacher</label>
              <select className="form-input" value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)}>
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveTeacher} disabled={savingTeacher}>
                {savingTeacher ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Join Code</th>
              <th>Students</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {!subject.Classes?.length ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                  No classrooms created yet
                </td>
              </tr>
            ) : subject.Classes.map(cls => (
              <tr key={cls.id}>
                <td style={{ fontWeight: 500 }}>{cls.name}</td>
                <td>{cls.join_code || "-"}</td>
                <td>{cls.studentCount || 0}</td>
                <td>
                  <button
                    className="btn btn-outline"
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                    onClick={() => navigate(`/class/${cls.id}`)}
                  >
                    View Class
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
