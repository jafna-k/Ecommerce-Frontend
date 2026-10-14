import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../index.css";

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
    (total, item) => total + getPrice(item) * Number(item.quantity || 0),
    0
  );

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    const variant = getVariant(item);
    const stock = Number(variant.stockQuantity ?? 0);

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

  if (loading) {
    return (
      <div className="cart-message">
        <div className="cart-loader" />
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-heading">
          <div>
            <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
            <h1>My Cart</h1>
            <p className="cart-count">
              {cart.items?.length || 0} product(s) in your cart
            </p>
          </div>

          <Link to="/products" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="cart-error" role="alert">
            {error}
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {!cart.items || cart.items.length === 0 ? (
          <section className="empty-cart">
            <div className="empty-cart-icon">🛍️</div>
            <h2>Your cart is empty</h2>
            <p>
              You haven't added any products yet. Explore our collection
              and find something you love.
            </p>
            <Link to="/products" className="cart-primary-button">
              Start Shopping
            </Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-section">
              <div className="cart-items-header">
                <h2>Shopping Items</h2>
                <button
                  type="button"
                  className="clear-cart-button"
                  onClick={clearCart}
                  disabled={updatingItem !== null}
                >
                  Clear Cart
                </button>
              </div>

              <div className="cart-items">
                {cart.items.map((item) => {
                  const variant = getVariant(item);
                  const product = getProduct(item);
                  const price = getPrice(item);
                  const quantity = Number(item.quantity || 1);
                  const stock = Number(variant.stockQuantity ?? 0);
                  const isUpdating = updatingItem === item._id;

                  return (
                    <article className="cart-item" key={item._id}>
                      <Link
                        to={`/products/${product._id}`}
                        className="cart-product-image"
                      >
                        <img
                          src={getImage(item)}
                          alt={product.name || "Product"}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src =
                              "https://placehold.co/300x350?text=No+Image";
                          }}
                        />
                      </Link>

                      <div className="cart-product-info">
                        <h3>
                          {product.name || "Product unavailable"}
                        </h3>

                        <p className="cart-product-description">
                          {product.description || ""}
                        </p>

                        <div className="cart-variant-details">
                          {variant.size && (
                            <span>Size: {variant.size}</span>
                          )}
                          {variant.color && (
                            <span>Color: {variant.color}</span>
                          )}
                        </div>

                        <p className="cart-unit-price">
                          ₹{price.toLocaleString("en-IN")} each
                        </p>

                        <div className="cart-item-actions">
                          <div
                            className="quantity-control"
                            aria-label="Product quantity"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item, quantity - 1)
                              }
                              disabled={isUpdating || quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <span>{quantity}</span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item, quantity + 1)
                              }
                              disabled={isUpdating || quantity >= stock}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {isUpdating && (
                            <span className="cart-updating">
                              Updating...
                            </span>
                          )}

                          <button
                            type="button"
                            className="remove-item-button"
                            onClick={() => removeItem(item._id)}
                            disabled={isUpdating}
                          >
                            Remove
                          </button>
                        </div>

                        {stock === 0 && (
                          <p className="cart-stock-warning">
                            This variant is currently out of stock.
                          </p>
                        )}
                      </div>

                      <div className="cart-item-total">
                        ₹{(price * quantity).toLocaleString("en-IN")}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping-free">Calculated at checkout</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <p className="cart-summary-note">
                Shipping charges and final payable amount will be
                confirmed at checkout.
              </p>

              <button
                type="button"
                className="cart-checkout-button"
                onClick={() => navigate("/checkout")}
                disabled={cart.items.some(
                  (item) =>
                    Number(getVariant(item).stockQuantity ?? 0) <
                    Number(item.quantity)
                )}
              >
                Proceed to Checkout →
              </button>

              <Link to="/products" className="summary-continue-link">
                Continue Shopping
              </Link>

              <div className="cart-security-note">
                🔒 Secure checkout
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;