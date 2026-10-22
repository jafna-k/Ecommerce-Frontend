


// import {
//   Outlet,
//   useLocation,
// } from "react-router-dom";

// import Sidebar from "./Sidebar";

// const menuItems = [
//   { label: "Dashboard", path: "/admin/dashboard" },
//   { label: "Products", path: "/admin/products" },
//   { label: "Categories", path: "/admin/category" },
//   { label: "Orders", path: "/admin/orders" },
//   { label: "Customers", path: "/admin/customers" },
//   { label: "Inventory", path: "/admin/inventory" },
//   { label: "Product Variants", path: "/admin/variants" },
//   { label: "Reports", path: "/admin/reports" },
// ];

// export default function DashboardLayout() {
//   const location = useLocation();

//   const currentPage =
//     menuItems.find(
//       (item) =>
//         location.pathname === item.path ||
//         location.pathname.startsWith(`${item.path}/`)
//     )?.label ||
//     (location.pathname.startsWith("/admin/orders/")
//       ? "Order Details"
//       : location.pathname.startsWith("/admin/products/")
//         ? "Products"
//         : location.pathname.startsWith("/admin/category/")
//           ? "Categories"
//           : "Dashboard");

//   return (
//     <div className="min-h-screen bg-[#FAF8F0] text-[#163D32]">

//       {/* SIDEBAR */}
//       <Sidebar />

//       {/* MAIN CONTENT */}
//       <main className="min-w-0 bg-[#FAF8F0] lg:ml-[278px]">

//         {/* TOPBAR */}
//         <header className="sticky top-0 z-30 flex min-h-[100px] items-center justify-between gap-3 border-b border-[#E5E2D8] bg-[#FAF8F0]/95 px-4 py-5 backdrop-blur-md sm:px-8 lg:px-10">

//           {/* PAGE TITLE */}
//           <div className="min-w-0">
//             <p className="text-[10px] font-semibold tracking-[0.22em] text-[#648276]">
//               MODEZA / ADMIN
//             </p>

//             <h1 className="mt-2 truncate font-serif text-2xl font-bold text-[#123F32] sm:text-3xl">
//               {currentPage}
//             </h1>

//             <p className="mt-1 hidden text-xs text-[#71847B] sm:block sm:text-sm">
//               Manage your fashion store
//             </p>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex shrink-0 items-center gap-2 sm:gap-5">

         

//             {/* ADMIN PROFILE */}
//             <div className="flex items-center gap-2 border-l border-[#DEDCCF] pl-2.5 sm:gap-3 sm:pl-5">

//               <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5E7DC] font-serif text-lg font-bold text-[#123F32] sm:h-11 sm:w-11 sm:text-xl">
//                 A
//               </span>

//               <div className="hidden sm:block">
//                 <p className="text-sm font-bold text-[#17251F]">
//                   Administrator
//                 </p>

//                 <p className="mt-1 text-xs text-[#718078]">
//                   Store Manager
//                 </p>
//               </div>

//             </div>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}
//         <section className="min-h-[calc(100vh-100px)] bg-[#FAF8F0] p-4 sm:p-6 lg:p-10">
//           <div className="mx-auto w-full max-w-[1600px]">
//             <Outlet />
//           </div>
//         </section>

//       </main>
//     </div>
//   );
// }



import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Products", path: "/admin/products" },
  { label: "Categories", path: "/admin/category" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Customers", path: "/admin/customers" },
  { label: "Inventory", path: "/admin/inventory" },
  { label: "Product Variants", path: "/admin/variants" },
  { label: "Reports", path: "/admin/reports" },
];

export default function DashboardLayout() {
  const location = useLocation();

  const currentPage =
    menuItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
    )?.label ||
    (location.pathname.startsWith("/admin/orders/")
      ? "Order Details"
      : location.pathname.startsWith("/admin/products/")
        ? "Products"
        : location.pathname.startsWith("/admin/category/")
          ? "Categories"
          : "Dashboard");

  return (
    <div className="min-h-screen bg-[#FAF8F0] text-[#163D32]">
      <Sidebar />

      <div className="min-w-0 lg:ml-[278px]">
        <header className="sticky top-0 z-30 flex min-h-[100px] items-center justify-between gap-4 border-b border-[#E5E2D8] bg-[#FAF8F0]/95 px-4 py-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#648276]">
              MODEZA / ADMIN
            </p>
            <h1 className="mt-2 truncate font-serif text-2xl font-bold text-[#123F32] sm:text-3xl">
              {currentPage}
            </h1>
            <p className="mt-1 hidden text-sm text-[#71847B] sm:block">
              Manage your fashion store
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 border-l border-[#DEDCCF] pl-3 sm:pl-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E3ECE5] font-serif text-lg font-bold text-[#123F32] sm:h-11 sm:w-11">
              A
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-[#17251F]">
                Administrator
              </p>
              <p className="mt-1 text-xs text-[#718078]">
                Store Manager
              </p>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-100px)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
