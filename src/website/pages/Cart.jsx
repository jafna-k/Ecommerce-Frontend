

import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [error, setError] = useState("");
  const [itemToRemove, setItemToRemove] = useState(null);

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
      return "https://placehold.co/400x500/f0eee4/124536?text=MODEZA";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

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

  const itemCount = (cart.items || []).reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const hasOutOfStockItems = (cart.items || []).some(
    (item) =>
      getStock(item) < Number(item.quantity || 0) ||
      getStock(item) <= 0
  );

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 bg-[#faf7f0] text-[#124536]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#124536]" />
        <p className="text-sm font-medium tracking-wide">
          Preparing your shopping bag...
        </p>
        <span className="text-xs tracking-[0.25em] text-[#8a806f]">
          MODEZA
        </span>
      </main>
    );
  }

  return (
    <>
      <style>{`
        .add-more-products {
          color: #164D3D;
          text-decoration: none !important;
        }

        .add-more-products:hover,
        .add-more-products:focus,
        .add-more-products:active {
          color: #B08D57;
          text-decoration: none !important;
        }

        .add-more-arrow {
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .add-more-products:hover .add-more-arrow {
          transform: translateX(-4px);
        }
      `}</style>

      <main className="min-h-screen bg-[#faf7f0] px-4 py-8 text-[#24352e] sm:px-6 sm:py-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-9 flex flex-col justify-between gap-5 border-b border-[#e8dfd2] pb-7 sm:flex-row sm:items-end">
            <div>
              <Link
                to="/"
                className="mb-5 inline-block text-xs font-bold tracking-[0.3em] text-[#124536] transition hover:text-[#8a806f]"
              >
                MODEZA
              </Link>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8a806f]">
                Your shopping bag
              </p>

              <h1 className="font-serif text-4xl font-bold tracking-tight text-[#123f32] sm:text-5xl">
                My Cart
              </h1>

              <p className="mt-3 text-sm text-[#6b7169]">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#124536] px-5 py-3 text-sm font-semibold text-[#124536] transition duration-300 hover:bg-[#124536] hover:text-white sm:self-auto"
            >
              <span>←</span>
              Continue Shopping
            </Link>
          </header>

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

          {!cart.items || cart.items.length === 0 ? (
            <section className="rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-16 text-center shadow-sm sm:py-24">
              <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#f0eee4] text-4xl text-[#124536]">
                🛍️
              </div>

              <p className="mb-3 text-xs font-bold tracking-[0.3em] text-[#8a806f]">
                MODEZA COLLECTION
              </p>

              <h2 className="font-serif text-3xl font-bold text-[#123f32] sm:text-4xl">
                Your cart is waiting
              </h2>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6b7169]">
                Your shopping bag is currently empty. Explore our
                collection and discover something special for your wardrobe.
              </p>

              <Link
                to="/products"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#124536] px-8 py-4 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#0b3428] hover:shadow-md"
              >
                Explore Collection <span>→</span>
              </Link>
            </section>
          ) : (
            <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-9">
              <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8dfd2] px-5 py-5 sm:px-7">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                      Shopping Bag
                    </h2>
                    <p className="mt-1 text-xs text-[#81796d]">
                      Review your selected pieces
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    disabled={updatingItem !== null}
                    className="rounded-lg border border-[#ded6ca] px-4 py-2.5 text-xs font-semibold text-[#98564d] transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="flex flex-col gap-5 p-5 transition duration-300 hover:bg-[#faf8f2] sm:flex-row sm:items-start sm:gap-6 sm:p-7"
                      >
                        <Link
                          to={
                            product._id
                              ? `/products/${product._id}`
                              : "/products"
                          }
                          className="group block w-full shrink-0 overflow-hidden rounded-xl bg-[#f0eee7] sm:w-32 md:w-36"
                        >
                          <img
                            src={getImage(item)}
                            alt={product.name || "MODEZA product"}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "https://placehold.co/400x500/f0eee4/124536?text=MODEZA";
                            }}
                            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a806f]">
                            MODEZA COLLECTION
                          </p>

                          <h3 className="font-serif text-xl font-bold text-[#123f32] sm:text-2xl">
                            {product.name || "Product unavailable"}
                          </h3>

                          {product.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b7169]">
                              {product.description}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {variant.size && (
                              <span className="rounded-lg border border-[#e8dfd2] bg-[#faf7f0] px-3 py-1.5 text-xs font-medium text-[#24352e]">
                                Size: {variant.size}
                              </span>
                            )}

                            {variant.color && (
                              <span className="rounded-lg border border-[#e8dfd2] bg-[#faf7f0] px-3 py-1.5 text-xs font-medium text-[#24352e]">
                                Color: {variant.color}
                              </span>
                            )}
                          </div>

                          <p className="mt-4 text-sm text-[#6b7169]">
                            Price per item:{" "}
                            <span className="font-semibold text-[#124536]">
                              ₹{formatPrice(price)}
                            </span>
                          </p>

                          <div className="mt-5 flex flex-wrap items-center gap-4">
                            <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#ded6ca] bg-white">
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

                              <span className="min-w-10 text-center text-sm font-semibold text-[#24352e]">
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
                              onClick={() => setItemToRemove(item)}
                              disabled={isUpdating}
                              className="text-sm font-semibold text-[#98564d] underline-offset-4 transition hover:text-red-800 hover:underline disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>

                          {stock <= 0 && (
                            <p className="mt-3 text-sm font-medium text-red-600">
                              This variant is currently out of stock.
                            </p>
                          )}

                          {stock > 0 && quantity > stock && (
                            <p className="mt-3 text-sm font-medium text-red-600">
                              Only {stock} items are available. Update your
                              quantity to continue.
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e8dfd2] pt-4 sm:min-w-28 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
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

                <div className="border-t border-[#e8dfd2] bg-[#faf8f2] px-5 py-5 sm:px-7">
                  <Link
                    to="/products"
                    className="add-more-products inline-flex items-center gap-2 text-sm font-semibold transition duration-300"
                  >
                    <span className="add-more-arrow">←</span>
                    Add more products
                  </Link>
                </div>
              </section>

              <aside className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm sm:p-7 lg:sticky lg:top-6">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8a806f]">
                  MODEZA
                </p>

                <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                  Order Summary
                </h2>

                <p className="mb-7 mt-2 text-sm text-[#6b7169]">
                  A little something just for you.
                </p>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#6b7169]">
                      Subtotal ({itemCount} items)
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
                      Subtotal
                    </span>
                    <span className="text-2xl font-bold text-[#124536]">
                      ₹{formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="text-xs leading-6 text-[#81796d]">
                    Shipping charges and the final payable amount will be
                    calculated at checkout.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    disabled={hasOutOfStockItems || updatingItem !== null}
                    className="w-full rounded-xl bg-[#124536] px-5 py-4 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#0b3428] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#124536]/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Proceed to Checkout →
                  </button>

                  {hasOutOfStockItems && (
                    <p className="text-center text-xs leading-5 text-red-600">
                      Please check product stock before proceeding.
                    </p>
                  )}

                </div>

                <div className="mt-7 flex items-center justify-center gap-3 border-t border-[#e8dfd2] pt-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0eee4] text-base">
                    🔒
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#124536]">
                      Secure Checkout
                    </p>
                    <p className="mt-1 text-[10px] text-[#81796d]">
                      Your shopping experience matters
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Custom confirmation modal for removing an item */}
          {itemToRemove && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#102d25]/55 px-4 py-6 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="remove-item-title"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setItemToRemove(null);
                }
              }}
            >
              <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf8] shadow-2xl">
                <div className="flex justify-end px-5 pt-4">
                  <button
                    type="button"
                    onClick={() => setItemToRemove(null)}
                    aria-label="Close confirmation"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#81796d] transition hover:bg-[#f0eee4] hover:text-[#124536]"
                  >
                    ×
                  </button>
                </div>

                <div className="px-7 pb-7 text-center sm:px-9">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eee2] text-2xl text-[#98564d]">
                    ♡
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#b08d57]">
                    MODEZA · YOUR BAG
                  </p>

                  <h2
                    id="remove-item-title"
                    className="mt-2 font-serif text-2xl font-semibold text-[#124536]"
                  >
                    Remove this item?
                  </h2>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#81796d]">
                    Are you sure you want to remove{" "}
                    <span className="font-semibold text-[#124536]">
                      {getProduct(itemToRemove).name ||
                        getProduct(itemToRemove).title ||
                        "this product"}
                    </span>{" "}
                    from your cart?
                  </p>

                  <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={() => setItemToRemove(null)}
                      className="rounded-full border border-[#d8d0c2] px-6 py-3 text-sm font-semibold text-[#124536] transition hover:border-[#124536] hover:bg-[#f3f0e7]"
                    >
                      Keep item
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const itemId = itemToRemove._id;
                        setItemToRemove(null);
                        await removeItem(itemId);
                      }}
                      className="rounded-full bg-[#124536] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b08d57] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Yes, remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 border-t border-[#e8dfd2] pt-6 text-center">
            <p className="font-serif text-sm font-semibold tracking-[0.25em] text-[#124536]">
              MODEZA
            </p>
            <p className="mt-2 text-xs text-[#8a806f]">
              Style that feels like you.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default Cart;
