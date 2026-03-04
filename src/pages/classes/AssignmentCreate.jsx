import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiPost } from "../../api/api";

export default function AssignmentCreate() {
  const { id: classId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        description,
        due_date: dueDate || null,
        points: parseInt(points) || 100,
        class_id: parseInt(classId)
      };

      await apiPost("/api/assignments", payload);
      navigate(`/class/${classId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card">
        <h2 style={{ marginBottom: 24 }}>📝 Create Assignment</h2>

        {error && (
          <div
            style={{
              padding: 12,
              background: "var(--danger)",
              color: "white",
              borderRadius: 8,
              marginBottom: 16,
              fontSize: "0.9rem"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Midterm Exam, Project 1"
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: "1rem",
                fontFamily: "inherit"
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Assignment details and instructions..."
              rows={5}
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Due Date
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: "1rem",
                  fontFamily: "inherit"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Points
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="1"
                max="1000"
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: "1rem",
                  fontFamily: "inherit"
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? "Creating..." : "Create Assignment"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/class/${classId}`)}
              className="btn"
              style={{
                flex: 1,
                background: "var(--surface-2)",
                border: "1px solid var(--border)"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
