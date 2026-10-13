
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../index.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setMessage("");
      setProduct(null);
      setVariants([]);
      setSelectedVariant(null);
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);

      try {
        const productRes = await api.get(`/product/${id}`);
        const productData =
          productRes.data.product || productRes.data;

        let productVariants = [];

        try {
          const variantRes = await api.get("/productvariant");
          const data = variantRes.data;

          const allVariants = Array.isArray(data)
            ? data
            : data.variants ||
              data.productVariants ||
              data.data ||
              [];

          productVariants = allVariants.filter((variant) => {
            const variantProduct =
              variant.product?._id || variant.product;

            return String(variantProduct) === String(id);
          });
        } catch (variantError) {
          console.error(
            "Variant API error:",
            variantError.response?.data || variantError.message
          );
        }

        if (active) {
          setProduct(productData);
          setVariants(productVariants);
        }
      } catch (err) {
        console.error(
          "Product API error:",
          err.response?.data || err.message
        );

        if (active) {
          setError(
            err.response?.data?.message ||
              "Product load cheyyan kazhinjilla."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  // Backend ProductVariant model uses "stock", not "stockQuantity".
  const availableVariants = variants.filter(
    (variant) => Number(variant.stock) > 0
  );

  const sizes = [
    ...new Set(
      availableVariants.map((variant) => variant.size).filter(Boolean)
    ),
  ];

  const colors = [
    ...new Set(
      availableVariants.map((variant) => variant.color).filter(Boolean)
    ),
  ];

  function chooseSize(size) {
    setSelectedSize(size);
    setSelectedVariant(null);
    setQuantity(1);
    setMessage("");

    const matches = availableVariants.filter(
      (variant) =>
        variant.size === size &&
        (!selectedColor || variant.color === selectedColor)
    );

    if (matches.length > 0) {
      const match =
        matches.find((variant) => variant.color === selectedColor) ||
        matches[0];

      setSelectedColor(match.color);
      setSelectedVariant(match);
    } else {
      setMessage("Ee size/color combination stock-il illa.");
    }
  }

  function chooseColor(color) {
    setSelectedColor(color);
    setSelectedVariant(null);
    setQuantity(1);
    setMessage("");

    const matches = availableVariants.filter(
      (variant) =>
        variant.color === color &&
        (!selectedSize || variant.size === selectedSize)
    );

    if (matches.length > 0) {
      const match =
        matches.find((variant) => variant.size === selectedSize) ||
        matches[0];

      setSelectedSize(match.size);
      setSelectedVariant(match);
    } else {
      setMessage("Ee color/size combination stock-il illa.");
    }
  }

  const variantPrices = variants
    .map((variant) => Number(variant.price ?? product?.price))
    .filter((price) => Number.isFinite(price));

  const displayPrice = selectedVariant
    ? selectedVariant.price ?? product?.price
    : variantPrices.length > 0
      ? Math.min(...variantPrices)
      : product?.price;

  const image = product?.images?.[0] || product?.image || "";

  const imageUrl = image
    ? image.startsWith("http") || image.startsWith("/")
      ? image
      : `/images/${image}`
    : "https://placehold.co/600x700?text=Dress";

  async function addToCart() {
    setMessage("");

    if (!localStorage.getItem("token")) {
      setMessage("Please login before adding products to cart.");
      return;
    }

    if (!selectedVariant) {
      setMessage("Please select an available size and color.");
      return;
    }

    if (quantity < 1 || quantity > Number(selectedVariant.stock)) {
      setMessage("Requested quantity is not available in stock.");
      return;
    }

    try {
      setAdding(true);

      await api.post("/cart", {
        productVariant: selectedVariant._id,
        quantity,
      });

      setMessage("Product added to cart successfully!");
    } catch (err) {
      console.error(
        "Add to cart error:",
        err.response?.data || err.message
      );

      setMessage(
        err.response?.data?.message ||
          "Could not add product to cart."
      );
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <main className="section">
        <p>Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="section">
        <p className="error-message">
          {error || "Product not found."}
        </p>
        <Link to="/products">Back to Shop</Link>
      </main>
    );
  }

  return (
    <main className="details-layout">
      <div className="details-image">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://placehold.co/600x700?text=Dress";
          }}
        />
      </div>

      <div className="details-info">
        <p className="eyebrow">DRESS SHOP COLLECTION</p>

        <h1>{product.name}</h1>

        <p className="details-description">
          {product.description}
        </p>

        <h2 className="details-price">
          {displayPrice != null &&
          Number.isFinite(Number(displayPrice))
            ? `₹${Number(displayPrice).toLocaleString("en-IN")}`
            : "Price unavailable"}
        </h2>

        {sizes.length > 0 && (
          <div className="variant-section">
            <h3>Choose Size</h3>

            <div className="option-list">
              {sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={
                    selectedSize === size
                      ? "variant-option selected"
                      : "variant-option"
                  }
                  onClick={() => chooseSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div className="variant-section">
            <h3>Choose Color</h3>

            <div className="option-list">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={
                    selectedColor === color
                      ? "variant-option selected"
                      : "variant-option"
                  }
                  onClick={() => chooseColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {availableVariants.length === 0 && (
          <p className="error-message">
            No available sizes or colors. Create a product variant
            with stock in the backend.
          </p>
        )}

        {selectedVariant && (
          <p className="stock-info">
            {selectedVariant.stock} items available
          </p>
        )}

        <div className="quantity-control">
          <h3>Quantity</h3>

          <div className="quantity-buttons">
            <button
              type="button"
              disabled={!selectedVariant || quantity <= 1}
              onClick={() => setQuantity((q) => q - 1)}
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              disabled={
                !selectedVariant ||
                quantity >= Number(selectedVariant.stock)
              }
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          className="add-cart-button"
          disabled={!selectedVariant || adding}
          onClick={addToCart}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>

        {message && (
          <p className="cart-message" role="status">
            {message}
            {message.includes("Please login") && (
              <>
                {" "}
                <Link to="/login">Login here</Link>
              </>
            )}
          </p>
        )}

        <p className="details-note">
          Size and color availability depend on stock for each variant.
        </p>

        <Link className="back-to-shop" to="/products">
          ← Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default ProductDetails;
