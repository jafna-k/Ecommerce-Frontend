
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const links = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "▦" },
    { path: "/admin/products", label: "Products", icon: "♧" },
    { path: "/admin/category", label: "Categories", icon: "▤" },
    { path: "/admin/orders", label: "Orders", icon: "▤" },
    { path: "/admin/inventory", label: "Inventory", icon: "▣" },
    { path: "/admin/variants", label: "Product Variants",icon: "♧",}
  ];

  
  return (
    <aside className="flex min-h-screen w-full flex-col bg-[#092f27] px-4 py-6 text-white sm:px-6 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:px-5">
      {/* Brand */}
      <NavLink
        to="/admin/dashboard"
        className="flex items-center gap-3 border-b border-white/10 px-2 pb-7"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8d8b5] font-serif text-3xl text-[#123f32]">
          ✿
        </span>

        <div>
          <h2 className="font-serif text-lg font-bold tracking-[0.12em]">
            DRESS SHOP
          </h2>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.25em] text-[#b8cfc2]">
            ADMIN PANEL
          </p>
        </div>
      </NavLink>

      {/* Menu Heading */}
      <div className="mb-4 mt-8 flex items-center gap-3 px-2">
        <p className="shrink-0 text-[11px] font-bold tracking-[0.2em] text-[#b8cfc2]">
          MAIN MENU
        </p>
        <div className="h-px flex-1 bg-white/20" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin/dashboard"}
            className={({ isActive }) =>
              `group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                isActive
                  ? "bg-white/15 text-white shadow-sm ring-1 ring-white/10"
                  : "text-[#d6e4dc] hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl ${
                    isActive
                      ? "bg-[#d9e7dc] text-[#123f32]"
                      : "text-[#c6ddce] group-hover:bg-white/10"
                  }`}
                >
                  {link.icon}
                </span>

                <span className="flex-1 text-sm font-semibold">
                  {link.label}
                </span>

                <span className="text-xl opacity-70 transition-transform group-hover:translate-x-1">
                  ›
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-white/15 pt-5">
        <NavLink
          to="/"
          className="group flex items-center gap-4 rounded-xl px-4 py-3.5 text-[#d6e4dc] transition hover:bg-white/10 hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center text-2xl text-[#c6ddce]">
            ↗
          </span>

          <span className="flex-1 text-sm font-semibold">
            Visit Store
          </span>

          <span className="text-xl opacity-70">›</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="group mt-2 flex w-full items-center gap-4 rounded-xl bg-white/10 px-4 py-3.5 text-left text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#e8d8b5]"
        >
          <span className="flex h-9 w-9 items-center justify-center text-2xl">
            ⇥
          </span>

          <span className="flex-1 text-sm font-semibold">
            Logout
          </span>

          <span className="text-xl opacity-70">›</span>
        </button>

        <div className="mt-7 flex items-center gap-3 px-1">
          <div className="h-px flex-1 bg-white/20" />
          <p className="whitespace-nowrap text-[10px] font-medium tracking-[0.12em] text-[#b8cfc2]">
            DRESS SHOP © 2026
          </p>
          <div className="h-px flex-1 bg-white/20" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
