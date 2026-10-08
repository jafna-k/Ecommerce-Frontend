import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        console.log("Dashboard:", response.data);

        setStats(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <h2 className="loading">Loading dashboard...</h2>;
  }

  if (error) {
    return <h2 className="error">{error}</h2>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Customers</h3>
          <h2>{stats?.customers ?? 0}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Products</h3>
          <h2>{stats?.products ?? 0}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Orders</h3>
          <h2>{stats?.orders ?? 0}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Low Stock</h3>
          <h2>{stats?.lowStock ?? 0}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Total Sales</h3>
          <h2>₹{stats?.sales ?? 0}</h2>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;