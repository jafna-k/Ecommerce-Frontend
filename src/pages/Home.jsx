import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <p className="hero-small">WELCOME TO DRESS SHOP</p>

          <h1>
            Find Your
            <br />
            Perfect Dress
          </h1>

          <p className="hero-description">
            Discover beautiful, comfortable and stylish dresses
            made for every occasion.
          </p>

          <Link to="/products" className="shop-btn">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Products</h2>

        <p>
          Explore our latest collection of stylish dresses.
        </p>
      </section>
    </>
  );
}

export default Home;