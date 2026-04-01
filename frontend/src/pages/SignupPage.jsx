import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiUrl } from '../api';
import "./SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "Enter a valid 10-digit phone";
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
    
    try {
      const response = await fetch(apiUrl('auth/users/register/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: form.email,
          email: form.email,
          password: form.password,
          password2: form.confirmPassword,
          first_name: form.name
        })
      });
      const data = await response.json();
      if (!response.ok) {
        // Handle DRF validation errors format: { "field": ["error msg"] }
        if (typeof data === 'object' && !data.detail && !data.message) {
          const firstError = Object.values(data)[0];
          const errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
          throw new Error(errorMsg || 'Registration failed');
        }
        throw new Error(data.detail || data.message || JSON.stringify(data) || 'Registration failed');
      }
      // Store token and user data
      if (data.access) localStorage.setItem('token', data.access);
      if (data.refresh) localStorage.setItem('refresh', data.refresh);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      // Save signup data for login page prefill
      localStorage.setItem("signupData", JSON.stringify({ email: form.email, name: form.name }));
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", icon: "👤" },
    { name: "email", label: "Email Address", type: "email", icon: "✉️" },
    { name: "password", label: "Password", type: "password", icon: "🔒" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", icon: "🔑" },
    { name: "phone", label: "Phone Number", type: "tel", icon: "📱" },
  ];

  return (
    <div className="signup-root">
      <div className="signup-bg">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="bg-particle" style={{ "--i": i }} />
        ))}
      </div>

      <div className={`signup-card ${submitted ? "submitted" : ""}`}>
        <div className="signup-left">
          <div className="brand-logo">⚡</div>
          <h1 className="brand-name">NEXUS</h1>
          <p className="brand-tagline">Your premium shopping destination</p>
          <div className="brand-features">
            {["Free Shipping over ₹999", "30-Day Returns", "Secure Payments", "24/7 Support"].map((f) => (
              <div key={f} className="feature-item">
                <span className="feature-dot" />
                {f}
              </div>
            ))}
          </div>
          <div className="signup-art">
            <div className="art-circle c1" />
            <div className="art-circle c2" />
            <div className="art-circle c3" />
          </div>
        </div>

        <div className="signup-right">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join millions of happy shoppers</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            {errors.submit && <div className="error-msg" style={{ marginBottom: '1rem', textAlign: 'center' }}>{errors.submit}</div>}
            {fields.map(({ name, label, type, icon }) => (
              <div
                key={name}
                className={`field-group ${focused === name ? "focused" : ""} ${errors[name] ? "error" : ""} ${form[name] ? "filled" : ""}`}
              >
                <span className="field-icon">{icon}</span>
                <div className="field-inner">
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    onFocus={() => setFocused(name)}
                    onBlur={() => setFocused(null)}
                    placeholder=" "
                    autoComplete="off"
                  />
                  <label>{label}</label>
                  <span className="field-bar" />
                </div>
                {errors[name] && <span className="error-msg">{errors[name]}</span>}
              </div>
            ))}

            <button type="submit" className={`signup-btn ${submitted ? "success" : ""}`}>
              {submitted ? (
                <span className="btn-success">✓ Redirecting...</span>
              ) : (
                <span>Create Account <span className="btn-arrow">→</span></span>
              )}
            </button>
          </form>

          <p className="login-link">
            Already have an account?{" "}
            <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}