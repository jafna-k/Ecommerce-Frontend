
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../../index.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All");
  const [sort, setSort] = useState("latest");

  // Fetch products from backend
  
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

const response = await api.get("/product");

console.log("API DATA:", response.data);

const list = Array.isArray(response.data)
  ? response.data
  : response.data?.products ||
    response.data?.data ||
    [];

console.log("TOTAL PRODUCTS:", list.length);

setProducts(list);

      // Temporarily show all products returned by the API
      setProducts(list);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


  // Product image
  const getImage = (product) => {
    if (product.image) return product.image;

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    return "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80";
  };

  // Product variants: available only when API returns them
  const getVariants = (product) => {
    return product.variants || product.productVariants || [];
  };

  // Search, price, size, color and sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const productName = String(product.name || "").toLowerCase();

      const matchesSearch = productName.includes(
        search.trim().toLowerCase()
      );

      const price = Number(product.price);
   
const matchesPrice =
  product.price == null ||
  (Number.isFinite(Number(product.price)) &&
    Number(product.price) <= maxPrice);

      const variants = getVariants(product);

      const matchesSize =
        size === "All" ||
        variants.some(
          (variant) =>
            String(variant.size || "").toLowerCase() ===
            size.toLowerCase()
        );

      const matchesColor =
        color === "All" ||
        variants.some(
          (variant) =>
            String(variant.color || "").toLowerCase() ===
            color.toLowerCase()
        );

      return (
        matchesSearch &&
        matchesPrice &&
        matchesSize &&
        matchesColor
      );
    });

    if (sort === "price-low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    } else if (sort === "price-high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    } else {
      // Newest products first, when createdAt is available
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [products, search, maxPrice, size, color, sort]);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setMaxPrice(10000);
    setSize("All");
    setColor("All");
    setSort("latest");
  };

  return (
    <main className="listing-page">
      {/* Page banner */}
      <section className="listing-hero">
        <span className="eyebrow">
          THE DRESS SHOP COLLECTION
        </span>

        <h1>Find Your Perfect Style</h1>

        <p>
          Timeless pieces, lovely details, and styles made for you.
        </p>

        <div className="listing-breadcrumb">
          <Link to="/">Home</Link> / Shop
        </div>
      </section>

      <section className="listing-content">
        {/* Heading */}
        <div className="listing-heading">
          <span className="eyebrow">CURATED FOR YOU</span>
          <h2>Our Collection</h2>
          
          <p>
            {loading
              ? "Loading products..."
              : `${filteredProducts.length} products found`}
          </p>
        </div>

        {/* Search and sorting */}
        <div className="listing-toolbar">
          <div className="search-box">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              placeholder="Search dresses..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />
          </div>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort products"
          >
            <option value="latest">Latest products</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        <div className="listing-layout">
          {/* Filters */}
          <aside className="product-filters">
            <div className="filter-title">
              <h3>Filters</h3>

              <button type="button" onClick={resetFilters}>
                Reset
              </button>
            </div>

            {/* Price filter */}
            <div className="filter-group">
              <h4>Maximum Price</h4>

              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(Number(event.target.value))
                }
                aria-label="Maximum price"
              />

              <div className="price-range">
                <span>₹0</span>
                <strong>
                  ₹{maxPrice.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {/* Size filter */}
            <div className="filter-group">
              <h4>Size</h4>

              <div className="size-options">
                {["All", "S", "M", "L", "XL", "XXL"].map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      className={size === item ? "selected" : ""}
                      onClick={() => setSize(item)}
                      aria-pressed={size === item}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Color filter */}
            <div className="filter-group">
              <h4>Color</h4>

              <select
                value={color}
                onChange={(event) => setColor(event.target.value)}
                aria-label="Filter by color"
              >
                <option value="All">All colors</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Pink">Pink</option>
                <option value="Red">Red</option>
              </select>
            </div>
          </aside>

          {/* Product results */}
          <div className="listing-results">
            {loading ? (
              <p className="status-message">
                Loading products...
              </p>
            ) : error ? (
              <div className="empty-products">
                <h3>Something went wrong</h3>
                <p>{error}</p>

                <button
                  type="button"
                  className="retry-button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-products">
                <h3>No matching products</h3>
                <p>
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  className="retry-button"
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="product-grid listing-product-grid">
                {filteredProducts.map((product) => (
                  <Link
                    to={`/products/${product._id}`}
                    className="home-product-card"
                    key={product._id}
                  >
                    <div className="home-product-image">
                      <img
                        src={getImage(product)}
                        alt={product.name || "Dress"}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80";
                        }}
                      />

                      <span className="product-tag">
                        COLLECTION
                      </span>
                    </div>

                    <div className="home-product-info">
                      <h3>{product.name || "Unnamed Product"}</h3>

                      <p className="product-price">
                        {product.price != null &&
                        Number.isFinite(Number(product.price))
                          ? `₹${Number(product.price).toLocaleString("en-IN")}`
                          : "Price unavailable"}
                      </p>

                      <span className="view-product">
                        View Product →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Products;
