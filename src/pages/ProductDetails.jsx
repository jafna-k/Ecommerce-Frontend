import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Product
        const productResponse = await api.get(`/product/${id}`);

        // All variants
        const variantResponse = await api.get("/productvariant");

        const productData = productResponse.data;
        const allVariants = variantResponse.data;

        // Selected product variants
        const productVariants = allVariants.filter(
          (variant) =>
            variant.product?._id === id ||
            variant.product === id
        );

        setProduct(productData);
        setVariants(productVariants);

        // First variant selected by default
        if (productVariants.length > 0) {
          setSelectedVariant(productVariants[0]);
        }

      } catch (err) {
        console.error("PRODUCT DETAILS ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <h2>Product not found</h2>
      </div>
    );
  }

  const handleQuantityChange = (value) => {
    if (!selectedVariant) return;

    if (value < 1) {
      setQuantity(1);
      return;
    }

    if (value > selectedVariant.stock) {
      setQuantity(selectedVariant.stock);
      return;
    }

    setQuantity(value);
  };
const handleAddToCart = async () => {
  if (!selectedVariant) {
    alert("Please select a variant");
    return;
  }

  try {
    const response = await api.post("/cart", {
      productVariant: selectedVariant._id,
      quantity: quantity,
    });

    console.log("CART RESPONSE:", response.data);

    alert("Product added to cart");

  } catch (err) {
    console.error("ADD CART ERROR:", err);

    alert(
      err.response?.data?.message ||
      "Failed to add product to cart"
    );
  }
};
  return (
    <div className="product-details-page">

      {/* IMAGE */}
      <div className="product-details-image">
        {product.image ? (
          <img
            src={`/images/${product.image}`}
            alt={product.name}
          />
        ) : (
          <div className="no-image">
            No Image
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="product-details-info">

        <h1>{product.name}</h1>

        <p className="product-description">
          {product.description}
        </p>

        {/* VARIANTS */}
        {variants.length > 0 ? (
          <>
            <h3>Select Variant</h3>

            <div className="variant-list">
              {variants.map((variant) => (
                <button
                  key={variant._id}
                  className={
                    selectedVariant?._id === variant._id
                      ? "variant-btn selected"
                      : "variant-btn"
                  }
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQuantity(1);
                  }}
                >
                  {variant.size && (
                    <span>Size: {variant.size}</span>
                  )}

                  {variant.color && (
                    <span> | Color: {variant.color}</span>
                  )}
                </button>
              ))}
            </div>

            {/* PRICE */}
            <h2 className="product-price">
              ₹{selectedVariant?.price || 0}
            </h2>

            {/* STOCK */}
            <p className="product-stock">
              Stock: {selectedVariant?.stock ?? 0}
            </p>

            {/* QUANTITY */}
            <div className="quantity-section">
              <button
                onClick={() =>
                  handleQuantityChange(quantity - 1)
                }
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  handleQuantityChange(quantity + 1)
                }
              >
                +
              </button>
            </div>

            {/* ADD CART */}
            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                selectedVariant.stock <= 0
              }
            >
              {selectedVariant?.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </>
        ) : (
          <p className="product-price">
            No variants available
          </p>
        )}

        <br />

        <Link to="/products" className="back-btn">
          ← Back to Products
        </Link>

      </div>
    </div>
  );
}

export default ProductDetails;