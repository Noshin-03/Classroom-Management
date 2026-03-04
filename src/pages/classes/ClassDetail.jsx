import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiDelete } from "../../api/api";

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  const [cls, setCls] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState("stream");
  const [loading, setLoading] = useState(true);

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "" });
  const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", due_date: "", points: 100 });

  useEffect(() => {
    loadAll();
  }, [id]);

  async function loadAll() {
    try {
      const [clsData, assData, enrollData] = await Promise.all([
        apiGet(`/api/classes/${id}`),
        apiGet(`/api/assignments/class/${id}`),
        apiGet(`/api/enrollments/class/${id}`),
      ]);
      setCls(clsData);
      setAssignments(Array.isArray(assData) ? assData : []);
      setEnrollments(enrollData || []);
      
      // Load announcements from localStorage (not persisted to backend yet)
      const stored = localStorage.getItem(`announcements_${id}`);
      setAnnouncements(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAnnouncement() {
    if (!announcementForm.title || !announcementForm.content) return alert("Fill all fields");
    
    const newAnnouncement = {
      id: Date.now(),
      title: announcementForm.title,
      content: announcementForm.content,
      author: loggedUser.name,
      createdAt: new Date().toISOString()
    };
    
    const updated = [newAnnouncement, ...announcements];
    localStorage.setItem(`announcements_${id}`, JSON.stringify(updated));
    setAnnouncements(updated);
    setShowAnnouncementForm(false);
    setAnnouncementForm({ title: "", content: "" });
  }

  async function handleCreateAssignment() {
    if (!assignmentForm.title) return alert("Title is required");
    const data = await apiPost("/api/assignments", { ...assignmentForm, class_id: id });
    if (data.id) {
      setShowAssignmentForm(false);
      setAssignmentForm({ title: "", description: "", due_date: "", points: 100 });
      loadAll();
    } else {
      alert(data.message || "Failed");
    }
  }

  async function handleDeleteAnnouncement(annId) {
    if (!window.confirm("Delete this announcement?")) return;
    const updated = announcements.filter(a => a.id !== annId);
    localStorage.setItem(`announcements_${id}`, JSON.stringify(updated));
    setAnnouncements(updated);
  }

  async function handleDeleteAssignment(assId) {
    if (!window.confirm("Delete this assignment?")) return;
    await apiDelete(`/api/assignments/${assId}`);
    loadAll();
  }

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading...</div>;
  if (!cls) return <div style={{ color: "var(--text-muted)" }}>Class not found</div>;

  const tabs = ["stream", "assignments", "people"];

  return (
    <div>
      {}
      <div className="card" style={{
        marginBottom: 24,
        background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
        border: "none",
        color: "#fff",
        padding: "32px"
      }}>
        <button
          onClick={() => navigate("/classes")}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", marginBottom: 16, fontSize: "0.85rem" }}
        >
          ← Back to Classes
        </button>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 8, color: "#fff" }}>{cls.name}</h1>
        <p style={{ opacity: 0.85, fontSize: "0.9rem" }}>{cls.Subject?.code} — {cls.Subject?.name}</p>
        {loggedUser.role === "teacher" && cls.join_code && (
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 8 }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>Join Code:</span>
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em" }}>{cls.join_code}</span>
          </div>
        )}
      </div>

      {}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              border: "none",
              background: "none",
              color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
              fontWeight: activeTab === tab ? 600 : 400,
              borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
              cursor: "pointer",
              textTransform: "capitalize",
              fontSize: "0.9rem",
              fontFamily: "Space Grotesk",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {}
      {activeTab === "stream" && (
        <div>
          {loggedUser.role === "teacher" && (
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button className="btn btn-primary" onClick={() => setShowAnnouncementForm(true)}>
                + Announcement
              </button>
            </div>
          )}

          {}
          {showAnnouncementForm && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16 }}>New Announcement</h3>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="Announcement title" value={announcementForm.title} onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea className="form-input" placeholder="Write your announcement..." rows={4} value={announcementForm.content} onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-primary" onClick={handleCreateAnnouncement}>Post</button>
                <button className="btn btn-outline" onClick={() => setShowAnnouncementForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {}
          {announcements.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>
              No announcements yet
            </div>
          ) : announcements.map(ann => (
            <div className="card" key={ann.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "var(--accent)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontWeight: 700, color: "#fff", fontSize: "0.85rem"
                  }}>
                    {ann.User?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{ann.User?.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {loggedUser.role === "teacher" && (
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
              <h3 style={{ fontSize: "1rem", marginBottom: 8 }}>{ann.title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      {}
      {activeTab === "assignments" && (
        <div>
          {loggedUser.role === "teacher" && (
            <div style={{ marginBottom: 24 }}>
              <button className="btn btn-primary" onClick={() => setShowAssignmentForm(true)}>
                + Assignment
              </button>
            </div>
          )}

          {}
          {showAssignmentForm && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16 }}>New Assignment</h3>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="Assignment title" value={assignmentForm.title} onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" placeholder="Describe the assignment..." rows={4} value={assignmentForm.description} onChange={e => setAssignmentForm({ ...assignmentForm, description: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="form-input" type="datetime-local" value={assignmentForm.due_date} onChange={e => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Points</label>
                  <input className="form-input" type="number" value={assignmentForm.points} onChange={e => setAssignmentForm({ ...assignmentForm, points: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-primary" onClick={handleCreateAssignment}>Create</button>
                <button className="btn btn-outline" onClick={() => setShowAssignmentForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {}
          {assignments.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>
              No assignments yet
            </div>
          ) : assignments.map(ass => (
            <div className="card" key={ass.id} style={{ marginBottom: 16, cursor: "pointer" }}
              onClick={() => navigate(`/assignment/${ass.id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "var(--accent-soft)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "1.2rem"
                  }}>📝</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{ass.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {ass.due_date ? `Due: ${new Date(ass.due_date).toLocaleDateString()}` : "No due date"} • {ass.points} pts
                    </div>
                  </div>
                </div>
                {loggedUser.role === "teacher" && (
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteAssignment(ass.id); }}
                    style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {activeTab === "people" && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16, fontSize: "1rem" }}>Teacher</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "var(--accent)", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontWeight: 700, color: "#fff"
              }}>
                {cls.Subject?.User?.name?.charAt(0)?.toUpperCase() || "T"}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{cls.Subject?.User?.name || "Teacher"}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{cls.Subject?.User?.email}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: "1rem" }}>Students ({enrollments.length})</h3>
            {enrollments.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No students enrolled yet</p>
            ) : enrollments.map(e => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--info)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontWeight: 700, color: "#fff", fontSize: "0.85rem"
                }}>
                  {e.User?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{e.User?.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{e.User?.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
