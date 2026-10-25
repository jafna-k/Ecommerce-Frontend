
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Update login status when route changes
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname, location.search]);

  // Fetch wishlist count
  useEffect(() => {
    let cancelled = false;

    const fetchWishlistCount = async () => {
      if (!localStorage.getItem("token")) {
        setWishlistCount(0);
        return;
      }

      try {
        const response = await api.get("/wishlist");

        if (cancelled) return;

        const data = response.data;

        const products = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.wishlist?.products)
          ? data.wishlist.products
          : Array.isArray(data?.wishlist)
          ? data.wishlist
          : [];

        setWishlistCount(products.length);
      } catch {
        if (!cancelled) {
          setWishlistCount(0);
        }
      }
    };

    fetchWishlistCount();

    return () => {
      cancelled = true;
    };
  }, [token, location.pathname, location.search]);

  // Fetch cart count
  useEffect(() => {
    let cancelled = false;

    const fetchCartCount = async () => {
      if (!localStorage.getItem("token")) {
        setCartCount(0);
        return;
      }

      try {
        const response = await api.get("/cart");

        if (cancelled) return;

        const data = response.data;

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.cart?.items)
          ? data.cart.items
          : Array.isArray(data?.cart?.products)
          ? data.cart.products
          : Array.isArray(data?.products)
          ? data.products
          : [];

        const totalQuantity = items.reduce((total, item) => {
          const quantity = Number(item.quantity ?? item.qty ?? 1);

          return (
            total +
            (Number.isFinite(quantity) && quantity > 0
              ? quantity
              : 0)
          );
        }, 0);

        setCartCount(totalQuantity);
      } catch {
        if (!cancelled) {
          setCartCount(0);
        }
      }
    };

    fetchCartCount();

    return () => {
      cancelled = true;
    };
  }, [token, location.pathname, location.search]);

  const section = new URLSearchParams(location.search).get("section");

  // Check active navigation item
  const isActive = (name) => {
    if (name === "home") {
      return location.pathname === "/";
    }

    if (name === "shop") {
      return location.pathname === "/products" && !section;
    }

    if (name === "collections") {
      return location.pathname === "/collections";
    }

    if (name === "wishlist") {
      return location.pathname === "/wishlist";
    }

    return (
      location.pathname === "/products" &&
      section === name
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setWishlistCount(0);
    setCartCount(0);
    setShowLogoutModal(false);

    navigate("/login", { replace: true });
  };

  // Navigation link styles
  const navLinkClass = (name) =>
    `relative whitespace-nowrap py-2 text-sm font-semibold transition-all duration-300
    after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#D8C49A]
    after:transition-all after:duration-300
    ${
      isActive(name)
        ? "text-[#123F32] after:w-full"
        : "text-[#68766C] after:w-0 hover:text-[#123F32] hover:after:w-full"
    }`;

  // Icon button styles
  const iconClass =
    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#123F32] transition-all duration-300 hover:bg-[#E8EDE5] active:scale-95";

  // Count badge styles
  const badgeClass =
    "absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-[#D8C49A] bg-[#123F32] px-1 text-[10px] font-bold text-[#FFFDF9] ring-2 ring-[#FFFDF9]";

  // Main navigation links
  const links = [
    {
      label: "Home",
      to: "/",
      name: "home",
    },
    {
      label: "Shop",
      to: "/products",
      name: "shop",
    },
    {
      label: "Collections",
      to: "/collections",
      name: "collections",
    },
    {
      label: "New Arrivals",
      to: "/products?section=new-arrivals",
      name: "new-arrivals",
    },
    {
      label: "Deals",
      to: "/products?section=deals",
      name: "deals",
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-[#E8DFD2] bg-[#FFFDF9]/95 shadow-[0_4px_20px_rgba(18,63,50,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-4">

          {/* BRAND */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 no-underline"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8C49A] bg-[#123F32] text-[27px] text-[#D8C49A] transition-transform duration-300 group-hover:rotate-12 sm:h-[50px] sm:w-[50px]">
              M
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-xl font-semibold tracking-[0.18em] text-[#123F32] sm:text-2xl">
                MODEZA
              </span>

              <span className="mt-0.5 text-[8px] font-medium tracking-[0.25em] text-[#9A815A] sm:text-[9px]">
                FASHION HOUSE
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-5 lg:flex xl:gap-8">
            {links.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={navLinkClass(item.name)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">

            {/* 1. SEARCH */}
            <Link
              to="/products"
              className={iconClass}
              aria-label="Search products"
              title="Shop products"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>
            </Link>

            {/* 2. PROFILE */}
            <Link
              to={token ? "/profile" : "/login"}
              className={iconClass}
              aria-label="My account"
              title="My account"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </Link>

            {/* 3. WISHLIST */}
            <Link
              to="/wishlist"
              className={iconClass}
              aria-label={`My wishlist, ${wishlistCount} items`}
              title="My Wishlist"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill={isActive("wishlist") ? "#123F32" : "none"}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>

              {wishlistCount > 0 && (
                <span className={badgeClass}>
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* 4. CART */}
            <Link
              to="/cart"
              className={iconClass}
              aria-label={`Shopping cart, ${cartCount} items`}
              title={`Shopping cart (${cartCount})`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" />
                <circle cx="10" cy="21" r="1" />
                <circle cx="18" cy="21" r="1" />
              </svg>

              {cartCount > 0 && (
                <span className={badgeClass}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* 5. LOGIN / LOGOUT */}
            {token ? (
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="ml-1 rounded-lg bg-[#123F32] px-3.5 py-2.5 text-xs font-semibold text-[#FFFDF9] transition-all duration-300 hover:bg-[#245B46] active:scale-95 sm:ml-2 sm:px-5 sm:text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-1 rounded-lg bg-[#123F32] px-3.5 py-2.5 text-xs font-semibold text-[#FFFDF9] no-underline transition-all duration-300 hover:bg-[#245B46] active:scale-95 sm:ml-2 sm:px-5 sm:text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="flex items-center gap-7 overflow-x-auto border-t border-[#E8DFD2] bg-[#FAF7F0] px-5 py-3 lg:hidden">
          {links.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={navLinkClass(item.name)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/wishlist"
            className={navLinkClass("wishlist")}
          >
            Wishlist

            {wishlistCount > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full border border-[#D8C49A] bg-[#123F32] px-1.5 py-0.5 text-[10px] font-bold text-[#FFFDF9]">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#123F32]/40 px-4 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl border border-[#E8DFD2] bg-[#FFFDF9] p-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8EDE5] text-[#123F32]">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
              </svg>
            </div>

            <h2
              id="logout-title"
              className="font-serif text-2xl font-semibold text-[#123F32]"
            >
              Logout?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#68766C]">
              Are you sure you want to log out of your MODEZA account?
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-lg border border-[#D8CFC0] bg-[#FAF7F0] px-4 py-3 text-sm font-semibold text-[#123F32] transition hover:bg-[#F0EADF] active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-[#123F32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245B46] active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
