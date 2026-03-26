import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../api';
import "./Login.css";
import Prism from "./Prism";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("signupData");
    if (saved) {
      const { email } = JSON.parse(saved);
      setForm((f) => ({ ...f, email }));
      setPrefilled(true);
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    
    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('loggedIn', 'true');
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setLoading(false);
      setErrors({ submit: err.message });
    }
  };

  return (
    <div className="login-root">
      <div className="prism-bg">
  <Prism
    animationType="rotate"
    timeScale={0.5}
    height={3.5}
    baseWidth={5.5}
    scale={3.6}
    hueShift={0}
    colorFrequency={1}
    noise={0}
    glow={1}
  />
</div>
      <div className="login-mesh" />

      <div className="login-card">
        {/* Top strip */}
        <div className="login-strip">
          <span className="strip-dot" />
          <span className="strip-dot" />
          <span className="strip-dot" />
        </div>

        <div className="login-inner">
          <div className="login-icon-wrap">
            <div className="login-icon">⚡</div>
          </div>

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-sub">
            {prefilled ? "✓ Account found — sign in to continue" : "Sign in to your NEXUS account"}
          </p>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {errors.submit && <div className="lf-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{errors.submit}</div>}
            {/* EMAIL */}
            <div className={`lf-group ${focused === "email" ? "focused" : ""} ${errors.email ? "error" : ""} ${form.email ? "filled" : ""}`}>
              <label>Email Address</label>
              <div className="lf-input-wrap">
                <span className="lf-prefix">@</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <span className="lf-error">{errors.email}</span>}
            </div>

            {/* PASSWORD */}
            <div className={`lf-group ${focused === "password" ? "focused" : ""} ${errors.password ? "error" : ""} ${form.password ? "filled" : ""}`}>
              <label>Password</label>
              <div className="lf-input-wrap">
                <span className="lf-prefix">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <span className="lf-error">{errors.password}</span>}
            </div>

            <div className="lf-options">
              <label className="remember-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <span className="forgot-link">Forgot password?</span>
            </div>

            <button type="submit" className={`login-btn ${loading ? "loading" : ""} ${success ? "success" : ""}`} disabled={loading || success}>
              {success ? (
                <span>✓ Signed In!</span>
              ) : loading ? (
                <span className="btn-loader">
                  <span /><span /><span />
                </span>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>

          <div className="login-divider"><span>or</span></div>

          <div className="social-btns">
            {["Google", "Apple"].map((p) => (
              <button key={p} className="social-btn">
                {p === "Google" ? "G" : ""} Continue with {p}
              </button>
            ))}
          </div>

          <p className="signup-cta">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Create one</span>
          </p>
        </div>
      </div>
    </div>
  );
}