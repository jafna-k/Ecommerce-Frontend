
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const image =
    product.images?.[0] ||
    product.image ||
    "https://placehold.co/400x500?text=Dress";

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img
          src={image}
          alt={product.name}
          className="product-image"
        />

        <div className="product-info">
          <h3>{product.name}</h3>
          <p>{product.description}</p>

          <strong>
            {product.price != null
              ? `₹${product.price}`
              : "View price"}
          </strong>
        </div>
      </Link>

      <Link
        to={`/products/${product._id}`}
        className="product-button"
      >
        View Product
      </Link>
    </div>
  );
}

export default ProductCard;
