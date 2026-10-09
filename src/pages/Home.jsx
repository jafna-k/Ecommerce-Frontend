
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get("/product"),
          api.get("/category"),
        ]);

        const productData = productRes.data;
        const categoryData = categoryRes.data;

        setProducts(
          Array.isArray(productData)
            ? productData
            : productData.products || []
        );

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.categories || []
        );
      } catch (err) {
        console.error("Home page API error:", err);
        setError("Unable to load products. Check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">NEW COLLECTION 2026</p>

          <h1>
            Find Your
            <br />
            Perfect Style
          </h1>

          <p>
            Discover beautiful dresses for every moment.
            Refresh your wardrobe with DressHub.
          </p>

          <Link to="/products" className="hero-button">
            Shop Now →
          </Link>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85"
            alt="Fashion collection"
          />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE</p>
            <h2>Shop by Category</h2>
          </div>

          <Link to="/products">View All →</Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="category-card"
            >
              <h3>{category.name}</h3>
              <span>Explore Collection →</span>
            </Link>
          ))}

          {!loading && categories.length === 0 && (
            <p>No categories available yet.</p>
          )}
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HANDPICKED FOR YOU</p>
            <h2>Featured Dresses</h2>
          </div>

          <Link to="/products">Shop All →</Link>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>{error}</p>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p>No products available yet.</p>
        )}
      </section>

      <section className="promo-banner">
        <p>YOUR STYLE, YOUR STORY</p>
        <h2>Discover Something Beautiful</h2>
        <Link to="/products" className="hero-button">
          Explore Dresses
        </Link>
      </section>
    </>
  );
}

export default Home;
