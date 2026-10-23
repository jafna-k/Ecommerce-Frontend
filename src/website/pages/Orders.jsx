
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const API_ORIGIN = "http://localhost:5000";

function getImageUrl(image) {
  if (!image || typeof image !== "string") return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelError, setCancelError] = useState("");

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

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelError("");
  };

  const closeCancelModal = () => {
    if (cancellingId) return;

    setSelectedOrder(null);
    setCancelError("");
  };

  const cancelOrder = async () => {
    if (!selectedOrder) return;

    const orderId = selectedOrder._id;
    const status = selectedOrder.status || "Pending";

    if (
      ["Packed", "Shipped", "Delivered", "Cancelled"].includes(status)
    ) {
      setSelectedOrder(null);
      return;
    }

    try {
      setCancellingId(orderId);
      setCancelError("");

      await api.put(`/order/${orderId}/cancel`);

      setSelectedOrder(null);
      await fetchOrders();
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err);

      setCancelError(
        err.response?.data?.message ||
          "We couldn't cancel your order. Please try again."
      );
    } finally {
      setCancellingId("");
    }
  };

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

    return (
      styles[status] ||
      "border-[#d8e4d9] bg-[#edf3eb] text-[#164d3d]"
    );
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
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
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
                View your purchases, check your order status and explore
                the pieces you love.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#164d3d] px-6 py-3.5 text-sm font-semibold text-white no-underline shadow-sm transition hover:-translate-y-0.5 hover:bg-[#103a2e] hover:shadow-md"
            >
              <span className="text-lg">＋</span>
              Continue Shopping
            </Link>
          </div>
        </header>

        {/* Overview */}
        <section className="my-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf0e9] text-xl text-[#164d3d]">
              ▤
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8efdc] text-xl text-[#997437]">
              ◷
            </div>
            <div>
              <p className="text-xs font-medium text-[#81796d]">
                In Progress
              </p>
              <p className="mt-1 text-2xl font-bold text-[#123f32]">
                {
                  orders.filter((order) =>
                    ["Pending", "Confirmed", "Packed", "Shipped"].includes(
                      order.status || "Pending"
                    )
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7f3e9] text-xl text-[#277448]">
              ✓
            </div>
            <div>
              <p className="text-xs font-medium text-[#81796d]">
                Delivered
              </p>
              <p className="mt-1 text-2xl font-bold text-[#123f32]">
                {
                  orders.filter((order) => order.status === "Delivered")
                    .length
                }
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
              Explore the MODEZA collection and discover pieces made
              for your style.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#164d3d] px-7 py-3.5 text-sm font-semibold text-white no-underline transition hover:bg-[#103a2e]"
            >
              Explore Collection <span>→</span>
            </Link>
          </section>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = order.status || "Pending";
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

                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${getStatusStyle(status)}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {status}
                    </span>
                  </div>

                  {/* Product items */}
                  <div className="p-5 sm:p-7">
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

                        <span className="rounded-full bg-[#eaf0e9] px-3.5 py-1.5 text-xs font-semibold text-[#164d3d]">
                          {items.length} item(s)
                        </span>
                      </div>

                      {items.length === 0 ? (
                        <p className="rounded-xl bg-[#faf7f0] p-4 text-sm text-[#81796d]">
                          Item details unavailable.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item, index) => {
                            const variant = item.productVariant || {};
                            const product =
                              variant.product || item.product || {};

                            const image =
                              product.image ||
                              variant.image ||
                              item.image ||
                              "";

                            const imageUrl = getImageUrl(image);

                            return (
                              <div
                                key={item._id || index}
                                className="flex flex-col gap-4 rounded-2xl border border-[#e8dfd2] bg-[#faf8f2] p-4 sm:flex-row sm:items-center"
                              >
                                {/* Product image */}
                                <div className="h-36 w-full shrink-0 overflow-hidden rounded-xl border border-[#e8dfd2] bg-[#f0eee7] sm:h-32 sm:w-28">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={product.name || "Ordered product"}
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                      onError={(event) => {
                                        event.currentTarget.style.display =
                                          "none";
                                      }}
                                    />
                                  ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#8b806f]">
                                      <span className="text-3xl">♧</span>
                                      <span className="text-[10px]">
                                        No image
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Product details */}
                                <div className="min-w-0 flex-1">
                                  <h5 className="break-words font-semibold text-[#123f32]">
                                    {product.name || variant.sku || "Product"}
                                  </h5>

                                  {variant.sku && (
                                    <p className="mt-1.5 text-xs text-[#81796d]">
                                      SKU: {variant.sku}
                                    </p>
                                  )}

                                  <p className="mt-2 text-sm text-[#6b7169]">
                                    Quantity: {Number(item.quantity || 0)}
                                  </p>

                                  {(variant.size || variant.color) && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {variant.size && (
                                        <span className="rounded-md border border-[#e5dfd2] bg-white px-2.5 py-1 text-[11px] font-medium text-[#6b7169]">
                                          Size: {variant.size}
                                        </span>
                                      )}

                                      {variant.color && (
                                        <span className="rounded-md border border-[#e5dfd2] bg-white px-2.5 py-1 text-[11px] font-medium text-[#6b7169]">
                                          Color: {variant.color}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  <span
                                    className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
                                  >
                                    {status}
                                  </span>
                                </div>

                                {/* View details */}
                                <div className="shrink-0 sm:ml-auto">
                                  <Link
                                    to={`/orders/${order._id}`}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#164d3d] px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-[#103a2e] sm:w-auto"
                                  >
                                    View Details <span>→</span>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>

                    {/* Order actions */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-[#e8dfd2] pt-5 sm:flex-row sm:justify-end">
                      {canCancel(status) && (
                        <button
                          type="button"
                          onClick={() => openCancelModal(order)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e7c9c5] bg-[#fffdf9] px-5 py-3 text-sm font-semibold text-[#a33b34] transition hover:border-[#c97970] hover:bg-[#fcf0ed] focus:outline-none focus:ring-4 focus:ring-[#f4ded9]"
                        >
                          <span aria-hidden="true">×</span>
                          Cancel Order
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
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#164d3d] no-underline transition hover:text-[#0b3428] hover:underline"
            >
              Explore MODEZA Collection <span>→</span>
            </Link>
          </footer>
        )}
      </div>

      {/* Custom Cancel Confirmation Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#10251d]/60 px-4 py-6 backdrop-blur-[3px]"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !cancellingId
            ) {
              closeCancelModal();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !cancellingId) {
              closeCancelModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[#e8dfd2] bg-[#fffdf9] shadow-2xl"
          >
            {/* Modal decorative header */}
            <div className="relative flex h-28 items-center justify-center overflow-hidden bg-[#f4f1e8]">
              <div className="absolute -left-8 -top-12 h-28 w-28 rounded-full bg-[#e6ece2]" />
              <div className="absolute -bottom-12 -right-4 h-28 w-28 rounded-full bg-[#eadfd0]" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#e7c9c5] bg-[#fffdf9] text-3xl text-[#a33b34] shadow-sm">
                !
              </div>

              {!cancellingId && (
                <button
                  type="button"
                  onClick={closeCancelModal}
                  aria-label="Close cancellation dialog"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#e8dfd2] bg-[#fffdf9] text-xl text-[#6b7169] transition hover:bg-white hover:text-[#123f32]"
                >
                  ×
                </button>
              )}
            </div>

            <div className="px-6 pb-7 pt-6 text-center sm:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8b806f]">
                MODEZA · Order Cancellation
              </p>

              <h2
                id="cancel-modal-title"
                className="mt-3 font-serif text-2xl font-bold text-[#123f32] sm:text-3xl"
              >
                Cancel this order?
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77786e]">
                Are you sure you want to cancel this order? Once cancelled,
                you may not be able to restore it.
              </p>

              <div className="mt-5 rounded-2xl border border-[#e8dfd2] bg-[#faf7f0] px-4 py-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b806f]">
                  Order Reference
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#123f32]">
                    #
                    {String(selectedOrder._id || "")
                      .slice(-8)
                      .toUpperCase()}
                  </p>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(selectedOrder.status || "Pending")}`}
                  >
                    {selectedOrder.status || "Pending"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#81796d]">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              {cancelError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm leading-5 text-red-700"
                >
                  {cancelError}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={Boolean(cancellingId)}
                  onClick={closeCancelModal}
                  className="order-2 rounded-xl border border-[#d9dfd4] bg-[#fffdf9] px-4 py-3.5 text-sm font-semibold text-[#164d3d] transition hover:bg-[#edf2e8] disabled:cursor-not-allowed disabled:opacity-50 sm:order-1"
                >
                  Keep My Order
                </button>

                <button
                  type="button"
                  disabled={Boolean(cancellingId)}
                  onClick={cancelOrder}
                  className="order-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#a33b34] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#862e28] focus:outline-none focus:ring-4 focus:ring-[#f4ded9] disabled:cursor-not-allowed disabled:opacity-60 sm:order-2"
                >
                  {cancellingId === selectedOrder._id ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel Order"
                  )}
                </button>
              </div>

              <p className="mt-4 text-[11px] leading-5 text-[#918779]">
                Changed your mind? You can keep your order and continue
                shopping with MODEZA.
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Orders;
