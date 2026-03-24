import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function LoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to login to admin panel."
      );
    }
  };

  return (
    <div className="center-screen">
      <div className="admin-card">
        <p className="eyebrow">Admin panel</p>
        <h1>Manage subscriptions, charities, draws, and winners.</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Admin email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          {error ? <div className="error-banner">{error}</div> : null}
          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
