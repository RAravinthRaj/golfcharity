import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <Link className="brand-block" to="/dashboard">
          <span>GH</span>
          <div>
            <strong>Golf Heroes Admin</strong>
            <small>Operations control center</small>
          </div>
        </Link>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/charities">Charities</NavLink>
          <NavLink to="/draws">Draws</NavLink>
          <NavLink to="/winners">Winners</NavLink>
        </nav>
        <div className="sidebar-footer">
          <div>
            <strong>{admin?.name}</strong>
            <small>{admin?.email}</small>
          </div>
          <button
            className="button ghost"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <div className="admin-topline">
          <div>
            <p className="eyebrow">Operations control center</p>
            <h1>Golf Heroes Admin</h1>
          </div>
          <div className="admin-status-pill">
            <span className="pulse-dot">Live</span>
            <strong>Atlas connected workspace</strong>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
