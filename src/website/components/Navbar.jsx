

// import { Link, useLocation, useNavigate } from "react-router-dom";

// function Navbar() {
//   const token = localStorage.getItem("token");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isActive = (path) => location.pathname === path;

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login", { replace: true });
//   };

//   const navLinkClass = (path) =>
//     `relative whitespace-nowrap py-2 text-sm font-semibold transition-all duration-300
//     after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#D8C49A]
//     after:transition-all after:duration-300
//     ${
//       isActive(path)
//         ? "text-[#123F32] after:w-full"
//         : "text-[#68766C] after:w-0 hover:text-[#123F32] hover:after:w-full"
//     }`;

//   const iconClass =
//     "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#123F32] transition-all duration-300 hover:bg-[#E8EDE5] active:scale-95";

//   return (
//     <nav className="sticky top-0 z-50 border-b border-[#E8DFD2] bg-[#FFFDF9]/95 shadow-[0_4px_20px_rgba(18,63,50,0.05)] backdrop-blur-xl">

//       {/* Top Navbar */}
//       <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-4">

// {/* Brand */}
// <Link
//   to="/"
//   className="group flex shrink-0 items-center gap-2.5 no-underline"
// >
//   <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8C49A] bg-[#123F32] text-[27px] text-[#D8C49A] transition-transform duration-300 group-hover:rotate-12 sm:h-[50px] sm:w-[50px]">
//     M
//   </div>

//   <div className="flex flex-col">
//     <span className="font-serif text-xl font-semibold tracking-[0.18em] text-[#123F32] sm:text-2xl">
//       MODEZA
//     </span>

//     <span className="mt-0.5 text-[8px] font-medium tracking-[0.25em] text-[#9A815A] sm:text-[9px]">
//       FASHION HOUSE
//     </span>
//   </div>
// </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden items-center gap-5 lg:flex xl:gap-8">
//           <Link to="/" className={navLinkClass("/")}>
//             Home
//           </Link>

//           <Link to="/products" className={navLinkClass("/products")}>
//             Shop
//           </Link>

//           <Link to="/products" className={navLinkClass("/collections")}>
//             Collections
//           </Link>

//           <Link to="/products" className={navLinkClass("/new-arrivals")}>
//             New Arrivals
//           </Link>

//           <Link to="/products" className={navLinkClass("/deals")}>
//             Deals
//           </Link>
//         </div>

//         {/* Right Actions */}
//         <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">

//           {/* Search */}
//           <Link
//             to="/products"
//             className={iconClass}
//             aria-label="Search products"
//             title="Search"
//           >
//             <svg
//               className="h-5 w-5"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.7"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="10.8" cy="10.8" r="6.8" />
//               <path d="m16 16 5 5" />
//             </svg>
//           </Link>

//           {/* Account */}
//           <Link
//             to={token ? "/profile" : "/login"}
//             className={iconClass}
//             aria-label="My account"
//             title="My account"
//           >
//             <svg
//               className="h-5 w-5"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.7"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="12" cy="8" r="4" />
//               <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
//             </svg>
//           </Link>

//           {/* Cart */}
//           <Link
//             to="/cart"
//             className={iconClass}
//             aria-label="Shopping cart"
//             title="Shopping cart"
//           >
//             <svg
//               className="h-5 w-5"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.7"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" />
//               <circle cx="10" cy="21" r="1" />
//               <circle cx="18" cy="21" r="1" />
//             </svg>
//           </Link>

//           {/* Logout */}
//           {token && (
//             <button
//               type="button"
//               onClick={handleLogout}
//               className="ml-1 rounded-lg bg-[#123F32] px-3.5 py-2.5 text-xs font-semibold text-[#FFFDF9] transition-all duration-300 hover:bg-[#245B46] active:scale-95 sm:ml-2 sm:px-5 sm:text-sm"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <div className="flex items-center gap-7 overflow-x-auto border-t border-[#E8DFD2] bg-[#FAF7F0] px-5 py-3 lg:hidden">
//         <Link to="/" className={navLinkClass("/")}>
//           Home
//         </Link>

//         <Link to="/products" className={navLinkClass("/products")}>
//           Shop
//         </Link>

//         <Link to="/products" className={navLinkClass("/collections")}>
//           Collections
//         </Link>

//         <Link to="/products" className={navLinkClass("/new-arrivals")}>
//           New Arrivals
//         </Link>

//         <Link to="/products" className={navLinkClass("/deals")}>
//           Deals
//         </Link>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const section = new URLSearchParams(location.search).get("section");

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

    return (
      location.pathname === "/products" &&
      section === name
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const navLinkClass = (name) =>
    `relative whitespace-nowrap py-2 text-sm font-semibold transition-all duration-300
    after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#D8C49A]
    after:transition-all after:duration-300
    ${
      isActive(name)
        ? "text-[#123F32] after:w-full"
        : "text-[#68766C] after:w-0 hover:text-[#123F32] hover:after:w-full"
    }`;

  const iconClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#123F32] transition-all duration-300 hover:bg-[#E8EDE5] active:scale-95";

  const links = [
    { label: "Home", to: "/", name: "home" },
    { label: "Shop", to: "/products", name: "shop" },
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
    <nav className="sticky top-0 z-50 border-b border-[#E8DFD2] bg-[#FFFDF9]/95 shadow-[0_4px_20px_rgba(18,63,50,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-4">

        {/* Brand */}
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

        {/* Desktop Navigation */}
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

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">

          {/* Search */}
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

          {/* Account */}
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

          {/* Cart */}
          <Link
            to="/cart"
            className={iconClass}
            aria-label="Shopping cart"
            title="Shopping cart"
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
          </Link>

          {/* Logout */}
          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 rounded-lg bg-[#123F32] px-3.5 py-2.5 text-xs font-semibold text-[#FFFDF9] transition-all duration-300 hover:bg-[#245B46] active:scale-95 sm:ml-2 sm:px-5 sm:text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
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
      </div>
    </nav>
  );
}

export default Navbar;
