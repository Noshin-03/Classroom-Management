import { useState } from "react";
import { apiPut } from "../../api/api";

export default function Profile() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const [activeTab, setActiveTab] = useState("info");
  const [form, setForm] = useState({
    name: loggedUser.name || "",
    email: loggedUser.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleUpdateInfo() {
    setMessage("");
    setError("");
    try {
      const data = await apiPut("/api/auth/profile", form);
      if (data.user) {
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
        setMessage("Profile updated successfully!");
      } else {
        setError(data.message || "Failed to update");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  }

  async function handleUpdatePassword() {
    setMessage("");
    setError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (passwordForm.newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    try {
      const data = await apiPut("/api/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (data.message === "Password updated") {
        setMessage("Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Profile Header */}
      <div className="card" style={{ marginBottom: 24, textAlign: "center", padding: 40 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "var(--accent)", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "2rem", color: "#fff",
          margin: "0 auto 16px"
        }}>
          {loggedUser.name?.charAt(0)?.toUpperCase()}
        </div>
        <h2 style={{ marginBottom: 4 }}>{loggedUser.name}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{loggedUser.email}</p>
        <span style={{
          display: "inline-block",
          marginTop: 8,
          padding: "4px 14px",
          background: "var(--accent-soft)",
          color: "var(--accent)",
          borderRadius: 20,
          fontSize: "0.8rem",
          fontWeight: 600,
          textTransform: "capitalize"
        }}>
          {loggedUser.role}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
        {["info", "password"].map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setMessage(""); setError(""); }}
            style={{
              padding: "10px 20px", border: "none", background: "none",
              color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
              fontWeight: activeTab === tab ? 600 : 400,
              borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
              cursor: "pointer", textTransform: "capitalize", fontSize: "0.9rem",
              fontFamily: "Space Grotesk",
            }}>
            {tab === "info" ? "Personal Info" : "Change Password"}
          </button>
        ))}
      </div>

      {/* Messages */}
      {message && (
        <div style={{ padding: "12px 16px", background: "rgba(0,208,132,0.1)", color: "var(--accent)", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem" }}>
          ✅ {message}
        </div>
      )}
      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(255,59,59,0.1)", color: "var(--danger)", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem" }}>
          ❌ {error}
        </div>
      )}

      {/* Personal Info Tab */}
      {activeTab === "info" && (
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: "1rem" }}>Personal Information</h3>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input className="form-input" value={loggedUser.role} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
          </div>
          <button className="btn btn-primary" onClick={handleUpdateInfo}>
            Save Changes
          </button>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: "1rem" }}>Change Password</h3>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input className="form-input" type="password" value={passwordForm.currentPassword}
              onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="form-input" type="password" value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={handleUpdatePassword}>
            Update Password
          </button>
        </div>
      )}
    </div>
  );
}
