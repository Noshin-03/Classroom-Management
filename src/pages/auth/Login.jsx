import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    if (!email || !password) return alert("Please fill all fields");
    try {
      const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
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
          <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Welcome back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Sign in to EduPanel</p>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="text" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: 8 }} onClick={handleLogin}>
          Sign In
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}