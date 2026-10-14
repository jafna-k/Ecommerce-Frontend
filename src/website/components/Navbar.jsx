
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
     

      <nav className="navbar">
        <Link to="/" className="logo">
          <span className="logo-icon">✿</span>
          <span>DRESS<span className="logo-accent"> SHOP</span></span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/products" className={isActive("/products")}>Shop</Link>
          <Link to="/products" className="nav-optional">Collections</Link>
          <Link to="/products" className="nav-optional">New Arrivals</Link>
          <Link to="/products" className="nav-optional">Deals</Link>
        </div>

        <div className="nav-actions">
          <Link to="/products" className="nav-icon" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </Link>

          {token ? (
            <>
              <Link to="/profile" className="nav-icon" aria-label="My account">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </Link>

              <button
                className="logout-btn"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-icon" aria-label="Login">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </Link>
          )}

          <Link to="/cart" className="nav-icon cart-icon" aria-label="Cart">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="10" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
