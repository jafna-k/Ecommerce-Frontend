import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");

      console.log("CART DATA:", response.data);

      setCart(response.data);
    } catch (err) {
      console.error("CART ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.put(`/cart/${itemId}`, {
        quantity,
      });

      fetchCart();
    } catch (err) {
      console.error("UPDATE CART ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update cart"
      );
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);

      fetchCart();
    } catch (err) {
      console.error("REMOVE CART ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Failed to remove item"
      );
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");

      setCart({
        items: [],
      });
    } catch (err) {
      console.error("CLEAR CART ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Failed to clear cart"
      );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading cart...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2>{error}</h2>

        <Link to="/login">
          Login
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="cart-page">

      <div className="cart-header">
        <div>
          <h1>Your Cart</h1>
          <p>
            {items.length} item
            {items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {items.length > 0 && (
          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>

          <p>
            Add some beautiful dresses
            to your cart.
          </p>

          <Link
            to="/products"
            className="shop-btn"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-items">

          {items.map((item) => {
            const variant = item.productVariant;
            const product = variant?.product;

            return (
              <div
                className="cart-item"
                key={item._id}
              >

                <div className="cart-item-image">
                  {product?.image ? (
                    <img
                      src={`/images/${product.image}`}
                      alt={
                        product?.name ||
                        "Product"
                      }
                    />
                  ) : (
                    <div className="no-image">
                      No Image
                    </div>
                  )}
                </div>

                <div className="cart-item-info">

                  <h2>
                    {product?.name ||
                      "Product"}
                  </h2>

                  {variant?.size && (
                    <p>
                      Size: {variant.size}
                    </p>
                  )}

                  {variant?.color && (
                    <p>
                      Color: {variant.color}
                    </p>
                  )}

                  <p className="cart-price">
                    Price: ₹
                    {variant?.price || 0}
                  </p>

                  <div className="cart-quantity">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity - 1
                        )
                      }
                      disabled={
                        item.quantity <= 1
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="remove-cart-btn"
                    onClick={() =>
                      removeItem(item._id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default Cart;