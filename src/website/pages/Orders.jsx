import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../../index.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setError("");
      const response = await api.get("/order");
      setOrders(response.data);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);
      setError(
        err.response?.data?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      await api.put(`/order/${orderId}/cancel`);
      await fetchOrders();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to cancel order"
      );
    }
  };

  if (loading) {
    return <div className="page-container"><h2>Loading orders...</h2></div>;
  }

  if (error) {
    return <div className="page-container"><h2>{error}</h2></div>;
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link to="/products" className="shop-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-header">
                <div>
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="order-status">{order.status}</span>
              </div>

              <div className="order-address">
                <h4>Delivery Address</h4>
                <p>{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state} -{" "}
                  {order.shippingAddress?.pincode}
                </p>
              </div>

              <div className="order-summary">
                <p>Payment: {order.paymentMethod}</p>
                <p>Payment Status: {order.paymentStatus}</p>
                <p>Subtotal: ₹{order.subtotal}</p>
                <p>Shipping: ₹{order.shippingCharge}</p>
                <h3>Total: ₹{order.totalAmount}</h3>
              </div>

              {order.items?.map((item) => (
                <div className="order-item" key={item._id}>
                  <span>
                    {item.productVariant?.sku || "Product"}
                  </span>
                  <span>
                    Qty: {item.quantity} × ₹{item.price}
                  </span>
                  <span>₹{item.subtotal}</span>
                </div>
              ))}

              {!["Packed", "Shipped", "Delivered", "Cancelled"].includes(
                order.status
              ) && (
                <button
                  className="cancel-order-btn"
                  onClick={() => cancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;