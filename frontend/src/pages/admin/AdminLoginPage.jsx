import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../../components/form/PasswordField.jsx";
import useAuth from "../../hooks/useAuth.js";

const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
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
      setError("Please fill in your admin email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await adminLogin(formData);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login as admin right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-grid">
      <div className="hero-card">
        <span className="badge">Admin portal</span>
        <h1>Sign in to manage users, notes, and platform activity.</h1>
        <p>
          This portal is only for administrator accounts. Regular student accounts should use the
          standard login page.
        </p>
      </div>

      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <label>
          Admin Email
          <input
            type="email"
            name="email"
            placeholder="admin@example.com"
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
          {submitting ? "Signing in..." : "Login as Admin"}
        </button>

        <p className="auth-footer">
          Student user? <Link to="/login">Go to user login</Link>
        </p>
      </form>
    </section>
  );
};

export default AdminLoginPage;
