
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const API_ORIGIN = "http://localhost:5000";
const FALLBACK_IMAGE =
  "https://placehold.co/240x300?text=MODEZA";

function getImageUrl(product, variant) {
  const rawImage =
    product?.image ||
    product?.images?.[0] ||
    variant?.image ||
    "";

  const image =
    typeof rawImage === "string"
      ? rawImage
      : rawImage?.url || rawImage?.path || "";

  if (!image || typeof image !== "string") {
    return FALLBACK_IMAGE;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Convert a relative backend image path to a full URL.
  const cleanPath = image
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  return `${API_ORIGIN}/${cleanPath}`;
}

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

        if (active) {
          setOrder(data);
        }
      } catch (err) {
        console.error("ORDER DETAILS ERROR:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load order details."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchOrder();

    return () => {
      active = false;
    };
  }, [id]);

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending:
        "border-amber-200 bg-amber-50 text-amber-800",
      Confirmed:
        "border-teal-200 bg-teal-50 text-teal-800",
      Packed:
        "border-orange-200 bg-orange-50 text-orange-800",
      Shipped:
        "border-blue-200 bg-blue-50 text-blue-800",
      Delivered:
        "border-emerald-200 bg-emerald-50 text-emerald-800",
      Cancelled:
        "border-red-200 bg-red-50 text-red-700",
    };

    return (
      styles[status] ||
      "border-[#d8e4d9] bg-[#edf3eb] text-[#164d3d]"
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#faf7f0] px-4 text-[#164d3d]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#164d3d]" />

        <h2 className="font-serif text-2xl font-bold">
          Loading your order
        </h2>

        <p className="text-sm text-[#81796d]">
          Preparing your MODEZA order details...
        </p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f0] px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4eee2] text-2xl font-bold text-[#164d3d]">
            !
          </div>

          <h2 className="mt-5 font-serif text-2xl font-bold text-[#123f32]">
            {error || "Order not found"}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#81796d]">
            We couldn't display your order. Please return to your
            orders and try again.
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-xl bg-[#164d3d] px-6 py-3 font-semibold text-white transition hover:bg-[#103a2e]"
          >
            ← Back to My Orders
          </Link>
        </section>
      </main>
    );
  }

  const address = order.shippingAddress || {};
  const items = Array.isArray(order.items) ? order.items : [];

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
    <main className="min-h-screen bg-[#faf7f0] px-4 py-7 text-[#26372f] sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back navigation */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#164d3d] transition hover:text-[#103a2e] hover:underline"
        >
          <span>←</span> Back to My Orders
        </Link>

        {/* Order heading */}
        <header className="relative mt-6 overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[#edf2e8]" />
          <div className="absolute -bottom-20 right-40 h-36 w-36 rounded-full bg-[#f4eee2]" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8b806f]">
                MODEZA · Your Purchase
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#123f32] sm:text-5xl">
                Order Details
              </h1>

              <p className="mt-4 text-sm text-[#77786e]">
                Order Reference{" "}
                <span className="font-bold text-[#164d3d]">
                  #
                  {String(order._id || "")
                    .slice(-8)
                    .toUpperCase()}
                </span>
              </p>

              <p className="mt-2 text-xs text-[#81796d]">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold ${getStatusStyle(currentStatus)}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {currentStatus}
            </span>
          </div>
        </header>

        {/* Order tracking */}
        <section className="mt-7 rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf0e9] text-xl text-[#164d3d]">
              ✓
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                Order Tracking
              </h2>

              <p className="mt-1 text-sm text-[#81796d]">
                Follow your order from confirmation to delivery.
              </p>
            </div>
          </div>

          {isCancelled ? (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-bold text-red-600">
                !
              </span>

              <div>
                <p className="font-semibold text-red-800">
                  Order Cancelled
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  This order has been cancelled. Contact customer
                  support if you need assistance.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-5">
              {steps.map((step, index) => {
                const completed = currentIndex >= index;
                const active = currentIndex === index;

                return (
                  <div
                    key={step}
                    className="relative flex items-center gap-3 sm:flex-col sm:gap-0 sm:text-center"
                  >
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-5 hidden h-0.5 w-full sm:block ${
                          currentIndex > index
                            ? "bg-[#164d3d]"
                            : "bg-[#e8dfd2]"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                        completed
                          ? "border-[#164d3d] bg-[#164d3d] text-white"
                          : "border-[#ded6ca] bg-[#faf7f0] text-[#968d80]"
                      } ${
                        active ? "ring-4 ring-[#164d3d]/10" : ""
                      }`}
                    >
                      {currentIndex > index ? "✓" : index + 1}
                    </div>

                    <div className="sm:mt-3">
                      <p
                        className={`text-sm ${
                          active
                            ? "font-bold text-[#164d3d]"
                            : completed
                              ? "font-medium text-[#26372f]"
                              : "text-[#968d80]"
                        }`}
                      >
                        {step}
                      </p>

                      {active && (
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#81796d]">
                          Current Stage
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-2 border-t border-dashed border-[#e8dfd2] pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[#81796d]">Order Date</span>

            <span className="font-semibold text-[#26372f]">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </section>

        {/* Items ordered */}
        <section className="mt-7 overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
          <div className="border-b border-[#e8dfd2] px-5 py-6 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b806f]">
              Your Selection
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-[#123f32]">
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
                const variant =
                  item.productVariant || item.variant || {};

                const product =
                  typeof variant.product === "object"
                    ? variant.product
                    : typeof item.product === "object"
                      ? item.product
                      : {};

                const quantity = Number(item.quantity || 0);
                const price = Number(item.price || 0);

                const subtotal = Number(
                  item.subtotal ?? quantity * price
                );

                const imageUrl = getImageUrl(product, variant);

                return (
                  <article
                    key={item._id || index}
                    className="flex flex-col gap-4 p-5 transition hover:bg-[#fdfbf6] sm:flex-row sm:items-center sm:gap-6 sm:p-7"
                  >
                    <div className="h-52 w-full shrink-0 overflow-hidden rounded-2xl border border-[#eee7dc] bg-[#f4f0e7] sm:h-36 sm:w-28">
                      <img
                        src={imageUrl}
                        alt={product.name || "Ordered product"}
                        loading="lazy"
                        onError={(event) => {
                          console.error(
                            "Product image failed to load:",
                            event.currentTarget.src
                          );

                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b806f]">
                        MODEZA Collection
                      </p>

                      <h3 className="mt-2 break-words font-serif text-xl font-bold text-[#123f32]">
                        {product.name || variant.sku || "Product"}
                      </h3>

                      <p className="mt-1.5 break-all text-xs text-[#81796d]">
                        SKU: {variant.sku || "—"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {variant.size && (
                          <span className="rounded-lg border border-[#e8dfd2] bg-white px-3 py-1.5 text-xs font-medium text-[#526258]">
                            Size: {variant.size}
                          </span>
                        )}

                        {variant.color && (
                          <span className="rounded-lg border border-[#e8dfd2] bg-white px-3 py-1.5 text-xs font-medium text-[#526258]">
                            Color: {variant.color}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-[#6b7169]">
                        {quantity} × ₹{formatPrice(price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#e8dfd2] pt-4 sm:min-w-32 sm:flex-col sm:items-end sm:justify-center sm:border-0 sm:pt-0">
                      <p className="text-xs text-[#81796d]">
                        Item Total
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#164d3d]">
                        ₹{formatPrice(subtotal)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Delivery address and payment */}
        <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">

          {/* Delivery address */}
          <section className="rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-4 border-b border-[#e8dfd2] pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf0e9] text-xl text-[#164d3d]">
                ⌖
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                  Delivery Address
                </h2>

                <p className="mt-1 text-xs text-[#81796d]">
                  Shipping information
                </p>
              </div>
            </div>

            <div className="space-y-2 border-l-2 border-[#dce5d9] py-1 pl-4 text-sm leading-6 text-[#6b7169]">
              <p className="font-bold text-[#123f32]">
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

          {/* Payment summary */}
          <section className="rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-4 border-b border-[#e8dfd2] pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf0e9] text-xl font-bold text-[#164d3d]">
                ₹
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                  Payment Summary
                </h2>

                <p className="mt-1 text-xs text-[#81796d]">
                  Your order cost breakdown
                </p>
              </div>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#81796d]">
                  Payment Method
                </span>

                <span className="max-w-[55%] break-words text-right font-semibold text-[#26372f]">
                  {order.paymentMethod || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#81796d]">
                  Payment Status
                </span>

                <span className="rounded-full bg-[#eaf0e9] px-3 py-1.5 text-xs font-semibold text-[#164d3d]">
                  {order.paymentStatus || "—"}
                </span>
              </div>

              <div className="border-t border-dashed border-[#ded6ca]" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#6b7169]">Subtotal</span>

                <span className="font-medium text-[#26372f]">
                  ₹{formatPrice(order.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#6b7169]">Shipping</span>

                <span className="font-medium text-[#26372f]">
                  ₹{formatPrice(order.shippingCharge)}
                </span>
              </div>

              <div className="border-t border-[#ded6ca]" />

              <div className="rounded-2xl border border-[#dce5d9] bg-[#eaf0e9] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#557665]">
                  Total Amount
                </p>

                <p className="mt-2 font-serif text-3xl font-bold text-[#164d3d]">
                  ₹{formatPrice(order.totalAmount)}
                </p>

                <p className="mt-2 text-xs text-[#557665]">
                  Includes applicable shipping charges.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom navigation */}
        <footer className="mt-8 rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] px-5 py-7 text-center sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8b806f]">
            MODEZA
          </p>

          <h3 className="mt-2 font-serif text-xl font-bold text-[#123f32]">
            Thank you for shopping with us.
          </h3>

          <p className="mt-2 text-sm text-[#81796d]">
            Discover more pieces that match your style.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center rounded-xl bg-[#164d3d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#103a2e]"
            >
              ← My Orders
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-xl border border-[#164d3d] px-6 py-3.5 text-sm font-semibold text-[#164d3d] transition hover:bg-[#164d3d] hover:text-white"
            >
              Continue Shopping →
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default OrderDetails;
