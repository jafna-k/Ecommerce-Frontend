import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setError("");
      const response = await api.get("/product");
      setProducts(
        Array.isArray(response.data)
          ? response.data
          : response.data.products || []
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/product/${id}`);
      setProducts((old) => old.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete product.");
    }
  };

  return (
    <div>
      <div className="admin-page-heading admin-heading-row">
        <div>
          <p className="admin-eyebrow">YOUR CATALOG</p>
          <h1>Products</h1>
          <p>Manage your dress collection.</p>
        </div>
        <Link to="/admin/products" className="admin-primary-button">
          Product List
        </Link>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="admin-product-cell">
                      <img
                        src={
                          product.images?.[0] ||
                          product.image ||
                          "https://placehold.co/70x80?text=Dress"
                        }
                        alt={product.name || "Product"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://placehold.co/70x80?text=Dress";
                        }}
                      />
                      <div>
                        <strong>{product.name || "Unnamed Product"}</strong>
                        <small>{product.category?.name || "Dress"}</small>
                      </div>
                    </div>
                  </td>
                  <td>₹{Number(product.price || 0).toLocaleString("en-IN")}</td>
                  <td>
                    <span className="admin-status">
                      {product.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="admin-delete-button"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="admin-empty-cell">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;