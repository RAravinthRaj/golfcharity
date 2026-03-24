import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode = "login", charities }) {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    charityId: "",
    charityContributionPercentage: 10
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }

      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to continue right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <p className="eyebrow">{mode === "signup" ? "Create account" : "Welcome back"}</p>
        <h1>{mode === "signup" ? "Join the subscription pool" : "Access your dashboard"}</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <input
              className="input"
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          ) : null}
          <input
            className="input"
            type="email"
            placeholder="Email"
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
          {mode === "signup" ? (
            <>
              <select
                className="input"
                value={form.charityId}
                onChange={(event) => setForm({ ...form, charityId: event.target.value })}
              >
                <option value="">Select a charity</option>
                {charities.map((charity) => (
                  <option key={charity._id} value={charity._id}>
                    {charity.name}
                  </option>
                ))}
              </select>
              <input
                className="input"
                type="number"
                min="10"
                max="100"
                value={form.charityContributionPercentage}
                onChange={(event) =>
                  setForm({ ...form, charityContributionPercentage: Number(event.target.value) })
                }
                placeholder="Charity contribution %"
                required
              />
            </>
          ) : null}
          {error ? <div className="error-banner">{error}</div> : null}
          <button className="button" disabled={submitting} type="submit">
            {submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
