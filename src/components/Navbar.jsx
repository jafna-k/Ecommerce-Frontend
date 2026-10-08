import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          DRESS SHOP
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/cart">
            Cart 🛒
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin/dashboard">
              Dashboard
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="welcome">
                Hi, {user.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;