import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordField from "../components/form/PasswordField.jsx";
import useAuth from "../hooks/useAuth.js";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(formData);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-grid">
      <div className="hero-card">
        <span className="badge">Welcome back</span>
        <h1>Sign in and keep your study resources moving.</h1>
        <p>
          Upload notes, discover community resources, and collaborate around the files your class
          actually uses.
        </p>
      </div>

      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <PasswordField
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="primary-button full-width" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-footer">
          Admin access? <Link to="/admin/login">Use admin login</Link>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;
