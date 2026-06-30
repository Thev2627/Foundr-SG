import { useState, useEffect } from "react"

const TEST_ACCOUNTS = {
  consumer: {
    email: "student@student.edu.sg",
    password: "test1234",
    name: "Alex Student",
    role: "consumer",
    label: "Consumer Test Account",
    coins: 600,
    emoji: "🛍️"
  },
  founder: {
    email: "clara@student.nus.edu.sg",
    password: "test1234",
    name: "Clara Tan",
    role: "founder",
    label: "Business Owner (Clara)",
    coins: 1200,
    emoji: "🏪"
  }
}

// Very simple simulated user store - in real app this would hit Supabase Auth
const MOCK_USERS = {
  "student@student.edu.sg": { password: "test1234", name: "Alex Student", role: "consumer" },
  "clara@student.nus.edu.sg": { password: "test1234", name: "Clara Tan", role: "founder" },
  "marcus@student.ntu.edu.sg": { password: "test1234", name: "Marcus Lim", role: "founder" },
}

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login") // "login" | "signup"
  const [role, setRole] = useState("consumer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [particles, setParticles] = useState([])

  // Floating particles animation
  useEffect(() => {
    const count = 18
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 8,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 5,
        opacity: 0.06 + Math.random() * 0.12,
      }))
    )
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    await new Promise(r => setTimeout(r, 900)) // simulate network

    if (mode === "login") {
      const user = MOCK_USERS[email.toLowerCase().trim()]
      if (!user) {
        setError("No account found with this email. Try the test accounts below!")
        setLoading(false)
        return
      }
      if (user.password !== password) {
        setError("Incorrect password. Hint: test accounts use 'test1234'")
        setLoading(false)
        return
      }
      // Success
      const sessionData = {
        email: email.toLowerCase().trim(),
        name: user.name,
        role: user.role,
      }
      localStorage.setItem("leo_session", JSON.stringify(sessionData))
      localStorage.setItem("leo_user_email", sessionData.email)
      onLogin(sessionData)
    } else {
      // Signup - create a new consumer/founder mock session
      if (!name.trim()) {
        setError("Please enter your full name.")
        setLoading(false)
        return
      }
      if (!email.includes("@")) {
        setError("Please enter a valid student email address.")
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.")
        setLoading(false)
        return
      }
      const sessionData = {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role: role,
      }
      localStorage.setItem("leo_session", JSON.stringify(sessionData))
      localStorage.setItem("leo_user_email", sessionData.email)
      onLogin(sessionData)
    }
    setLoading(false)
  }

  const fillTestAccount = (type) => {
    const acc = TEST_ACCOUNTS[type]
    setEmail(acc.email)
    setPassword(acc.password)
    setName(acc.name)
    setRole(acc.role)
    setMode("login")
    setError("")
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#F0F0F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background glow orbs */}
      <div style={{
        position: "absolute", top: "-200px", left: "-200px",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "-200px", right: "-150px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none"
      }} />

      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          background: "#F97316",
          borderRadius: "50%",
          opacity: p.opacity,
          animation: `float-${p.id % 3} ${p.duration}s ${p.delay}s ease-in-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

        @keyframes floatA {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.05); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(14px) scale(0.95); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); }
          33% { transform: translateY(-10px); }
          66% { transform: translateY(10px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(249,115,22,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(249,115,22,0); }
        }
        .leo-input {
          width: 100%;
          padding: 12px 16px;
          background: #111118;
          border: 1px solid #2A2A38;
          border-radius: 10px;
          color: #F0F0F5;
          font-size: 14px;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .leo-input:focus {
          border-color: #F97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        .leo-input::placeholder { color: #5A5A72; }
        .leo-btn-primary {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #F97316, #EA580C);
          color: #0A0A0F;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.01em;
        }
        .leo-btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .leo-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .leo-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .role-tab {
          flex: 1;
          padding: 9px;
          border: 1px solid #2A2A38;
          border-radius: 8px;
          background: transparent;
          color: #9090A8;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .role-tab.active {
          background: rgba(249,115,22,0.12);
          border-color: #F97316;
          color: #F97316;
        }
        .test-card {
          padding: 10px 14px;
          background: #111118;
          border: 1px solid #2A2A38;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }
        .test-card:hover {
          border-color: #F97316;
          background: rgba(249,115,22,0.05);
        }
        .mode-link {
          background: none;
          border: none;
          color: #F97316;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }
        .mode-link:hover { opacity: 0.8; }
      `}</style>

      {/* Main card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "#13131C",
        border: "1px solid #2A2A38",
        borderRadius: "24px",
        padding: "2.5rem 2rem",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        position: "relative",
        zIndex: 1,
        animation: "fadeSlideUp 0.5s ease both",
        margin: "1rem",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{
            fontSize: "54px",
            fontFamily: "'Pacifico', cursive",
            color: "#E8821A",
            lineHeight: 1.1,
            marginBottom: "2px",
          }}>Leo</div>
          <div style={{ fontSize: "13px", color: "#5A5A72" }}>Singapore's Student Marketplace</div>
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "1.75rem" }}>
          <button
            className={`role-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError("") }}
          >Sign In</button>
          <button
            className={`role-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => { setMode("signup"); setError("") }}
          >Create Account</button>
        </div>

        {/* Role selector (signup only) */}
        {mode === "signup" && (
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: "12px", color: "#9090A8", marginBottom: "8px", display: "block" }}>I am a…</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={`role-tab ${role === "consumer" ? "active" : ""}`}
                onClick={() => setRole("consumer")}
              >🛍️ Consumer</button>
              <button
                className={`role-tab ${role === "founder" ? "active" : ""}`}
                onClick={() => setRole("founder")}
              >🏪 Business Owner</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "12px", color: "#9090A8", marginBottom: "6px", display: "block" }}>Full Name</label>
              <input
                className="leo-input"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "12px", color: "#9090A8", marginBottom: "6px", display: "block" }}>Student Email</label>
            <input
              className="leo-input"
              type="email"
              placeholder="name@student.edu.sg"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: "1.5rem", position: "relative" }}>
            <label style={{ fontSize: "12px", color: "#9090A8", marginBottom: "6px", display: "block" }}>Password</label>
            <input
              className="leo-input"
              type={showPassword ? "text" : "password"}
              placeholder={mode === "signup" ? "Create a password (min 6 chars)" : "Your password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={{ paddingRight: "48px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: "absolute", right: "12px", top: "34px",
                background: "none", border: "none", cursor: "pointer",
                color: "#5A5A72", fontSize: "16px", padding: "4px",
              }}
            >{showPassword ? "🙈" : "👁️"}</button>
          </div>

          {error && (
            <div style={{
              background: "rgba(255,77,106,0.10)",
              border: "1px solid rgba(255,77,106,0.25)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "#FF4D6A",
              marginBottom: "1rem",
            }}>{error}</div>
          )}

          <button className="leo-btn-primary" type="submit" disabled={loading}>
            {loading ? "⏳ Signing in…" : (mode === "login" ? "Sign In →" : "Create Account →")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "13px", color: "#5A5A72" }}>
          {mode === "login" ? (
            <>Don't have an account? <button className="mode-link" onClick={() => { setMode("signup"); setError("") }}>Sign up free</button></>
          ) : (
            <>Already have an account? <button className="mode-link" onClick={() => { setMode("login"); setError("") }}>Sign in</button></>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "1.5rem 0 1.25rem" }}>
          <div style={{ flex: 1, height: "1px", background: "#2A2A38" }} />
          <span style={{ fontSize: "11px", color: "#5A5A72", whiteSpace: "nowrap" }}>Quick Test Accounts</span>
          <div style={{ flex: 1, height: "1px", background: "#2A2A38" }} />
        </div>

        {/* Test account quick-fill buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.values(TEST_ACCOUNTS).map(acc => (
            <button
              key={acc.email}
              className="test-card"
              type="button"
              onClick={() => fillTestAccount(acc.role)}
            >
              <div style={{ fontSize: "24px", flexShrink: 0 }}>{acc.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#F0F0F5", marginBottom: "2px" }}>{acc.label}</div>
                <div style={{ fontSize: "11px", color: "#5A5A72" }}>{acc.email} · 🪙 {acc.coins.toLocaleString()} LeoCoins</div>
              </div>
              <div style={{ fontSize: "11px", color: "#F97316", fontWeight: "700", flexShrink: 0 }}>Use →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
