
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/order/${id}`);
        const result = response.data;
        const data = result?.data ?? result?.order ?? result;

        if (active) setOrder(data);
      } catch (err) {
        console.error("ORDER DETAILS ERROR:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load order details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOrder();

    return () => {
      active = false;
    };
  }, [id]);

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#faf7f0] text-[#124536]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#124536]" />
        <p className="text-sm font-medium">
          Loading your order details...
        </p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f0] px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0eee4] text-3xl text-[#124536]">
            !
          </div>

          <h2 className="mt-5 font-serif text-2xl font-bold text-[#123f32]">
            {error || "Order not found."}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#81796d]">
            We couldn't display this order. Please try again or return
            to your orders.
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-xl bg-[#124536] px-6 py-3 font-semibold text-white transition hover:bg-[#0b3428]"
          >
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  const address = order.shippingAddress || {};
  const items = order.items || [];

  const steps = [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Delivered",
  ];

  const currentStatus = order.status || "Pending";
  const currentIndex = steps.indexOf(currentStatus);
  const isCancelled = currentStatus === "Cancelled";

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-10 text-[#24352e] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back link */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#124536] transition hover:text-[#0b3428] hover:underline"
        >
          <span>←</span> Back to My Orders
        </Link>

        {/* Page heading */}
        <div className="mb-8 mt-7 flex flex-col justify-between gap-5 border-b border-[#e8dfd2] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#81796d]">
              Dress Shop · Your Purchase
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold text-[#123f32] sm:text-5xl">
              Order Details
            </h1>

            <p className="mt-3 text-sm text-[#6b7169]">
              Order #
              <span className="font-semibold text-[#124536]">
                {String(order._id).slice(-8).toUpperCase()}
              </span>
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
              isCancelled
                ? "border-red-200 bg-red-50 text-red-700"
                : currentStatus === "Delivered"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-[#cddacb] bg-[#eaf0e9] text-[#124536]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isCancelled
                  ? "bg-red-500"
                  : currentStatus === "Delivered"
                    ? "bg-emerald-600"
                    : "bg-[#557665]"
              }`}
            />
            {currentStatus}
          </span>
        </div>

        {/* Order status */}
        <section className="mb-7 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf0e9] text-xl text-[#124536]">
              ✓
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                Order Status
              </h2>
              <p className="mt-1 text-sm text-[#81796d]">
                Track the progress of your order.
              </p>
            </div>
          </div>

          {isCancelled ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              This order has been cancelled.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-5 sm:gap-3">
              {steps.map((step, index) => {
                const completed = currentIndex >= index;
                const active = currentIndex === index;

                return (
                  <div
                    key={step}
                    className="relative flex items-center gap-3 sm:flex-col sm:items-center sm:text-center"
                  >
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute left-4 top-9 hidden h-0.5 w-[calc(100%-0.5rem)] sm:block ${
                          currentIndex > index
                            ? "bg-[#124536]"
                            : "bg-[#e8dfd2]"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                        completed
                          ? "border-[#124536] bg-[#124536] text-white"
                          : "border-[#ded6ca] bg-[#faf7f0] text-[#81796d]"
                      } ${
                        active
                          ? "ring-4 ring-[#124536]/10"
                          : ""
                      }`}
                    >
                      {currentIndex > index ? "✓" : index + 1}
                    </div>

                    <span
                      className={`text-sm sm:mt-3 ${
                        active
                          ? "font-bold text-[#124536]"
                          : completed
                            ? "font-medium text-[#24352e]"
                            : "text-[#968d80]"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-7 border-t border-[#e8dfd2] pt-5 text-sm text-[#81796d]">
            Order placed on:{" "}
            <span className="font-semibold text-[#24352e]">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </section>

        {/* Items ordered */}
        <section className="mb-7 overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
          <div className="border-b border-[#e8dfd2] px-5 py-5 sm:px-8">
            <h2 className="font-serif text-2xl font-bold text-[#123f32]">
              Items Ordered
            </h2>
            <p className="mt-1 text-sm text-[#81796d]">
              {items.length} item(s) in this order
            </p>
          </div>

          {items.length === 0 ? (
            <p className="p-6 text-sm text-[#81796d]">
              No item details available.
            </p>
          ) : (
            <div className="divide-y divide-[#e8dfd2]">
              {items.map((item, index) => {
                const variant = item.productVariant || {};
                const product = variant.product || {};
                const quantity = Number(item.quantity || 0);
                const price = Number(item.price || 0);
                const subtotal = Number(
                  item.subtotal ?? quantity * price
                );

                const image =
                  product.images?.[0] || product.image || "";

                const imageUrl = image
                  ? image.startsWith("http://") ||
                    image.startsWith("https://")
                    ? image
                    : `http://localhost:5000/${image.replace(/^\/+/, "")}`
                  : "https://placehold.co/200x240?text=Dress";

                return (
                  <article
                    key={item._id || index}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-7"
                  >
                    <img
                      src={imageUrl}
                      alt={product.name || "Ordered product"}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/200x240?text=Dress";
                      }}
                      className="h-36 w-full rounded-xl bg-[#f0eee7] object-cover sm:w-28"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-xl font-bold text-[#123f32]">
                        {product.name || variant.sku || "Dress"}
                      </h3>

                      <p className="mt-2 text-xs text-[#81796d]">
                        SKU: {variant.sku || "—"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-md border border-[#e8dfd2] bg-[#faf7f0] px-3 py-1.5 text-xs text-[#24352e]">
                          Size: {variant.size || "—"}
                        </span>
                        <span className="rounded-md border border-[#e8dfd2] bg-[#faf7f0] px-3 py-1.5 text-xs text-[#24352e]">
                          Color: {variant.color || "—"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-[#6b7169]">
                        Quantity: {quantity} × ₹{formatPrice(price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#e8dfd2] pt-4 sm:min-w-28 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                      <span className="text-xs text-[#81796d] sm:mb-2">
                        Item total
                      </span>
                      <strong className="text-lg text-[#124536]">
                        ₹{formatPrice(subtotal)}
                      </strong>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Address and payment */}
        <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2">

          {/* Delivery address */}
          <section className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-[#e8dfd2] pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf0e9] text-xl text-[#124536]">
                ♧
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                Delivery Address
              </h2>
            </div>

            <div className="space-y-3 text-sm leading-6 text-[#6b7169]">
              <p className="text-base font-bold text-[#123f32]">
                {address.name || "—"}
              </p>
              <p>{address.phone || "—"}</p>
              <p>{address.address || "—"}</p>
              <p>
                {[address.city, address.state]
                  .filter(Boolean)
                  .join(", ")}
                {address.pincode ? ` - ${address.pincode}` : ""}
              </p>
            </div>
          </section>

          {/* Payment summary */}
          <section className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-[#e8dfd2] pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf0e9] text-xl text-[#124536]">
                ₹
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                Payment Summary
              </h2>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#6b7169]">Payment Method</span>
                <span className="font-semibold text-[#24352e]">
                  {order.paymentMethod || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#6b7169]">Payment Status</span>
                <span className="rounded-full bg-[#eaf0e9] px-3 py-1 text-xs font-semibold text-[#124536]">
                  {order.paymentStatus || "—"}
                </span>
              </div>

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

              <div className="border-t border-dashed border-[#ded6ca]" />

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-[#123f32]">
                  Total Amount
                </span>
                <strong className="text-2xl text-[#124536]">
                  ₹{formatPrice(order.totalAmount)}
                </strong>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom action */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center rounded-xl bg-[#124536] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b3428]"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl border border-[#124536] px-6 py-3.5 text-sm font-semibold text-[#124536] transition hover:bg-[#124536] hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;
