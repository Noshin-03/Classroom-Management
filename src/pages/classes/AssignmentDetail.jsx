import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../../api/api";

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [submitText, setSubmitText] = useState("");
  const [submitFile, setSubmitFile] = useState(null);
  const [gradeInputs, setGradeInputs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAssignment(); }, [id]);

  async function loadAssignment() {
    try {
      const data = await apiGet(`/api/assignments/${id}`);
      setAssignment(data);
      if (loggedUser.role === "student") {
        const mine = data.Submissions?.find(s => s.student_id === loggedUser.id);
        setMySubmission(mine || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!submitText && !submitFile) return alert("Please write something or upload a file");
    const formData = new FormData();
    formData.append("assignment_id", id);
    if (submitText) formData.append("content", submitText);
    if (submitFile) formData.append("file", submitFile);
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:3000/api/submissions/submit", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (data.id) {
      alert("Submitted successfully!");
      setSubmitText("");
      setSubmitFile(null);
      loadAssignment();
    } else {
      alert(data.message || "Failed to submit");
    }
  }

  async function handleGrade(submissionId) {
    const grade = gradeInputs[submissionId];
    if (grade === undefined || grade === "") return alert("Enter a grade");
    const data = await apiPut(`/api/submissions/${submissionId}/grade`, { grade });
    if (data.message === "Graded") {
      alert("Graded successfully!");
      loadAssignment();
    } else {
      alert(data.message || "Failed to grade");
    }
  }

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading...</div>;
  if (!assignment) return <div style={{ color: "var(--text-muted)" }}>Assignment not found</div>;

  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <button onClick={() => navigate(`/classes/${assignment.class_id}`)}
          style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", marginBottom: 16, fontSize: "0.85rem", padding: 0 }}>
          Back to Class
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", marginBottom: 8 }}>{assignment.title}</h1>
            <div style={{ display: "flex", gap: 16, fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span>👤 {assignment.User?.name}</span>
              <span>🎯 {assignment.points} pts</span>
              {assignment.due_date && (
                <span style={{ color: isOverdue ? "var(--danger)" : "var(--text-muted)" }}>
                  📅 Due: {new Date(assignment.due_date).toLocaleDateString()} {isOverdue && "(Overdue)"}
                </span>
              )}
            </div>
          </div>
          {loggedUser.role === "teacher" && (
            <div style={{ padding: "8px 16px", background: "var(--accent-soft)", borderRadius: 8, fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>
              {assignment.Submissions?.length || 0} submissions
            </div>
          )}
        </div>
        {assignment.description && (
          <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {assignment.description}
          </p>
        )}
      </div>

      {loggedUser.role === "student" && (
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: "1rem" }}>Your Submission</h3>
          {mySubmission ? (
            <div>
              <div style={{ padding: 16, background: "var(--surface-2)", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem", lineHeight: 1.6 }}>
                {mySubmission.content && <p>{mySubmission.content}</p>}
                {mySubmission.file_url && (
                  <a href={"http://127.0.0.1:3000" + mySubmission.file_url} target="_blank" rel="noreferrer"
                    style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    📎 {mySubmission.file_name}
                  </a>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ padding: "6px 14px", background: "rgba(0,208,132,0.1)", color: "var(--accent)", borderRadius: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  ✅ Submitted
                </span>
                {mySubmission.grade !== null && mySubmission.grade !== undefined && (
                  <span style={{ padding: "6px 14px", background: "var(--accent-soft)", color: "var(--accent)", borderRadius: 6, fontSize: "0.85rem", fontWeight: 700 }}>
                    Grade: {mySubmission.grade}/{assignment.points}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label className="form-label">Text Submission (optional)</label>
                <textarea className="form-input" placeholder="Write your submission here..." rows={4}
                  value={submitText} onChange={e => setSubmitText(e.target.value)} style={{ resize: "vertical" }} />
              </div>
              <div className="form-group">
                <label className="form-label">Upload File (optional)</label>
                <input type="file" className="form-input" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip"
                  onChange={e => setSubmitFile(e.target.files[0])} />
                <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  Allowed: PDF, DOC, DOCX, TXT, PNG, JPG, ZIP (max 10MB)
                </small>
              </div>
              <button className="btn btn-primary" onClick={handleSubmit}>Submit Assignment</button>
            </div>
          )}
        </div>
      )}

      {loggedUser.role === "teacher" && (
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: "1rem" }}>
            Student Submissions ({assignment.Submissions?.length || 0})
          </h3>
          {!assignment.Submissions || assignment.Submissions.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 40 }}>No submissions yet</p>
          ) : assignment.Submissions.map(sub => (
            <div key={sub.id} style={{ padding: 20, marginBottom: 16, background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--info)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.85rem" }}>
                    {sub.User?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{sub.User?.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(sub.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                {sub.grade !== null && sub.grade !== undefined && (
                  <span style={{ padding: "4px 12px", background: "var(--accent-soft)", color: "var(--accent)", borderRadius: 6, fontWeight: 700, fontSize: "0.85rem" }}>
                    {sub.grade}/{assignment.points}
                  </span>
                )}
              </div>
              {sub.content && (
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>{sub.content}</p>
              )}
              {sub.file_url && (
                <a href={"http://127.0.0.1:3000" + sub.file_url} target="_blank" rel="noreferrer"
                  style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: "0.9rem" }}>
                  📎 {sub.file_name}
                </a>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="number" className="form-input" placeholder={"Grade / " + assignment.points}
                  style={{ width: 140, marginBottom: 0 }} min={0} max={assignment.points}
                  value={gradeInputs[sub.id] || ""}
                  onChange={e => setGradeInputs({ ...gradeInputs, [sub.id]: e.target.value })} />
                <button className="btn btn-primary" style={{ padding: "9px 18px" }} onClick={() => handleGrade(sub.id)}>
                  Grade
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
