
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

    if (
      !window.confirm(
        "Are you sure you want to cancel this order?"
      )
    ) {
      return;
    }

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

  const getStatusStyle = (status = "Pending") => {
    const styles = {
      Pending: "border-amber-200 bg-amber-50 text-amber-800",
      Confirmed: "border-teal-200 bg-teal-50 text-teal-800",
      Packed: "border-orange-200 bg-orange-50 text-orange-800",
      Shipped: "border-blue-200 bg-blue-50 text-blue-800",
      Delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
      Cancelled: "border-red-200 bg-red-50 text-red-700",
    };

    return styles[status] ||
      "border-[#d8e4d9] bg-[#edf3eb] text-[#164d3d]";
  };

  const canCancel = (status) =>
    !["Packed", "Shipped", "Delivered", "Cancelled"].includes(status);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#faf7f0] px-4 text-[#164d3d]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e5dfd2] border-t-[#164d3d]" />
        <h2 className="font-serif text-2xl font-semibold">
          Loading your orders
        </h2>
        <p className="text-sm text-[#81796d]">
          Preparing your MODEZA purchase history...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f0] px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] p-8 text-center shadow-sm">
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
            className="mt-6 rounded-xl bg-[#164d3d] px-7 py-3 font-semibold text-white transition hover:bg-[#103a2e]"
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-8 text-[#26372f] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
        <header className="relative overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-9 sm:px-10 sm:py-12">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#edf2e8] opacity-80" />
          <div className="absolute -bottom-20 right-32 h-36 w-36 rounded-full bg-[#f5eee0] opacity-70" />

          <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8b806f]">
                MODEZA · Your Shopping Journey
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#123f32] sm:text-5xl">
                My Orders
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#77786e] sm:text-base">
                Every purchase in one place. View your order details,
                follow your delivery and revisit the pieces you love.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#164d3d] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#103a2e] hover:shadow-md"
            >
              <span className="text-lg">＋</span>
              Continue Shopping
            </Link>
          </div>
        </header>

        {/* Order overview */}
        <section className="my-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e9] text-xl text-[#164d3d]">
              <span aria-hidden="true">▤</span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#81796d]">
                All Purchases
              </p>
              <p className="mt-1 text-2xl font-bold text-[#123f32]">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f8efdc] text-xl text-[#997437]">
              <span aria-hidden="true">◷</span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#81796d]">
                In Progress
              </p>
              <p className="mt-1 text-2xl font-bold text-[#123f32]">
                {orders.filter((order) =>
                  ["Pending", "Confirmed", "Packed", "Shipped"].includes(
                    order.status || "Pending"
                  )
                ).length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e7f3e9] text-xl text-[#277448]">
              <span aria-hidden="true">✓</span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#81796d]">
                Delivered
              </p>
              <p className="mt-1 text-2xl font-bold text-[#123f32]">
                {orders.filter(
                  (order) => order.status === "Delivered"
                ).length}
              </p>
            </div>
          </div>
        </section>

        {/* Empty state */}
        {orders.length === 0 ? (
          <section className="rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf0e9] text-4xl text-[#164d3d]">
              ♡
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-[#8b806f]">
              A little something awaits
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold text-[#123f32]">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#81796d]">
              Your shopping journey starts here. Explore the MODEZA
              collection and discover pieces made for your style.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#164d3d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#103a2e]"
            >
              Explore Collection <span>→</span>
            </Link>
          </section>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = order.status || "Pending";
              const address = order.shippingAddress || {};
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm transition duration-300 hover:shadow-md"
                >
                  {/* Order header */}
                  <div className="flex flex-col justify-between gap-4 border-b border-[#e8dfd2] bg-[#f4f1e8] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#81796d]">
                        Order Reference
                      </p>

                      <h3 className="mt-1.5 text-lg font-bold tracking-wide text-[#123f32]">
                        #{String(order._id || "").slice(-8).toUpperCase()}
                      </h3>

                      <p className="mt-1.5 text-xs text-[#81796d]">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${getStatusStyle(status)}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr]">

                    {/* Order details */}
                    <div className="space-y-7 p-5 sm:p-7">

                      {/* Delivery address */}
                      <section>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e9] text-xl text-[#164d3d]">
                            <span aria-hidden="true">⌖</span>
                          </div>

                          <div>
                            <h4 className="font-serif text-xl font-bold text-[#123f32]">
                              Delivery Address
                            </h4>
                            <p className="mt-0.5 text-xs text-[#81796d]">
                              Your shipping information
                            </p>
                          </div>
                        </div>

                        <div className="ml-1 space-y-1.5 border-l-2 border-[#dce5d9] py-1 pl-4 text-sm leading-6 text-[#77786e]">
                          <p className="font-semibold text-[#26372f]">
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

                      <div className="border-t border-dashed border-[#e8dfd2]" />

                      {/* Items */}
                      <section>
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="font-serif text-xl font-bold text-[#123f32]">
                              Your Items
                            </h4>
                            <p className="mt-1 text-xs text-[#81796d]">
                              Products included in this order
                            </p>
                          </div>

                          <span className="rounded-full bg-[#f0eee7] px-3.5 py-1.5 text-xs font-semibold text-[#6b7169]">
                            {items.length} item(s)
                          </span>
                        </div>

                        {items.length === 0 ? (
                          <p className="rounded-xl bg-[#faf7f0] p-4 text-sm text-[#81796d]">
                            Item details unavailable.
                          </p>
                        ) : (
                          <div className="space-y-3">
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
                                  className="flex items-start justify-between gap-4 rounded-2xl border border-[#eee7dc] bg-[#faf8f2] p-4 transition hover:border-[#d6dfd2]"
                                >
                                  <div className="min-w-0">
                                    <p className="break-words font-semibold text-[#123f32]">
                                      {product.name || variant.sku || "Product"}
                                    </p>

                                    <p className="mt-1.5 text-xs text-[#81796d]">
                                      SKU: {variant.sku || "—"}
                                    </p>

                                    {(variant.size || variant.color) && (
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {variant.size && (
                                          <span className="rounded-md border border-[#e5dfd2] bg-white px-2 py-1 text-[11px] font-medium text-[#6b7169]">
                                            Size: {variant.size}
                                          </span>
                                        )}
                                        {variant.color && (
                                          <span className="rounded-md border border-[#e5dfd2] bg-white px-2 py-1 text-[11px] font-medium text-[#6b7169]">
                                            Color: {variant.color}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    <p className="mt-3 text-xs text-[#6b7169]">
                                      Qty: {quantity} × ₹{formatPrice(price)}
                                    </p>
                                  </div>

                                  <strong className="shrink-0 pt-1 text-sm font-bold text-[#164d3d]">
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
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e9] text-lg font-bold text-[#164d3d]">
                          ₹
                        </div>

                        <div>
                          <h4 className="font-serif text-xl font-bold text-[#123f32]">
                            Payment Summary
                          </h4>
                          <p className="mt-0.5 text-xs text-[#81796d]">
                            Order cost breakdown
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5 text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[#81796d]">
                            Payment Method
                          </span>
                          <span className="max-w-[55%] break-words text-right font-semibold text-[#26372f]">
                            {order.paymentMethod || "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#81796d]">
                            Payment Status
                          </span>
                          <span className="rounded-full bg-[#eaf0e9] px-3 py-1 text-right text-xs font-semibold text-[#164d3d]">
                            {order.paymentStatus || "—"}
                          </span>
                        </div>

                        <div className="border-t border-dashed border-[#ded6ca]" />

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#6b7169]">Subtotal</span>
                          <span className="font-medium text-[#26372f]">
                            ₹{formatPrice(order.subtotal)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#6b7169]">Shipping</span>
                          <span className="font-medium text-[#26372f]">
                            ₹{formatPrice(order.shippingCharge)}
                          </span>
                        </div>

                        <div className="border-t border-[#ded6ca]" />

                        <div className="rounded-2xl border border-[#dce5d9] bg-[#eaf0e9] p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#557665]">
                            Total Amount
                          </p>

                          <p className="mt-2 font-serif text-3xl font-bold text-[#164d3d]">
                            ₹{formatPrice(order.totalAmount)}
                          </p>

                          <p className="mt-2 text-[11px] text-[#557665]">
                            Inclusive of applicable order charges
                          </p>
                        </div>
                      </div>

                      {/* Order actions */}
                      <div className="mt-6 flex flex-col gap-3">
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#164d3d] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#103a2e] hover:shadow-md"
                        >
                          View Order Details
                          <span>→</span>
                        </Link>

                        {canCancel(status) && (
                          <button
                            type="button"
                            disabled={cancellingId === order._id}
                            onClick={() =>
                              cancelOrder(order._id, status)
                            }
                            className="inline-flex items-center justify-center rounded-xl border border-[#e7c9c5] bg-[#fffdf9] px-5 py-3 text-sm font-semibold text-[#a33b34] transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId === order._id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        )}

                        {status === "Cancelled" && (
                          <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-xs leading-5 text-red-700">
                            This order has been cancelled.
                          </p>
                        )}

                        {status === "Delivered" && (
                          <p className="rounded-xl border border-[#dce5d9] bg-[#edf4eb] p-3 text-center text-xs leading-5 text-[#356448]">
                            Your order has been delivered successfully.
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

        {/* Bottom shopping link */}
        {orders.length > 0 && (
          <footer className="mt-9 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] px-5 py-7 text-center">
            <p className="font-serif text-lg font-semibold text-[#123f32]">
              There is more to discover.
            </p>
            <p className="mt-1 text-sm text-[#81796d]">
              Find your next favourite piece in our collection.
            </p>

            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#164d3d] transition hover:text-[#0b3428] hover:underline"
            >
              Explore MODEZA Collection <span>→</span>
            </Link>
          </footer>
        )}
      </div>
    </main>
  );
}

export default Orders;
