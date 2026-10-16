
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/order");
      const result = response.data;

      const orderList = Array.isArray(result)
        ? result
        : result.data ?? result.orders ?? [];

      setOrders(Array.isArray(orderList) ? orderList : []);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId, status) => {
    if (
      ["Packed", "Shipped", "Delivered", "Cancelled"].includes(status)
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);

      await api.put(`/order/${orderId}/cancel`);
      await fetchOrders();

      window.alert("Order cancelled successfully.");
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err);

      window.alert(
        err.response?.data?.message || "Failed to cancel order."
      );
    } finally {
      setCancellingId("");
    }
  };

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const normalized = status.toLowerCase();

    if (normalized === "cancelled") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (normalized === "delivered") {
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    }

    if (normalized === "shipped") {
      return "border-blue-200 bg-blue-50 text-blue-800";
    }

    if (normalized === "packed") {
      return "border-amber-200 bg-amber-50 text-amber-800";
    }

    if (normalized === "confirmed") {
      return "border-teal-200 bg-teal-50 text-teal-800";
    }

    return "border-[#d5dfd2] bg-[#eaf0e9] text-[#124536]";
  };

  const canCancel = (status) =>
    !["Packed", "Shipped", "Delivered", "Cancelled"].includes(status);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#faf7f0] text-[#124536]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#124536]" />
        <h2 className="font-serif text-2xl font-bold">
          Loading your orders...
        </h2>
        <p className="text-sm text-[#81796d]">
          Please wait while we fetch your purchases.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f0] px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
            !
          </div>

          <h2 className="mt-5 font-serif text-2xl font-bold text-[#123f32]">
            Unable to load orders
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#81796d]">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchOrders}
            className="mt-6 rounded-xl bg-[#124536] px-7 py-3 font-semibold text-white transition hover:bg-[#0b3428]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-10 text-[#24352e] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#e8dfd2] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#81796d]">
              Dress Shop · Your Purchases
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold text-[#123f32] sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6b7169] sm:text-base">
              View your purchases, track deliveries and manage your orders.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#124536] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b3428]"
          >
            <span>＋</span>
            Continue Shopping
          </Link>
        </div>

        {/* Order count */}
        <div className="my-7 flex items-center justify-between rounded-xl border border-[#e8dfd2] bg-[#fffdf9] px-5 py-4">
          <div>
            <p className="text-sm text-[#81796d]">Your purchase history</p>
            <p className="mt-1 font-semibold text-[#123f32]">
              Total Orders
            </p>
          </div>

          <span className="flex h-12 min-w-12 items-center justify-center rounded-full bg-[#eaf0e9] px-3 text-lg font-bold text-[#124536]">
            {orders.length}
          </span>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <section className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf0e9] text-4xl text-[#124536]">
              ♡
            </div>

            <h2 className="mt-6 font-serif text-3xl font-bold text-[#123f32]">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#81796d]">
              Your placed orders will appear here. Explore our collection
              and find your favourite dress!
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#124536] px-7 py-3.5 font-semibold text-white transition hover:bg-[#0b3428]"
            >
              Start Shopping →
            </Link>
          </section>
        ) : (
          <div className="space-y-7">
            {orders.map((order) => {
              const status = order.status || "Pending";
              const address = order.shippingAddress || {};
              const items = order.items || [];

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm transition hover:shadow-md"
                >
                  {/* Order header */}
                  <div className="flex flex-col justify-between gap-4 border-b border-[#e8dfd2] bg-[#f6f2e9] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.18em] text-[#81796d]">
                        ORDER ID
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-[#123f32]">
                        #{String(order._id).slice(-8).toUpperCase()}
                      </h3>

                      <p className="mt-1 text-xs text-[#81796d]">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${getStatusStyle(status)}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_0.9fr]">

                    {/* Order information */}
                    <div className="space-y-7 p-5 sm:p-7">

                      {/* Delivery address */}
                      <section>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf0e9] text-lg text-[#124536]">
                            ♧
                          </div>

                          <h4 className="font-serif text-xl font-bold text-[#123f32]">
                            Delivery Address
                          </h4>
                        </div>

                        <div className="space-y-1.5 pl-1 text-sm leading-6 text-[#6b7169]">
                          <p className="font-semibold text-[#24352e]">
                            {address.name || "—"}
                          </p>
                          <p>{address.phone || "—"}</p>
                          <p>{address.address || "—"}</p>
                          <p>
                            {[address.city, address.state]
                              .filter(Boolean)
                              .join(", ")}
                            {address.pincode
                              ? ` - ${address.pincode}`
                              : ""}
                          </p>
                        </div>
                      </section>

                      <div className="border-t border-[#e8dfd2]" />

                      {/* Order items */}
                      <section>
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h4 className="font-serif text-xl font-bold text-[#123f32]">
                            Order Items
                          </h4>

                          <span className="rounded-full bg-[#f0eee7] px-3 py-1 text-xs font-semibold text-[#6b7169]">
                            {items.length} item(s)
                          </span>
                        </div>

                        {items.length === 0 ? (
                          <p className="text-sm text-[#81796d]">
                            Item details unavailable.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {items.map((item, index) => {
                              const variant = item.productVariant || {};
                              const product = variant.product || {};

                              const quantity = Number(item.quantity || 0);
                              const price = Number(item.price || 0);

                              const subtotal = Number(
                                item.subtotal ?? quantity * price
                              );

                              return (
                                <div
                                  key={item._id || index}
                                  className="flex items-start justify-between gap-4 rounded-xl border border-[#eee7dc] bg-[#faf7f0] p-4"
                                >
                                  <div className="min-w-0">
                                    <p className="font-semibold text-[#123f32]">
                                      {product.name || variant.sku || "Dress"}
                                    </p>

                                    <p className="mt-1 text-xs text-[#81796d]">
                                      SKU: {variant.sku || "—"}
                                    </p>

                                    <p className="mt-2 text-xs text-[#6b7169]">
                                      {variant.size
                                        ? `Size: ${variant.size}`
                                        : ""}
                                      {variant.size && variant.color
                                        ? " · "
                                        : ""}
                                      {variant.color
                                        ? `Color: ${variant.color}`
                                        : ""}
                                    </p>

                                    <p className="mt-2 text-xs text-[#6b7169]">
                                      Qty: {quantity} × ₹{formatPrice(price)}
                                    </p>
                                  </div>

                                  <strong className="shrink-0 text-sm text-[#124536]">
                                    ₹{formatPrice(subtotal)}
                                  </strong>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    </div>

                    {/* Payment summary */}
                    <aside className="border-t border-[#e8dfd2] bg-[#fcfaf5] p-5 sm:p-7 lg:border-l lg:border-t-0">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf0e9] text-lg font-bold text-[#124536]">
                          ₹
                        </div>

                        <h4 className="font-serif text-xl font-bold text-[#123f32]">
                          Payment Summary
                        </h4>
                      </div>

                      <div className="space-y-5 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#81796d]">
                            Payment Method
                          </span>
                          <span className="text-right font-semibold text-[#24352e]">
                            {order.paymentMethod || "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#81796d]">
                            Payment Status
                          </span>
                          <span className="rounded-full bg-[#eaf0e9] px-3 py-1 text-xs font-semibold text-[#124536]">
                            {order.paymentStatus || "—"}
                          </span>
                        </div>

                        <div className="border-t border-dashed border-[#ded6ca]" />

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#6b7169]">Subtotal</span>
                          <span className="font-medium text-[#24352e]">
                            ₹{formatPrice(order.subtotal)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[#6b7169]">Shipping</span>
                          <span className="font-medium text-[#24352e]">
                            ₹{formatPrice(order.shippingCharge)}
                          </span>
                        </div>

                        <div className="border-t border-[#ded6ca]" />

                        <div className="rounded-xl bg-[#eaf0e9] p-4">
                          <p className="text-xs font-semibold text-[#557665]">
                            Total Amount
                          </p>

                          <p className="mt-1 text-2xl font-bold text-[#124536]">
                            ₹{formatPrice(order.totalAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-7 flex flex-col gap-3">
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#124536] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b3428]"
                        >
                          View Order Details
                          <span>→</span>
                        </Link>

                        {canCancel(status) && (
                          <button
                            type="button"
                            disabled={cancellingId === order._id}
                            onClick={() => cancelOrder(order._id, status)}
                            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId === order._id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        )}

                        {status === "Cancelled" && (
                          <p className="rounded-xl bg-red-50 p-3 text-center text-xs text-red-700">
                            This order has been cancelled.
                          </p>
                        )}
                      </div>
                    </aside>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom link */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="text-sm font-semibold text-[#124536] transition hover:text-[#0b3428] hover:underline"
            >
              ← Explore More Dresses
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default Orders;
