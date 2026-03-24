import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import api from "./api";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import CharitiesPage from "./pages/CharitiesPage";
import DrawsPage from "./pages/DrawsPage";
import WinnersPage from "./pages/WinnersPage";
import LoginPage from "./pages/LoginPage";

function AdminApp() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [draws, setDraws] = useState([]);
  const [winners, setWinners] = useState([]);
  const [flash, setFlash] = useState("");

  const loadAll = async () => {
    const [dashboardResponse, usersResponse, charityResponse, drawsResponse, winnersResponse] =
      await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/charities"),
        api.get("/admin/draws"),
        api.get("/admin/winners")
      ]);

    setDashboard(dashboardResponse.data);
    setUsers(usersResponse.data.users);
    setCharities(charityResponse.data.charities);
    setDraws(drawsResponse.data.draws);
    setWinners(winnersResponse.data.winners);
  };

  useEffect(() => {
    loadAll().catch(() => {});
  }, []);

  const saveSubscription = async (user, draft) => {
    await api.put(`/admin/users/${user._id}`, {
      subscription: {
        ...user.subscription,
        ...draft
      }
    });
    setFlash("User subscription updated.");
    await loadAll();
  };

  const saveScores = async (user, scoreDraft) => {
    const scores = scoreDraft
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [value, playedAt] = line.split("|");
        return { value: Number(value), playedAt };
      })
      .slice(0, 5);

    await api.put(`/admin/users/${user._id}/scores`, { scores });
    setFlash("User scores updated.");
    await loadAll();
  };

  const createCharity = async (payload) => {
    await api.post("/charities", payload);
    setFlash("Charity created.");
    await loadAll();
  };

  const deleteCharity = async (id) => {
    await api.delete(`/charities/${id}`);
    setFlash("Charity deleted.");
    await loadAll();
  };

  const simulateDraw = async (drawMode) => {
    await api.post("/admin/draws/simulate", { drawMode });
    setFlash("Draw simulation completed.");
    await loadAll();
  };

  const publishDraw = async () => {
    await api.post("/admin/draws/publish", {});
    setFlash("Draw published.");
    await loadAll();
  };

  const updateWinnerStatus = async (winner, proofStatus) => {
    await api.put(`/admin/draws/${winner.drawId}/winners/${winner._id}`, { proofStatus });
    setFlash(`Winner marked as ${proofStatus}.`);
    await loadAll();
  };

  return (
    <AdminLayout>
      {flash ? <div className="success-banner">{flash}</div> : null}
      <Routes>
        <Route path="/dashboard" element={<DashboardPage data={dashboard} />} />
        <Route
          path="/users"
          element={<UsersPage users={users} onSaveSubscription={saveSubscription} onSaveScores={saveScores} />}
        />
        <Route
          path="/charities"
          element={<CharitiesPage charities={charities} onCreate={createCharity} onDelete={deleteCharity} />}
        />
        <Route path="/draws" element={<DrawsPage draws={draws} onSimulate={simulateDraw} onPublish={publishDraw} />} />
        <Route
          path="/winners"
          element={<WinnersPage winners={winners} onUpdateStatus={updateWinnerStatus} />}
        />
        <Route path="*" element={<DashboardPage data={dashboard} />} />
      </Routes>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
