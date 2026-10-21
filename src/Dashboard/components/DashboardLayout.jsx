
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "▦" },
  { label: "Products", path: "/admin/products", icon: "♧" },
  { label: "Categories", path: "/admin/category", icon: "▤" },
  { label: "Orders", path: "/admin/orders", icon: "▤" },
  { label: "Customers", path: "/admin/customers", icon: "♙" },
  { label: "Inventory", path: "/admin/inventory", icon: "▣" },
  { label: "Product Variants",path: "/admin/variants",icon: "♧",}
];

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage =
    menuItems.find((item) => item.path === location.pathname)?.label ||
    (location.pathname.startsWith("/admin/orders/")
      ? "Order Details"
      : location.pathname.startsWith("/admin/category/")
      ? "Categories"
      : "Dashboard");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#24352e]">
      {/* Sidebar */}
      <aside className="z-30 flex w-full flex-col bg-[#123f32] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:overflow-y-auto">
        {/* Brand */}
        <div className="border-b border-white/10 px-6 py-6">
          <NavLink
            to="/admin/dashboard"
            className="inline-flex items-center gap-3"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 font-serif text-3xl text-[#e6d7b9]">
              ✿
            </span>

            <span className="font-serif text-xl font-bold leading-5 tracking-[0.16em]">
              DRESS
              <br />
              SHOP
            </span>
          </NavLink>

          <p className="ml-[60px] mt-2 text-[10px] font-semibold tracking-[0.25em] text-[#d2dfd5]">
            ADMIN PANEL
          </p>
        </div>

        {/* Menu */}
        <div className="px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-bold tracking-[0.22em] text-[#b5c8bb]">
            MAIN MENU
          </p>

          <nav className="flex flex-col gap-2 sm:grid sm:grid-cols-3 lg:flex lg:grid-cols-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin/dashboard"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition duration-200 ${
                    isActive
                      ? "bg-[#f5f0e5] text-[#123f32] shadow-sm"
                      : "text-[#e0e9e2] hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg ${
                        isActive
                          ? "bg-[#e5eadd]"
                          : "bg-white/10"
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span className="flex-1 truncate">{item.label}</span>

                    <span className="hidden text-lg opacity-60 lg:inline">
                      ›
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-white/10 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#e0e9e2] transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-lg">↗</span>
            Visit Store
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#f0d6cb] transition hover:bg-red-400/10 hover:text-white"
          >
            <span className="text-xl">⇥</span>
            Logout
          </button>

          <p className="mt-4 px-4 text-[10px] text-[#b5c8bb]">
            DRESS SHOP © 2026
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex min-h-24 items-center justify-between gap-4 border-b border-[#e8dfd2] bg-[#fffdf9]/95 px-5 py-5 backdrop-blur sm:px-8 lg:px-10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#81796d]">
              DRESS SHOP / ADMIN
            </p>

            <h1 className="mt-2 font-serif text-2xl font-bold text-[#123f32] sm:text-3xl">
              {currentPage}
            </h1>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#ded6ca] bg-white px-3 py-2.5 text-xs font-semibold text-[#124536] transition hover:border-[#124536] hover:bg-[#f4f1e9] sm:px-4 sm:text-sm"
          >
            <span>Visit Store</span>
            <span>↗</span>
          </a>
        </header>

        {/* Page Content */}
        <section className="p-4 sm:p-6 lg:p-10">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
