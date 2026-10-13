
import { useEffect, useState } from "react";
import api from "../services/api";
import "../index.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get("/admin/dashboard");
        setStats(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Dashboard load cheyyan kazhinjilla."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="section">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="section">
        <h1>Admin Dashboard</h1>
        <p className="error-message">{error}</p>
        <p>Admin account-il login cheythittundo ennu check cheyyuka.</p>
      </main>
    );
  }

  const data = stats?.data || stats?.stats || stats || {};

  const cards = [
    {
      title: "Total Customers",
      value: data.totalCustomers ?? data.totalUsers ?? 0,
      icon: "👥",
    },
    {
      title: "Total Products",
      value: data.totalProducts ?? 0,
      icon: "👗",
    },
    {
      title: "Total Orders",
      value: data.totalOrders ?? 0,
      icon: "📦",
    },
    {
      title: "Total Sales",
      value: `₹${Number(data.totalSales ?? 0).toLocaleString("en-IN")}`,
      icon: "💰",
    },
    {
      title: "Low Stock Items",
      value: data.lowStockItems ?? 0,
      icon: "⚠️",
    },
  ];

  return (
    <main className="section admin-dashboard">
      <p className="eyebrow">DRESS SHOP ADMIN</p>
      <h1>Dashboard</h1>
      <p className="admin-subtitle">
        Welcome to your store overview.
      </p>

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <div className="admin-stat-card" key={card.title}>
            <div className="admin-stat-icon">{card.icon}</div>
            <span>{card.title}</span>
            <h2>{card.value}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminDashboard;
