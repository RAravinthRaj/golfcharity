import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">GH</span>
          <div>
            <strong>Golf Heroes</strong>
            <small>Play for impact, win with purpose</small>
          </div>
        </Link>
        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/charities">Charities</NavLink>
          {user ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip">{user.name}</span>
              <button className="button ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="button ghost" to="/login">
                Login
              </Link>
              <Link className="button" to="/signup">
                Subscribe
              </Link>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
