import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product");

        console.log("PRODUCT DATA:", response.data);

        setProducts(response.data);
      } catch (err) {
        console.error("PRODUCT ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading products...</h2>
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

  return (
    <div className="products-page">

      <div className="products-header">
        <h1>Our Dresses</h1>
        <p>Explore our latest collection</p>
      </div>

      <div className="products-grid">

        {products.map((product) => (
          <div
            className="product-card"
            key={product._id}
          >

            <div className="product-image">
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

            <div className="product-info">

              <h2>{product.name}</h2>

              <p className="product-description">
                {product.description}
              </p>

              <p className="product-price">
                {product.price
                  ? `₹${product.price}`
                  : "Price unavailable"}
              </p>

              <Link
                to={`/products/${product._id}`}
                className="view-btn"
              >
                View Details
              </Link>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Products;