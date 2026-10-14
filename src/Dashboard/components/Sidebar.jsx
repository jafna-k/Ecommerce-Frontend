import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "▦" },
    { path: "/admin/products", label: "Products", icon: "♧" },
    { path: "/admin/orders", label: "Orders", icon: "▤" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="brand-icon">✿</span>
        <div>
          <h2>DRESS SHOP</h2>
          <p>ADMIN PANEL</p>
        </div>
      </div>

      <p className="sidebar-heading">MAIN MENU</p>

      <nav className="admin-navigation">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/" className="admin-nav-link">
          <span className="nav-icon">↗</span>
          <span>Visit Store</span>
        </NavLink>

        <button className="admin-logout" onClick={handleLogout}>
          <span className="nav-icon">⇥</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;