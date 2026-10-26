
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [updateError, setUpdateError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/admin/orders/${id}`);
      const result = response.data;
      const orderData = result.data ?? result.order ?? result;

      setOrder(orderData);
    } catch (err) {
      console.error("ORDER DETAILS ERROR:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load order details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatOrderId = (value, length = 6) =>
    String(value || "").slice(-length).toUpperCase();

  const statusStyle = (value) => {
    const current = (value || "Pending").toLowerCase();

    if (current === "delivered") {
      return "bg-green-100 text-green-800";
    }

    if (current === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (current === "shipped") {
      return "bg-blue-100 text-blue-800";
    }

    if (["confirmed", "packed"].includes(current)) {
      return "bg-amber-100 text-amber-800";
    }

    return "bg-[#f0e8d8] text-[#725d36]";
  };

  const getAvailableActions = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return [
          {
            status: "Confirmed",
            label: "Confirm Order",
            style: "bg-[#124536] text-white hover:bg-[#0b3428]",
          },
          {
            status: "Cancelled",
            label: "Cancel Order",
            style:
              "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
          },
        ];

      case "Confirmed":
        return [
          {
            status: "Packed",
            label: "Pack Order",
            style: "bg-[#124536] text-white hover:bg-[#0b3428]",
          },
          {
            status: "Cancelled",
            label: "Cancel Order",
            style:
              "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
          },
        ];

      case "Packed":
        return [
          {
            status: "Shipped",
            label: "Ship Order",
            style: "bg-[#124536] text-white hover:bg-[#0b3428]",
          },
        ];

      case "Shipped":
        return [
          {
            status: "Delivered",
            label: "Mark as Delivered",
            style: "bg-[#124536] text-white hover:bg-[#0b3428]",
          },
        ];

      default:
        return [];
    }
  };

  const updateStatus = async (newStatus) => {
    if (!order || updating || newStatus === order.status) return;

    const allowedActions = getAvailableActions(order.status);

    if (!allowedActions.some((action) => action.status === newStatus)) {
      setUpdateError("This status change is not allowed.");
      return;
    }

    if (
      newStatus === "Cancelled" &&
      !window.confirm("Are you sure you want to cancel this order?")
    ) {
      return;
    }

    try {
      setUpdating(true);
      setSuccessMessage("");
      setUpdateError("");

      const response = await api.put(
        `/admin/orders/${id}/status`,
        { status: newStatus }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to update order status."
        );
      }

      setOrder((prev) => ({
        ...prev,
        status: newStatus,
      }));

      setSuccessMessage(
        newStatus === "Cancelled"
          ? "Order cancelled successfully."
          : `Order status updated to ${newStatus} successfully.`
      );
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);

      setUpdateError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e5ece3] border-t-[#124536]" />
        <p className="text-sm text-[#6b7169]">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-8 text-center shadow-sm">
        <h2 className="font-serif text-2xl font-bold text-[#123f32]">
          Order Details
        </h2>

        <p className="mt-3 text-sm text-red-700">{error}</p>

        <button
          type="button"
          onClick={fetchOrder}
          className="mt-5 rounded-xl bg-[#124536] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b3428]"
        >
          Try Again
        </button>

        <div className="mt-5">
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-[#124536] hover:underline"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#123f32]">
          Order not found
        </h2>

        <Link
          to="/admin/orders"
          className="mt-4 inline-block text-sm font-semibold text-[#124536] hover:underline"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const address = order.shippingAddress || {};
  const items = order.items || [];

  const customerName =
    order.user?.name ||
    order.customer?.name ||
    address.name ||
    "—";

  const customerEmail =
    order.user?.email ||
    order.customer?.email ||
    "—";

  const informationCards = [
    {
      title: "Customer Information",
      icon: "♙",
      iconBg: "bg-[#e5ece3]",
      rows: [
        ["Name", customerName],
        ["Email", customerEmail],
        ["Phone", address.phone || "—"],
      ],
    },
    {
      title: "Order Information",
      icon: "▤",
      iconBg: "bg-[#f0e8d8]",
      rows: [
        ["Order ID", formatOrderId(order._id, 8)],
        ["Order Date", formatDate(order.createdAt)],
        ["Payment Method", order.paymentMethod || "—"],
        ["Payment Status", order.paymentStatus || "Pending"],
      ],
    },
  ];

  const availableActions = getAvailableActions(order.status);

  return (
    <main className="min-w-0 space-y-7">
      {/* Back Navigation */}
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#124536] transition hover:-translate-x-1 hover:text-[#0b3428]"
      >
        <span className="text-lg">←</span>
        Back to Orders
      </Link>

      {/* Order Details and Status */}
      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#81796d]">
            SALES MANAGEMENT
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold text-[#123f32]">
            Order Details
          </h1>

          <p className="mt-2 text-sm text-[#6b7169]">
            Order #{formatOrderId(order._id)}
          </p>

          <p className="mt-1 text-xs text-[#81796d]">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Status displayed here only */}
        <span
          className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-bold sm:self-center ${statusStyle(order.status)}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {order.status || "Pending"}
        </span>
      </header>

      {/* Customer and Order Information */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {informationCards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl text-[#124536] ${card.iconBg}`}
              >
                {card.icon}
              </span>

              <h2 className="font-serif text-lg font-bold text-[#123f32]">
                {card.title}
              </h2>
            </div>

            <div className="space-y-4">
              {card.rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col justify-between gap-1 border-b border-[#eee7dc] pb-3 last:border-0 last:pb-0 sm:flex-row sm:gap-4"
                >
                  <span className="text-sm text-[#81796d]">
                    {label}
                  </span>

                  <span className="break-all text-sm font-semibold text-[#24352e] sm:text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}

        {/* Shipping Address */}
        <article className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:col-span-2 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8e6f1] text-xl text-[#51477d]">
              ⌖
            </span>

            <div>
              <h2 className="font-serif text-lg font-bold text-[#123f32]">
                Shipping Address
              </h2>

              <p className="mt-1 text-xs text-[#81796d]">
                Customer delivery details
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#faf7f0] p-5">
            <p className="font-semibold text-[#123f32]">
              {address.name || address.fullName || customerName}
            </p>

            <p className="mt-2 text-sm text-[#6b7169]">
              {address.phone || "Phone unavailable"}
            </p>

            <p className="mt-3 text-sm leading-6 text-[#24352e]">
              {address.address || "Address unavailable"}
            </p>

            <p className="text-sm leading-6 text-[#24352e]">
              {[address.city, address.state, address.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </article>
      </section>

      {/* Ordered Products */}
      <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
        <div className="border-b border-[#e8dfd2] p-5 sm:p-6">
          <h2 className="font-serif text-xl font-bold text-[#123f32]">
            Ordered Products
          </h2>

          <p className="mt-1 text-sm text-[#81796d]">
            Items included in this order.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#81796d]">
            No product details available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-[#f5f1e8]">
                <tr>
                  {[
                    "Product",
                    "Size",
                    "Color",
                    "Price",
                    "Quantity",
                    "Subtotal",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee7dc]">
                {items.map((item, index) => {
                  const variant = item.productVariant || {};
                  const product = variant.product || {};
                  const itemPrice = Number(item.price || 0);
                  const quantity = Number(item.quantity || 0);
                  const subtotal =
                    item.subtotal ?? itemPrice * quantity;

                  return (
                    <tr
                      key={item._id || index}
                      className="transition hover:bg-[#faf7f0]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#24352e]">
                          {product.name || variant.sku || "Dress"}
                        </p>

                        {variant.sku && (
                          <p className="mt-1 text-xs text-[#81796d]">
                            SKU: {variant.sku}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#6b7169]">
                        {variant.size || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#6b7169]">
                        {variant.color || "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#24352e]">
                        ₹{money(itemPrice)}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-[#24352e]">
                        {quantity}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#123f32]">
                        ₹{money(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Totals */}
        <div className="border-t border-[#e8dfd2] bg-[#faf7f0] p-5 sm:p-6">
          <div className="ml-auto max-w-sm space-y-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-[#6b7169]">Subtotal</span>

              <span className="font-semibold text-[#24352e]">
                ₹{money(order.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-[#6b7169]">Shipping Charge</span>

              <span className="font-semibold text-[#24352e]">
                ₹{money(order.shippingCharge)}
              </span>
            </div>

            <div className="border-t border-[#ded6ca] pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-serif text-lg font-bold text-[#123f32]">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-[#124536]">
                  ₹{money(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Last Section: Action Buttons Only */}
      <section className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-6">
        {successMessage && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            ✓ {successMessage}
          </div>
        )}

        {updateError && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            ✕ {updateError}
          </div>
        )}

        {availableActions.length > 0 ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {availableActions.map((action) => (
              <button
                key={action.status}
                type="button"
                onClick={() => updateStatus(action.status)}
                disabled={updating}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${action.style}`}
              >
                {updating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                    Updating...
                  </>
                ) : (
                  action.label
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#81796d]">
            {order.status === "Delivered"
              ? "Order delivered successfully. No further updates available."
              : "This order has been cancelled. No further updates available."}
          </p>
        )}
      </section>
    </main>
  );
}

export default AdminOrderDetails;
