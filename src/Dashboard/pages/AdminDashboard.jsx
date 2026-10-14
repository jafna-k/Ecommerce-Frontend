
import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        const data = response.data;

        setStats({
          totalCustomers:
            data.totalCustomers ?? data.customers ?? 0,
          totalProducts:
            data.totalProducts ?? data.products ?? 0,
          totalOrders:
            data.totalOrders ?? data.orders ?? 0,
          totalSales:
            data.totalSales ?? data.sales ?? 0,
        });
      } catch (err) {
        console.error(
          "Dashboard API error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
          "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: "♙",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "♧",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "▤",
    },
    {
      title: "Total Sales",
      value: `₹${Number(stats.totalSales || 0).toLocaleString("en-IN")}`,
      icon: "₹",
    },
  ];

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="section-eyebrow">STORE PERFORMANCE</p>
          <h1>Dashboard Overview</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening in your store.
          </p>
        </div>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="stats-grid">
        {cards.map((card) => (
          <article className="stat-card" key={card.title}>
            <div className="stat-card-top">
              <span>{card.title}</span>
              <span className="stat-icon">{card.icon}</span>
            </div>

            <h2>
              {loading ? "..." : card.value}
            </h2>

            <p>Current store statistics</p>
          </article>
        ))}
      </div>

      <section className="management-card">
        <p className="section-eyebrow">QUICK OVERVIEW</p>
        <h2>Store Management</h2>
        <p>
          Manage your dress collection, monitor orders and keep track
          of your customers from the sidebar.
        </p>
      </section>
    </section>
  );
}

export default AdminDashboard