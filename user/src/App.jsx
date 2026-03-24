import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import api from "./api";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CharitiesPage from "./pages/CharitiesPage";
import CharityDetailPage from "./pages/CharityDetailPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [homeData, setHomeData] = useState(null);
  const [charities, setCharities] = useState([]);
  const [charitySearch, setCharitySearch] = useState("");
  const [selectedCharity, setSelectedCharity] = useState(null);
  const location = useLocation();

  useEffect(() => {
    api.get("/public/home").then((response) => setHomeData(response.data));
  }, []);

  useEffect(() => {
    api
      .get("/charities", {
        params: { q: charitySearch }
      })
      .then((response) => setCharities(response.data.charities));
  }, [charitySearch]);

  useEffect(() => {
    const parts = location.pathname.split("/");

    if (parts[1] !== "charities" || !parts[2]) {
      return;
    }

    api.get(`/charities/${parts[2]}`).then((response) => setSelectedCharity(response.data.charity));
  }, [location.pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage homeData={homeData} />} />
        <Route
          path="/charities"
          element={<CharitiesPage charities={charities} search={charitySearch} setSearch={setCharitySearch} />}
        />
        <Route path="/charities/:slug" element={<CharityDetailPage charity={selectedCharity} />} />
        <Route path="/login" element={<AuthPage mode="login" charities={charities} />} />
        <Route path="/signup" element={<AuthPage mode="signup" charities={charities} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage charities={charities} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
