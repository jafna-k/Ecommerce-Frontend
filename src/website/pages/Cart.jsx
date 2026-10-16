

import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    try {
      setError("");
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load cart. Please login and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const getVariant = (item) => item.productVariant || {};
  const getProduct = (item) => getVariant(item).product || {};

  const getPrice = (item) => {
    const variant = getVariant(item);
    return Number(item.price ?? variant.price ?? 0);
  };

  const getStock = (item) => {
    const variant = getVariant(item);
    return Number(variant.stockQuantity ?? variant.stock ?? 0);
  };

  const getImage = (item) => {
    const product = getProduct(item);
    const image = product.images?.[0] || product.image;

    if (!image) {
      return "https://placehold.co/300x350?text=No+Image";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
  };

  const subtotal = (cart.items || []).reduce(
    (total, item) =>
      total + getPrice(item) * Number(item.quantity || 0),
    0
  );

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    const stock = getStock(item);

    if (newQuantity > stock) {
      setError(`Only ${stock} items are available in stock.`);
      return;
    }

    try {
      setError("");
      setUpdatingItem(item._id);

      const response = await api.put(`/cart/${item._id}`, {
        quantity: newQuantity,
      });

      setCart(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update quantity."
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("Remove this product from your cart?")) return;

    try {
      setError("");
      setUpdatingItem(itemId);

      const response = await api.delete(`/cart/${itemId}`);
      setCart(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to remove product."
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const clearCart = async () => {
    if (!cart.items?.length) return;

    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await api.delete("/cart");
      setCart(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to clear cart."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-IN");

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#faf7f0] text-[#124536]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#124536]" />
        <p className="font-medium">Loading your shopping bag...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-10 text-[#24352e] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 border-b border-[#e8dfd2] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#81796d]">
              Your shopping bag
            </p>

            <h1 className="font-serif text-4xl font-bold text-[#123f32] sm:text-5xl">
              My Cart
            </h1>

            <p className="mt-3 text-sm text-[#6b7169]">
              {cart.items?.length || 0} product(s) in your cart
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#124536] px-5 py-3 text-sm font-semibold text-[#124536] transition hover:bg-[#124536] hover:text-white sm:self-auto"
          >
            <span>←</span> Continue Shopping
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
              className="text-xl font-bold leading-none hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Empty cart */}
        {!cart.items || cart.items.length === 0 ? (
          <section className="rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-16 text-center shadow-sm sm:py-24">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#f0eee4] text-5xl">
              🛍️
            </div>

            <h2 className="font-serif text-3xl font-bold text-[#123f32]">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6b7169]">
              You haven't added any products yet. Explore our collection
              and find something you love.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#124536] px-8 py-3.5 font-semibold text-white transition hover:bg-[#0b3428]"
            >
              Start Shopping →
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
            {/* Shopping items */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8dfd2] px-5 py-5 sm:px-7">
                <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                  Shopping Items
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  disabled={updatingItem !== null}
                  className="rounded-lg border border-[#ded6ca] px-4 py-2 text-sm font-semibold text-[#8b453e] transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-[#e8dfd2]">
                {cart.items.map((item) => {
                  const variant = getVariant(item);
                  const product = getProduct(item);
                  const price = getPrice(item);
                  const quantity = Number(item.quantity || 1);
                  const stock = getStock(item);
                  const isUpdating = updatingItem === item._id;

                  return (
                    <article
                      key={item._id}
                      className="flex flex-col gap-5 p-5 transition hover:bg-[#faf8f2]/70 sm:flex-row sm:items-start sm:p-7"
                    >
                      {/* Product image */}
                      <Link
                        to={`/products/${product._id}`}
                        className="block w-full shrink-0 overflow-hidden rounded-xl bg-[#f0eee7] sm:w-32"
                      >
                        <img
                          src={getImage(item)}
                          alt={product.name || "Product"}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src =
                              "https://placehold.co/300x350?text=No+Image";
                          }}
                          className="h-64 w-full object-cover transition duration-500 hover:scale-105 sm:h-40"
                        />
                      </Link>

                      {/* Product details */}
                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8a806f]">
                          Dress Shop Collection
                        </p>

                        <h3 className="font-serif text-xl font-bold text-[#123f32]">
                          {product.name || "Product unavailable"}
                        </h3>

                        {product.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b7169]">
                            {product.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {variant.size && (
                            <span className="rounded-md border border-[#e8dfd2] bg-[#faf7f0] px-3 py-1.5 text-xs font-medium text-[#24352e]">
                              Size: {variant.size}
                            </span>
                          )}

                          {variant.color && (
                            <span className="rounded-md border border-[#e8dfd2] bg-[#faf7f0] px-3 py-1.5 text-xs font-medium text-[#24352e]">
                              Color: {variant.color}
                            </span>
                          )}
                        </div>

                        <p className="mt-4 text-sm text-[#6b7169]">
                          Price:{" "}
                          <span className="font-semibold text-[#124536]">
                            ₹{formatPrice(price)}
                          </span>{" "}
                          each
                        </p>

                        {/* Quantity controls */}
                        <div className="mt-5 flex flex-wrap items-center gap-4">
                          <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#ded6ca] bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item, quantity - 1)
                              }
                              disabled={isUpdating || quantity <= 1}
                              aria-label="Decrease quantity"
                              className="h-10 w-10 text-lg text-[#124536] transition hover:bg-[#f0eee4] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>

                            <span className="min-w-10 text-center text-sm font-semibold">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item, quantity + 1)
                              }
                              disabled={isUpdating || quantity >= stock}
                              aria-label="Increase quantity"
                              className="h-10 w-10 text-lg text-[#124536] transition hover:bg-[#f0eee4] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>

                          {isUpdating && (
                            <span className="text-xs text-[#81796d]">
                              Updating...
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeItem(item._id)}
                            disabled={isUpdating}
                            className="text-sm font-semibold text-[#98564d] underline-offset-4 transition hover:text-red-800 hover:underline disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>

                        {stock === 0 && (
                          <p className="mt-3 text-sm text-red-600">
                            This variant is currently out of stock.
                          </p>
                        )}
                      </div>

                      {/* Item total */}
                      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e8dfd2] pt-4 sm:min-w-24 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <span className="text-xs text-[#81796d] sm:hidden">
                          Item total
                        </span>

                        <p className="text-lg font-bold text-[#124536]">
                          ₹{formatPrice(price * quantity)}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="border-t border-[#e8dfd2] bg-[#faf8f2] px-5 py-4 sm:px-7">
                <Link
                  to="/products"
                  className="text-sm font-semibold text-[#124536] transition hover:text-[#0b3428] hover:underline"
                >
                  ← Add more products
                </Link>
              </div>
            </section>

            {/* Order summary */}
            <aside className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm sm:p-7 lg:sticky lg:top-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a806f]">
                Your purchase
              </p>

              <h2 className="mb-7 font-serif text-2xl font-bold text-[#123f32]">
                Order Summary
              </h2>

              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#6b7169]">
                    Subtotal ({cart.items.length} items)
                  </span>
                  <span className="font-semibold text-[#24352e]">
                    ₹{formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-[#6b7169]">Shipping</span>
                  <span className="max-w-40 text-right text-xs leading-5 text-[#81796d]">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-dashed border-[#ded6ca]" />

                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#123f32]">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#124536]">
                    ₹{formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-xs leading-6 text-[#81796d]">
                  Shipping charges and final payable amount will be
                  confirmed at checkout.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  disabled={cart.items.some(
                    (item) =>
                      getStock(item) < Number(item.quantity)
                  )}
                  className="w-full rounded-xl bg-[#124536] px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-[#0b3428] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#124536]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Proceed to Checkout →
                </button>

                <Link
                  to="/products"
                  className="block rounded-xl border border-[#ded6ca] px-5 py-3 text-center text-sm font-semibold text-[#124536] transition hover:bg-[#faf7f0]"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#e8dfd2] pt-5 text-xs text-[#81796d]">
                <span>🔒</span>
                <span>Secure checkout</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
