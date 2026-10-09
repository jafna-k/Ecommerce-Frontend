
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../index.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setSelectedVariant(null);
      setQuantity(1);

      try {
        const [productRes, variantRes] = await Promise.all([
          api.get(`/product/${id}`),
          api.get("/productvariant"),
        ]);

        const productData = productRes.data;
        const variantData = variantRes.data;

        const allVariants = Array.isArray(variantData)
          ? variantData
          : variantData.variants || [];

        const productVariants = allVariants.filter(
          (variant) =>
            String(
              variant.product?._id || variant.product
            ) === String(id)
        );

        if (active) {
          setProduct(productData.product || productData);
          setVariants(productVariants);
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setError(
            "Product load ചെയ്യാൻ കഴിഞ്ഞില്ല. Backend API പരിശോധിക്കുക."
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

  const availableVariants = variants.filter(
    (variant) => Number(variant.stockQuantity) > 0
  );

  const sizes = [
    ...new Set(availableVariants.map((v) => v.size).filter(Boolean)),
  ];

  const colors = [
    ...new Set(availableVariants.map((v) => v.color).filter(Boolean)),
  ];

  function selectVariant(variant) {
    setSelectedVariant(variant);
    setQuantity(1);
    setMessage("");
  }

  function addToCart() {
    if (!localStorage.getItem("token")) {
      setMessage("ദയവായി ആദ്യം login ചെയ്യുക.");
      return;
    }

    if (!selectedVariant) {
      setMessage("ആദ്യം size, color തിരഞ്ഞെടുക്കുക.");
      return;
    }

    if (quantity > Number(selectedVariant.stockQuantity)) {
      setMessage("ആവശ്യമായ quantity stock-ൽ ലഭ്യമല്ല.");
      return;
    }

    const cartItem = {
      productVariant: selectedVariant._id,
      quantity,
    };

    api
      .post("/cart", cartItem)
      .then(() => {
        setMessage("Product cart-ൽ ചേർത്തു!");
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message ||
            "Cart-ൽ ചേർക്കാൻ കഴിഞ്ഞില്ല."
        );
      });
  }

  if (loading) {
    return <main className="section">Loading product...</main>;
  }

  if (error || !product) {
    return (
      <main className="section">
        <p>{error || "Product not found."}</p>
        <Link to="/products">Back to Shop</Link>
      </main>
    );
  }

  const image =
    product.images?.[0] ||
    product.image ||
    "https://placehold.co/600x700?text=Dress";

  return (
    <main className="details-layout">
      <div className="details-image">
        <img src={image} alt={product.name} />
      </div>

      <div className="details-info">
        <p className="eyebrow">DRESSHUB COLLECTION</p>
        <h1>{product.name}</h1>
        <p className="details-description">
          {product.description}
        </p>

        <h2 className="details-price">
          {selectedVariant
            ? `₹${selectedVariant.price}`
            : variants.length
              ? `From ₹${Math.min(
                  ...variants.map((v) => Number(v.price))
                )}`
              : "Price unavailable"}
        </h2>

        <div className="variant-section">
          <h3>Choose Size</h3>
          <div className="option-list">
            {sizes.map((item) => (
              <button
                key={item}
                className={
                  selectedVariant?.size === item
                    ? "variant-option selected"
                    : "variant-option"
                }
                onClick={() => {
                  const match = availableVariants.find(
                    (v) =>
                      v.size === item &&
                      (!selectedVariant ||
                        v.color === selectedVariant.color)
                  );

                  if (match) selectVariant(match);
                  else {
                    setSelectedVariant(null);
                    setMessage("ഈ size-ന് color തിരഞ്ഞെടുക്കുക.");
                  }
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="variant-section">
          <h3>Choose Color</h3>
          <div className="option-list">
            {colors.map((item) => (
              <button
                key={item}
                className={
                  selectedVariant?.color === item
                    ? "variant-option selected"
                    : "variant-option"
                }
                onClick={() => {
                  const match = availableVariants.find(
                    (v) =>
                      v.color === item &&
                      (!selectedVariant ||
                        v.size === selectedVariant.size)
                  );

                  if (match) selectVariant(match);
                  else {
                    setSelectedVariant(null);
                    setMessage("ഈ color-ന് size തിരഞ്ഞെടുക്കുക.");
                  }
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {selectedVariant && (
          <p className="stock-info">
            {selectedVariant.stockQuantity} items available
          </p>
        )}

        {!availableVariants.length && (
          <p className="error-message">Out of stock</p>
        )}

        <div className="quantity-control">
          <h3>Quantity</h3>

          <button
            disabled={!selectedVariant || quantity <= 1}
            onClick={() => setQuantity((q) => q - 1)}
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            disabled={
              !selectedVariant ||
              quantity >= Number(selectedVariant.stockQuantity)
            }
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>

        <button
          className="add-cart-button"
          disabled={!availableVariants.length}
          onClick={addToCart}
        >
          Add to Cart
        </button>

        {message && <p className="cart-message">{message}</p>}

        <p className="details-note">
          Size and color availability depend on stock for each variant.
        </p>
      </div>
    </main>
  );
}

export default ProductDetails;
