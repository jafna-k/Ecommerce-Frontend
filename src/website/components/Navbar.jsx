

import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `whitespace-nowrap py-2 text-sm font-medium transition ${
      isActive(path)
        ? "text-[#124536]"
        : "text-[#5e665d] hover:text-[#124536]"
    }`;

  const iconClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#244a3c] transition hover:bg-[#e8efe7] hover:text-[#0b3428]";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e8dfd2] bg-[#fffdf9]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-[#123f32]"
        >
          <span className="text-3xl leading-none text-[#b58b56]">✿</span>

          <span className="text-lg font-extrabold tracking-[0.12em] sm:text-xl">
            DRESS
            <span className="font-medium text-[#8a9b83]"> SHOP</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link to="/products" className={navLinkClass("/products")}>
            Shop
          </Link>

          <Link to="/products" className={navLinkClass("/collections")}>
            Collections
          </Link>

          <Link to="/products" className={navLinkClass("/new-arrivals")}>
            New Arrivals
          </Link>

          <Link to="/products" className={navLinkClass("/deals")}>
            Deals
          </Link>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Search */}
          <Link
            to="/products"
            className={iconClass}
            aria-label="Search products"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </Link>

          {/* Account / Login */}
          {token ? (
            <Link
              to="/profile"
              className={iconClass}
              aria-label="My account"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </Link>
          ) : (
            <Link
              to="/login"
              className={iconClass}
              aria-label="Login"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className={iconClass}
            aria-label="Shopping cart"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="10" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
          </Link>

          {/* Logout */}
          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 rounded-full border border-[#124536] px-3 py-2 text-xs font-semibold text-[#124536] transition hover:bg-[#124536] hover:text-white sm:ml-2 sm:px-5 sm:text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex items-center justify-center gap-6 overflow-x-auto border-t border-[#eee7dc] px-4 py-2.5 lg:hidden">
        <Link to="/" className={navLinkClass("/")}>
          Home
        </Link>

        <Link to="/products" className={navLinkClass("/products")}>
          Shop
        </Link>

        <Link to="/products" className={navLinkClass("/collections")}>
          Collections
        </Link>

        <Link to="/products" className={navLinkClass("/new-arrivals")}>
          New Arrivals
        </Link>

        <Link to="/products" className={navLinkClass("/deals")}>
          Deals
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
