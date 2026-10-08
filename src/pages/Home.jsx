
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find Your
            <br />
            Perfect Dress
          </h1>

          <p>
            Discover beautiful, comfortable and stylish dresses
            made for every occasion.
          </p>

          <Link to="/products" className="shop-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <h2>Featured Products</h2>

        <p>
          Explore our latest collection of stylish dresses.
        </p>
      </section>
    </div>
  );
};

export default Home;
