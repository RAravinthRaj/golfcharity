import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const tabs = ["overview", "scores", "subscription", "draws"];

export default function DashboardPage({ charities }) {
  const { user, setUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [scoreForm, setScoreForm] = useState({ value: "", playedAt: "" });
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [proofFiles, setProofFiles] = useState({});

  const refreshDashboard = async () => {
    const response = await api.get("/user/dashboard");
    setDashboard(response.data);
    setUser(response.data.profile);
  };

  useEffect(() => {
    refreshDashboard().catch(() => setError("Unable to load dashboard data."));
  }, []);

  const userWinnings = useMemo(() => {
    if (!dashboard?.recentDraws) {
      return [];
    }

    return dashboard.recentDraws.flatMap((draw) =>
      draw.winners
        .filter((winner) => winner.user?._id === user?.id || winner.user?._id === user?._id)
        .map((winner) => ({ ...winner, draw }))
    );
  }, [dashboard, user]);

  const submitScore = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/user/scores", {
        value: Number(scoreForm.value),
        playedAt: scoreForm.playedAt
      });
      setScoreForm({ value: "", playedAt: "" });
      setMessage("Score saved. The list keeps only your latest five scores.");
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save score.");
    }
  };

  const startEditScore = (score) => {
    setEditingScoreId(score._id);
    setScoreForm({
      value: score.value,
      playedAt: new Date(score.playedAt).toISOString().slice(0, 10)
    });
    setActiveTab("scores");
  };

  const saveEditedScore = async () => {
    try {
      await api.put(`/user/scores/${editingScoreId}`, {
        value: Number(scoreForm.value),
        playedAt: scoreForm.playedAt
      });
      setEditingScoreId(null);
      setScoreForm({ value: "", playedAt: "" });
      setMessage("Score updated.");
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update score.");
    }
  };

  const removeScore = async (scoreId) => {
    try {
      await api.delete(`/user/scores/${scoreId}`);
      setMessage("Score removed.");
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not remove score.");
    }
  };

  const activateSubscription = async () => {
    setMessage("");
    setError("");

    try {
      await api.post("/user/subscriptions/demo-activate", { plan: selectedPlan });
      setMessage("Demo subscription activated successfully.");
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Subscription activation failed.");
    }
  };

  const updateProfile = async (payload) => {
    try {
      await api.put("/user/profile", payload);
      setMessage("Profile updated.");
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Profile update failed.");
    }
  };

  const submitProof = async (drawId) => {
    const file = proofFiles[drawId];

    if (!file) {
      setError("Please choose an image before uploading proof.");
      return;
    }

    const formData = new FormData();
    formData.append("proof", file);
    formData.append("notes", "Submitted from user dashboard");

    try {
      await api.post(`/user/draws/${drawId}/proof`, formData);
      setMessage("Winner proof uploaded for admin review.");
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Proof upload failed.");
    }
  };

  if (!dashboard) {
    return <div className="page-state">Loading dashboard...</div>;
  }

  return (
    <div className="page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">Subscriber dashboard</p>
          <h1>Welcome back, {dashboard.profile.name}</h1>
          <p className="hero-copy">
            Manage your subscription, keep your score memory sharp, and stay ready for the next
            monthly draw.
          </p>
          <div className="hero-badges">
            <span>{dashboard.profile.subscription?.status || "inactive"} subscription</span>
            <span>{dashboard.summary.drawsEntered} draws entered</span>
            <span>${dashboard.summary.totalWon} total won</span>
          </div>
        </div>
        <div className="dashboard-hero-panel">
          <div className="dashboard-highlight">
            <span>Current charity</span>
            <strong>{dashboard.profile.selectedCharity?.name || "Select a charity"}</strong>
          </div>
          <div className="dashboard-highlight">
            <span>Renewal date</span>
            <strong>
              {dashboard.profile.subscription?.renewalDate
                ? new Date(dashboard.profile.subscription.renewalDate).toLocaleDateString()
                : "Not scheduled"}
            </strong>
          </div>
        </div>
      </section>

      <section className="section-header dashboard-header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Your golf and giving controls</h2>
        </div>
        <div className="tab-row">
          {tabs.map((tab) => (
            <button
              className={`tab-button ${tab === activeTab ? "active" : ""}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {message ? <div className="success-banner">{message}</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}

      {activeTab === "overview" ? (
        <div className="dashboard-grid">
          <article className="card dashboard-card spotlight-card">
            <h3>Subscription</h3>
            <p>Status: {dashboard.profile.subscription?.status || "inactive"}</p>
            <p>Plan: {dashboard.profile.subscription?.plan || "none"}</p>
            <p>
              Renewal:{" "}
              {dashboard.profile.subscription?.renewalDate
                ? new Date(dashboard.profile.subscription.renewalDate).toLocaleDateString()
                : "Not scheduled"}
            </p>
          </article>
          <article className="card dashboard-card">
            <h3>Charity settings</h3>
            <p>{dashboard.profile.selectedCharity?.name || "No charity selected yet"}</p>
            <p>Contribution: {dashboard.profile.charityContributionPercentage}%</p>
            <select
              className="input"
              value={dashboard.profile.selectedCharity?._id || ""}
              onChange={(event) => updateProfile({ selectedCharity: event.target.value })}
            >
              <option value="">Choose charity</option>
              {charities.map((charity) => (
                <option key={charity._id} value={charity._id}>
                  {charity.name}
                </option>
              ))}
            </select>
          </article>
          <article className="card dashboard-card">
            <h3>Participation summary</h3>
            <p>Draws entered: {dashboard.summary.drawsEntered}</p>
            <p>Wins: {dashboard.summary.winsCount}</p>
            <p>Total won: ${dashboard.summary.totalWon}</p>
          </article>
          <article className="card dashboard-card">
            <h3>Latest scores</h3>
            <ul className="plain-list">
              {dashboard.profile.scores?.map((score) => (
                <li key={score._id}>
                  {score.value} pts on {new Date(score.playedAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}

      {activeTab === "scores" ? (
        <div className="dashboard-grid">
          <article className="card dashboard-card">
            <h3>Add score</h3>
            <form className="form-grid" onSubmit={submitScore}>
              <input
                className="input"
                type="number"
                min="1"
                max="45"
                placeholder="Stableford score"
                value={scoreForm.value}
                onChange={(event) => setScoreForm({ ...scoreForm, value: event.target.value })}
                required
              />
              <input
                className="input"
                type="date"
                value={scoreForm.playedAt}
                onChange={(event) => setScoreForm({ ...scoreForm, playedAt: event.target.value })}
                required
              />
              {editingScoreId ? (
                <div className="winner-actions">
                  <button className="button" type="button" onClick={saveEditedScore}>
                    Update score
                  </button>
                  <button
                    className="button ghost"
                    type="button"
                    onClick={() => {
                      setEditingScoreId(null);
                      setScoreForm({ value: "", playedAt: "" });
                    }}
                  >
                    Cancel edit
                  </button>
                </div>
              ) : (
                <button className="button" type="submit">
                  Save latest round
                </button>
              )}
            </form>
          </article>
          <article className="card dashboard-card">
            <h3>Your five-score timeline</h3>
            <ul className="plain-list">
              {dashboard.profile.scores?.map((score) => (
                <li key={score._id}>
                  <div>
                    <strong>{score.value} points</strong>
                    <div className="muted">{new Date(score.playedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="winner-actions">
                    <button className="button ghost" onClick={() => startEditScore(score)}>
                      Edit
                    </button>
                    <button className="button ghost" onClick={() => removeScore(score._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}

      {activeTab === "subscription" ? (
        <div className="dashboard-grid">
          <article className="card dashboard-card spotlight-card">
            <h3>Activate subscription</h3>
            <p>Use the demo activation in local development, or wire Stripe with env values later.</p>
            <select
              className="input"
              value={selectedPlan}
              onChange={(event) => setSelectedPlan(event.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button className="button" onClick={activateSubscription}>
              Activate demo plan
            </button>
          </article>
          <article className="card dashboard-card">
            <h3>Contribution settings</h3>
            <input
              className="input"
              type="number"
              min="10"
              max="100"
              defaultValue={dashboard.profile.charityContributionPercentage}
              onBlur={(event) =>
                updateProfile({
                  charityContributionPercentage: Number(event.target.value)
                })
              }
            />
            <p className="muted">Minimum 10% of the subscription fee supports your selected charity.</p>
          </article>
        </div>
      ) : null}

      {activeTab === "draws" ? (
        <div className="dashboard-grid">
          <article className="card wide dashboard-card">
            <h3>Winnings and verification</h3>
            {userWinnings.length ? (
              userWinnings.map((winner) => (
                <div className="winner-row" key={winner._id}>
                  <div>
                    <strong>{winner.draw.monthKey}</strong>
                    <p>
                      {winner.matchCount}-match winner for ${winner.amount} | status:{" "}
                      {winner.proofStatus}
                    </p>
                  </div>
                  <div className="winner-actions">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setProofFiles({
                          ...proofFiles,
                          [winner.draw._id]: event.target.files?.[0]
                        })
                      }
                    />
                    <button className="button ghost" onClick={() => submitProof(winner.draw._id)}>
                      Upload proof
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No verified winnings yet. Once a draw is published, your qualifying entries will appear here.</p>
            )}
          </article>
        </div>
      ) : null}
    </div>
  );
}
