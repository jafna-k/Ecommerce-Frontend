import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/order");
        setOrders(
          Array.isArray(response.data)
            ? response.data
            : response.data.orders || []
        );
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <div className="admin-page-heading">
        <p className="admin-eyebrow">SALES MANAGEMENT</p>
        <h1>Orders</h1>
        <p>Review customer purchases and order statuses.</p>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>
                    {order.user?.name ||
                      order.customer?.name ||
                      "Customer"}
                  </td>
                  <td>
                    ₹{Number(
                      order.totalAmount ?? order.total ?? order.grandTotal ?? 0
                    ).toLocaleString("en-IN")}
                  </td>
                  <td>{order.paymentStatus || "Pending"}</td>
                  <td>
                    <span className="admin-status">
                      {order.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="admin-empty-cell">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;