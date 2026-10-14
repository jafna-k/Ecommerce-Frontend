
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  const location = useLocation();

  const pageTitle = location.pathname.includes("products")
    ? "Products"
    : location.pathname.includes("orders")
    ? "Orders"
    : "Dashboard";

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="topbar-label">DRESS SHOP / ADMIN</p>
            <h2>{pageTitle}</h2>
          </div>

          <Link to="/" className="store-link">
            Visit Store ↗
          </Link>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
