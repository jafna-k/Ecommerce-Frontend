

import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "⌂" },
  { path: "/admin/products", label: "Products", icon: "◇" },
  { path: "/admin/category", label: "Categories", icon: "▤" },
  { path: "/admin/orders", label: "Orders", icon: "▧" },
  { path: "/admin/customers", label: "Customers", icon: "♙" },
  { path: "/admin/inventory", label: "Inventory", icon: "▦" },
  { path: "/admin/variants", label: "Product Variants", icon: "◈" },
  { path: "/admin/reports", label: "Reports", icon: "▥" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="relative flex min-h-screen w-full flex-col overflow-hidden border-r border-[#D8C49A]/25 bg-gradient-to-b from-[#164737] via-[#123F32] to-[#0B2D24] px-4 text-[#FFFDF9] shadow-xl lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-[278px] lg:overflow-y-auto">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D8C49A]/[0.07] blur-3xl" />

      {/* BRAND */}
      <NavLink
        to="/admin/dashboard"
        className="relative grid grid-cols-[54px_1fr] items-center gap-x-3 border-b border-white/10 px-1 pb-6 pt-7 no-underline"
      >
        <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#D8C49A] bg-white/[0.04] font-serif text-4xl text-[#E4D2AA] shadow-inner transition duration-300 hover:rotate-[-8deg] hover:bg-white/10">
          M
        </span>

        <span>
          <span className="block font-serif text-2xl font-semibold tracking-[0.13em] text-[#FFFDF9]">
            MODEZA
          </span>
          <span className="mt-1 block text-[9px] tracking-[0.23em] text-[#D8C49A]">
            FASHION HOUSE
          </span>
        </span>

        <span className="col-span-2 mt-4 rounded-lg border border-[#D8C49A]/25 bg-white/[0.035] px-3 py-2.5 text-center text-[9px] font-semibold tracking-[0.28em] text-[#E9DEC6]">
          ADMINISTRATION
        </span>
      </NavLink>

      {/* MENU TITLE */}
      <div className="mb-4 mt-7 flex items-center gap-3 px-1">
        <p className="shrink-0 text-[10px] font-bold tracking-[0.2em] text-[#A9C0B2]">
          WORKSPACE
        </p>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {/* NAVIGATION */}
      <nav className="relative flex flex-col gap-1.5">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin/dashboard"}
            className={({ isActive }) =>
              `group relative flex min-h-[49px] items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                isActive
                  ? "border-[#D8C49A] bg-[#FAF7F0] text-[#123F32] shadow-md shadow-black/10"
                  : "border-transparent text-[#E0E9E1] hover:translate-x-1 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl transition-colors ${
                    isActive
                      ? "bg-[#EDE7D8] text-[#123F32]"
                      : "bg-white/[0.07] text-[#D8C49A] group-hover:bg-white/10"
                  }`}
                >
                  {link.icon}
                </span>

                <span
                  className={`min-w-0 flex-1 truncate text-[13px] ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {link.label}
                </span>

                {isActive && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B99A60]" />
                )}

                <span
                  className={`text-xl transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isActive ? "text-[#123F32]" : "text-[#A9C0B2]"
                  }`}
                >
                  ›
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION */}
      <div className="relative mt-auto pt-7">

        {/* Visit Store */}
        <NavLink
          to="/"
          target="_blank"
          className="group mb-2 flex min-h-[46px] items-center gap-3 rounded-xl border border-[#D8C49A]/30 bg-[#FAF7F0] px-3.5 py-3 text-[#123F32] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
        >
          <span className="text-xl text-[#9B804B]">↗</span>
          <span className="flex-1 text-xs font-bold">Visit Store</span>
          <span className="text-lg transition-transform group-hover:translate-x-1">
            →
          </span>
        </NavLink>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="group flex min-h-[46px] w-full items-center gap-3 rounded-xl border border-white/10 bg-transparent px-3.5 py-3 text-left text-[#FFFDF9] transition-all duration-200 hover:border-[#E4A18F]/30 hover:bg-[#AF5343]/15 hover:text-[#F8DCD3] focus:outline-none focus:ring-2 focus:ring-[#D8C49A]/60"
        >
          <span className="text-xl text-[#D8C49A] transition-transform group-hover:translate-x-0.5">
            ⇥
          </span>
          <span className="flex-1 text-xs font-semibold">Logout</span>
          <span className="text-lg text-white/50 transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center border-t border-white/10 pb-4 pt-4">
          <span className="text-sm text-[#D8C49A]">✦</span>
          <p className="mt-2 text-[10px] font-semibold tracking-[0.15em] text-[#D5E1D8]">
            MODEZA © 2026
          </p>
          <p className="mt-1 text-[8px] tracking-[0.16em] text-[#8EAA9A]">
            ELEGANCE IN EVERY DETAIL
          </p>
        </div>
      </div>
    </aside>
  );
}
