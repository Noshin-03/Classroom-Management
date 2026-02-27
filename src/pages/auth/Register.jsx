import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) return alert("Please fill all fields");
    try {
      const res = await fetch("http://127.0.0.1:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Server error");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: 40,
        background: "var(--surface)",
        borderRadius: 16,
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            background: "var(--accent)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            margin: "0 auto 16px",
          }}>🎓</div>
          <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Create account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Join EduPanel today</p>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="text" placeholder="you@example.com" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-input" name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: 8 }} onClick={handleRegister}>
          Create Account
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/login")}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}