
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../../index.css";

const categories = [
  {
    name: "Women",
    description: "Beautiful styles for every day",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Men",
    description: "Modern everyday essentials",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Accessories",
    description: "The perfect finishing touches",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Home & Living",
    description: "Thoughtful pieces for your home",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80",
  },
];

const benefits = [
  { icon: "♧", title: "Quality You Can Trust", text: "Beautiful products, made with care." },
  { icon: "♧", title: "Customer Support", text: "We're here whenever you need us." },
  { icon: "♡", title: "Loved by Customers", text: "Find styles you'll love to wear." },
  { icon: "♧", title: "Thoughtful Choices", text: "Shop your favourite styles." },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product");

        const data = response.data;
        const productList = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        setProducts(
          productList.filter(
            (product) => product.status !== "inactive"
          )
        );
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Products could not be loaded. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const latestProducts = [...products].reverse().slice(0, 5);

  const getImage = (product) => {
    if (product.image) return product.image;
    if (product.images?.length) return product.images[0];

    return "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80";
  };

  return (
    <main className="home-page">
      {/* Hero banner */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">NEW SEASON COLLECTION</span>

          <h1>
            Live Beautifully.
            <br />
            <em>Shop Effortlessly.</em>
          </h1>

          <p>
            Discover beautiful styles and quality you love,
            delivered right to your door.
          </p>

          <Link to="/products" className="primary-btn">
            Shop Now <span>→</span>
          </Link>

          <div className="hero-benefits">
            <div>
              <span className="benefit-icon">♧</span>
              <strong>Free Shipping</strong>
              <small>On orders over ₹1000</small>
            </div>

            <div>
              <span className="benefit-icon">♙</span>
              <strong>Secure Shopping</strong>
              <small>Shop with confidence</small>
            </div>

            <div>
              <span className="benefit-icon">↻</span>
              <strong>Easy Returns</strong>
              <small>Simple return process</small>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-circle"></div>
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85"
            alt="Elegant seasonal fashion collection"
          />

          <div className="hero-image-label">
            <span>THE NEW COLLECTION</span>
            <strong>Made for your moments.</strong>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section category-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR STYLE</span>
            <h2>Shop by Category</h2>
          </div>

          <Link to="/products" className="text-link">
            Browse all →
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              key={category.name}
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} loading="lazy" />
              </div>

              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sale banner */}
      <section className="sale-banner">
        <div className="sale-content">
          <span className="eyebrow">✧ LIMITED TIME OFFER</span>
          <h2>A Little Something Special</h2>
          <p>
            Discover your next favourite look with our
            selected seasonal styles.
          </p>
          <Link to="/products" className="sale-btn">
            Explore Collection <span>→</span>
          </Link>
        </div>

        <div className="sale-image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
            alt="Seasonal fashion collection"
            loading="lazy"
          />
          <div className="sale-sticker">
            <span>STYLE</span>
            <strong>SALE</strong>
            <span>IS ON</span>
          </div>
        </div>
      </section>

      {/* Latest products */}
      <section className="home-section arrivals-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FRESH FINDS</span>
            <h2>New Arrivals</h2>
            <p>Explore styles picked just for you.</p>
          </div>

          <Link to="/products" className="text-link">
            View all →
          </Link>
        </div>

        {loading ? (
          <p className="status-message">Loading beautiful styles...</p>
        ) : error ? (
          <div className="status-message error-message">
            <p>{error}</p>
            <button
              className="primary-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="empty-products">
            <h3>Our collection is coming soon!</h3>
            <p>Please check back for new arrivals.</p>
          </div>
        ) : (
          <div className="product-grid">
            {latestProducts.map((product) => (
              <Link
                to={`/products/${product._id}`}
                className="home-product-card"
                key={product._id}
              >
                <div className="home-product-image">
                  <img
                    src={getImage(product)}
                    alt={product.name}
                    loading="lazy"
                  />
                  <span className="product-tag">JUST IN</span>
                </div>

                <div className="home-product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="center-action">
          <Link to="/products" className="outline-btn">
            Discover All Products →
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-icon">✉</div>
        <div className="newsletter-content">
          <h2>Join the Dress Shop Circle</h2>
          <p>
            Be the first to discover new arrivals and
            exclusive offers.
          </p>
        </div>

        <form
          className="newsletter-form"
          onSubmit={(event) => {
            event.preventDefault();
            alert("Thank you for your interest!");
            event.currentTarget.reset();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            aria-label="Email address"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Store benefits */}
      <section className="store-benefits">
        {benefits.map((benefit) => (
          <div className="store-benefit" key={benefit.title}>
            <span className="store-benefit-icon">{benefit.icon}</span>
            <div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Home;
