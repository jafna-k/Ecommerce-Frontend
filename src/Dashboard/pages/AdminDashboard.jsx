
// import { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";

// function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalCustomers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     totalSales: 0,
//     lowStockItems: 0,
//   });

//   const [orders, setOrders] = useState([]);
//   const [allOrders, setAllOrders] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadDashboard = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const [statsResult, ordersResult] = await Promise.allSettled([
//         api.get("/admin/dashboard"),
//         api.get("/admin/orders"),
//       ]);

//       if (statsResult.status === "rejected") {
//         const err = statsResult.reason;
//         const status = err.response?.status;

//         if (status === 401) {
//           setError("Login expired. Please login again.");
//         } else if (status === 403) {
//           setError(
//             "Admin access required. Login with an admin account."
//           );
//         } else {
//           setError(
//             err.response?.data?.message ||
//               "Unable to load dashboard statistics."
//           );
//         }

//         setAllOrders([]);
//         setOrders([]);
//         return;
//       }

//       const responseData = statsResult.value.data;
//       const data = responseData.data || responseData;

//       setStats({
//         totalCustomers: data.totalCustomers ?? 0,
//         totalProducts: data.totalProducts ?? 0,
//         totalOrders: data.totalOrders ?? 0,
//         totalSales: data.totalSales ?? 0,
//         lowStockItems: data.lowStockItems ?? 0,
//       });

//       if (ordersResult.status === "fulfilled") {
//         const orderData = ordersResult.value.data;

//         const list = Array.isArray(orderData)
//           ? orderData
//           : Array.isArray(orderData.data)
//           ? orderData.data
//           : Array.isArray(orderData.orders)
//           ? orderData.orders
//           : Array.isArray(orderData.data?.orders)
//           ? orderData.data.orders
//           : [];

//         setAllOrders(list);
//         setOrders(list.slice(0, 5));
//       } else {
//         setAllOrders([]);
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error("Dashboard error:", err);
//       setError("Something went wrong while loading dashboard.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadDashboard();
//   }, [loadDashboard]);

//   const filteredOrders = allOrders.filter((order) => {
//     const orderDate = order.createdAt
//       ? new Date(order.createdAt).toISOString().slice(0, 10)
//       : "";

//     if (!orderDate) return false;
//     if (fromDate && orderDate < fromDate) return false;
//     if (toDate && orderDate > toDate) return false;

//     return true;
//   });

//   const reportSales = filteredOrders.reduce((total, order) => {
//     if (order.status === "Cancelled") return total;

//     return (
//       total +
//       Number(
//         order.totalAmount ??
//           order.total ??
//           order.grandTotal ??
//           0
//       )
//     );
//   }, 0);

//   const reportOrderCount = filteredOrders.length;

//   const cancelledOrders = filteredOrders.filter(
//     (order) => order.status === "Cancelled"
//   ).length;

//   const cards = [
//     {
//       title: "Total Customers",
//       value: stats.totalCustomers,
//       icon: "♙",
//       description: "Registered customers",
//       iconBg: "bg-[#e5ece3]",
//     },
//     {
//       title: "Total Products",
//       value: stats.totalProducts,
//       icon: "♧",
//       description: "Products in your store",
//       iconBg: "bg-[#f0e8d8]",
//     },
//     {
//       title: "Total Orders",
//       value: stats.totalOrders,
//       icon: "▤",
//       description: "Orders received",
//       iconBg: "bg-[#e8e6f1]",
//     },
//     {
//       title: "Total Sales",
//       value: `₹${Number(stats.totalSales).toLocaleString("en-IN")}`,
//       icon: "₹",
//       description: "Excluding cancelled orders",
//       iconBg: "bg-[#f4e4df]",
//     },
//   ];

//   function getOrderAmount(order) {
//     return Number(
//       order.totalAmount ??
//         order.total ??
//         order.grandTotal ??
//         0
//     );
//   }

//   function getCustomerName(order) {
//     return (
//       order.user?.name ||
//       order.customer?.name ||
//       order.shippingAddress?.fullName ||
//       "Customer"
//     );
//   }

//   function getStatusStyle(status) {
//     const value = (status || "Pending").toLowerCase();

//     if (value === "delivered") {
//       return "bg-green-100 text-green-800";
//     }

//     if (value === "cancelled") {
//       return "bg-red-100 text-red-700";
//     }

//     if (value === "shipped") {
//       return "bg-blue-100 text-blue-800";
//     }

//     if (value === "confirmed" || value === "packed") {
//       return "bg-amber-100 text-amber-800";
//     }

//     return "bg-[#f0e8d8] text-[#725d36]";
//   }

//   function formatDate(date) {
//     if (!date || Number.isNaN(new Date(date).getTime())) {
//       return "—";
//     }

//     return new Date(date).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   }

//   function formatOrderId(id) {
//     return `#${String(id || "").slice(-6).toUpperCase()}`;
//   }

//   return (
//     <main className="min-w-0 space-y-8">

//       {/* Dashboard Header */}
//       <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <p className="text-[10px] font-bold tracking-[0.22em] text-[#81796d]">
//             STORE PERFORMANCE
//           </p>

//           <h1 className="mt-2 font-serif text-3xl font-bold text-[#123f32] sm:text-4xl">
//             Dashboard Overview
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-[#6b7169]">
//             Welcome back! Here's what's happening in your store.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={loadDashboard}
//           disabled={loading}
//           className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#124536] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3428] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
//         >
//           <span className="text-lg">↻</span>
//           {loading ? "Loading..." : "Refresh"}
//         </button>
//       </header>

//       {/* Error Message */}
//       {error && (
//         <div
//           role="alert"
//           className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center"
//         >
//           <div>
//             <h2 className="font-semibold text-red-800">
//               Dashboard could not load
//             </h2>
//             <p className="mt-1 text-sm text-red-700">{error}</p>
//           </div>

//           <button
//             type="button"
//             onClick={loadDashboard}
//             className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Statistics Cards */}
//       <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         {cards.map((card) => (
//           <article
//             key={card.title}
//             className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6"
//           >
//             <div className="flex items-center justify-between gap-3">
//               <p className="text-sm font-medium text-[#6b7169]">
//                 {card.title}
//               </p>

//               <span
//                 className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-semibold text-[#124536] ${card.iconBg}`}
//               >
//                 {card.icon}
//               </span>
//             </div>

//             <h2 className="mt-5 break-words text-3xl font-bold tracking-tight text-[#123f32]">
//               {loading ? "—" : card.value}
//             </h2>

//             <p className="mt-2 text-xs text-[#81796d]">
//               {card.description}
//             </p>
//           </article>
//         ))}
//       </section>

//       {/* Inventory Alert */}
//       <section className="flex flex-col gap-5 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
//         <div className="flex items-start gap-4">
//           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl text-amber-700">
//             !
//           </div>

//           <div>
//             <h2 className="font-serif text-xl font-bold text-[#123f32]">
//               Inventory Alert
//             </h2>
//             <p className="mt-1 text-sm text-[#81796d]">
//               Products that may need restocking.
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-4">
//           <div className="rounded-xl bg-[#faf7f0] px-5 py-3">
//             <p className="text-xs text-[#81796d]">Low Stock Items</p>
//             <p className="mt-1 text-2xl font-bold text-[#123f32]">
//               {loading ? "—" : stats.lowStockItems}
//             </p>
//           </div>

//           <Link
//             to="/admin/inventory"
//             className="rounded-xl bg-[#124536] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3428]"
//           >
//             Manage Inventory →
//           </Link>
//         </div>
//       </section>

//       {/* Sales and Order Report */}
//       <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">

//         <div className="border-b border-[#e8dfd2] p-5 sm:p-7">
//           <p className="text-[10px] font-bold tracking-[0.2em] text-[#81796d]">
//             BUSINESS ANALYTICS
//           </p>

//           <h2 className="mt-2 font-serif text-2xl font-bold text-[#123f32]">
//             Sales &amp; Order Report
//           </h2>

//           <p className="mt-2 text-sm text-[#6b7169]">
//             Select a date range to review your store performance.
//           </p>

//           {/* Date Filters */}
//           <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
//             <label className="block text-sm font-semibold text-[#24352e]">
//               From Date
//               <input
//                 type="date"
//                 value={fromDate}
//                 max={toDate || undefined}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="mt-2 w-full rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm font-normal text-[#24352e] outline-none focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10"
//               />
//             </label>

//             <label className="block text-sm font-semibold text-[#24352e]">
//               To Date
//               <input
//                 type="date"
//                 value={toDate}
//                 min={fromDate || undefined}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="mt-2 w-full rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm font-normal text-[#24352e] outline-none focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10"
//               />
//             </label>

//             <button
//               type="button"
//               onClick={() => {
//                 setFromDate("");
//                 setToDate("");
//               }}
//               className="rounded-xl border border-[#ded6ca] bg-white px-5 py-3 text-sm font-semibold text-[#124536] transition hover:border-[#124536] hover:bg-[#f4f1e9]"
//             >
//               Reset Filter
//             </button>
//           </div>
//         </div>

//         {/* Report Summary Cards */}
//         <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-7">
//           <article className="rounded-xl bg-[#f5f1e8] p-5">
//             <p className="text-sm font-medium text-[#6b7169]">
//               Total Orders
//             </p>
//             <strong className="mt-3 block text-2xl font-bold text-[#123f32]">
//               {loading ? "—" : reportOrderCount}
//             </strong>
//           </article>

//           <article className="rounded-xl bg-[#e5ece3] p-5">
//             <p className="text-sm font-medium text-[#456353]">
//               Total Sales
//             </p>
//             <strong className="mt-3 block break-words text-2xl font-bold text-[#123f32]">
//               {loading
//                 ? "—"
//                 : `₹${reportSales.toLocaleString("en-IN")}`}
//             </strong>
//           </article>

//           <article className="rounded-xl bg-[#f4e4df] p-5">
//             <p className="text-sm font-medium text-[#81584e]">
//               Cancelled Orders
//             </p>
//             <strong className="mt-3 block text-2xl font-bold text-[#7f3428]">
//               {loading ? "—" : cancelledOrders}
//             </strong>
//           </article>
//         </div>

//         {/* Report Table */}
//         <div className="px-5 pb-5 sm:px-7 sm:pb-7">
//           <div className="mb-4">
//             <h3 className="font-serif text-lg font-bold text-[#123f32]">
//               Order Report Details
//             </h3>
//           </div>

//           <div className="overflow-x-auto rounded-xl border border-[#e8dfd2]">
//             <table className="w-full min-w-[680px] text-left">
//               <thead className="bg-[#f5f1e8]">
//                 <tr>
//                   {["Order ID", "Date", "Customer", "Amount", "Status"].map(
//                     (heading) => (
//                       <th
//                         key={heading}
//                         className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]"
//                       >
//                         {heading}
//                       </th>
//                     )
//                   )}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#eee7dc]">
//                 {loading ? (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-5 py-10 text-center text-sm text-[#81796d]"
//                     >
//                       Loading report...
//                     </td>
//                   </tr>
//                 ) : filteredOrders.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-5 py-10 text-center text-sm text-[#81796d]"
//                     >
//                       No orders found for the selected dates.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredOrders.map((order) => (
//                     <tr
//                       key={order._id}
//                       className="transition hover:bg-[#faf7f0]"
//                     >
//                       <td className="px-5 py-4 text-sm font-semibold text-[#124536]">
//                         {formatOrderId(order._id)}
//                       </td>

//                       <td className="whitespace-nowrap px-5 py-4 text-sm text-[#6b7169]">
//                         {formatDate(order.createdAt)}
//                       </td>

//                       <td className="px-5 py-4 text-sm font-medium text-[#24352e]">
//                         {getCustomerName(order)}
//                       </td>

//                       <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#123f32]">
//                         ₹{getOrderAmount(order).toLocaleString("en-IN")}
//                       </td>

//                       <td className="px-5 py-4">
//                         <span
//                           className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(order.status)}`}
//                         >
//                           {order.status || "Pending"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//       {/* Recent Orders */}
//       <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
//         <div className="flex flex-col justify-between gap-3 border-b border-[#e8dfd2] p-5 sm:flex-row sm:items-center sm:p-6">
//           <div>
//             <h2 className="font-serif text-xl font-bold text-[#123f32]">
//               Recent Orders
//             </h2>
//             <p className="mt-1 text-sm text-[#81796d]">
//               Review the latest orders from your customers.
//             </p>
//           </div>

//           <Link
//             to="/admin/orders"
//             className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#124536] transition hover:text-[#0b3428] hover:underline hover:underline-offset-4"
//           >
//             View All Orders →
//           </Link>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[560px] text-left">
//             <thead className="bg-[#f5f1e8]">
//               <tr>
//                 {["Order ID", "Customer", "Amount", "Status"].map(
//                   (heading) => (
//                     <th
//                       key={heading}
//                       className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]"
//                     >
//                       {heading}
//                     </th>
//                   )
//                 )}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-[#eee7dc]">
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="px-5 py-10 text-center text-sm text-[#81796d]"
//                   >
//                     Loading orders...
//                   </td>
//                 </tr>
//               ) : orders.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="px-5 py-10 text-center text-sm text-[#81796d]"
//                   >
//                     No recent orders available.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order) => (
//                   <tr
//                     key={order._id}
//                     className="transition hover:bg-[#faf7f0]"
//                   >
//                     <td className="px-5 py-4 text-sm font-semibold text-[#124536]">
//                       {formatOrderId(order._id)}
//                     </td>

//                     <td className="px-5 py-4 text-sm font-medium text-[#24352e]">
//                       {getCustomerName(order)}
//                     </td>

//                     <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#123f32]">
//                       ₹{getOrderAmount(order).toLocaleString("en-IN")}
//                     </td>

//                     <td className="px-5 py-4">
//                       <span
//                         className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(order.status)}`}
//                       >
//                         {order.status || "Pending"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Quick Management */}
//       <section>
//         <div className="mb-5">
//           <h2 className="font-serif text-2xl font-bold text-[#123f32]">
//             Quick Management
//           </h2>
//           <p className="mt-2 text-sm text-[#6b7169]">
//             Manage your dress collection, customer orders, and store inventory.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           <Link
//             to="/admin/products"
//             className="group rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#b5c8bb] hover:shadow-md"
//           >
//             <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5ece3] text-2xl text-[#124536]">
//               ♧
//             </span>

//             <h3 className="mt-5 font-serif text-lg font-bold text-[#123f32]">
//               Manage Products
//             </h3>

//             <p className="mt-2 text-sm text-[#81796d]">
//               Add or update dresses.
//             </p>

//             <span className="mt-5 inline-block text-sm font-bold text-[#124536] transition group-hover:translate-x-1">
//               Open Products →
//             </span>
//           </Link>

//           <Link
//             to="/admin/orders"
//             className="group rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#b5c8bb] hover:shadow-md"
//           >
//             <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0e8d8] text-2xl text-[#725d36]">
//               ▤
//             </span>

//             <h3 className="mt-5 font-serif text-lg font-bold text-[#123f32]">
//               Manage Orders
//             </h3>

//             <p className="mt-2 text-sm text-[#81796d]">
//               Review and update customer orders.
//             </p>

//             <span className="mt-5 inline-block text-sm font-bold text-[#124536] transition group-hover:translate-x-1">
//               Open Orders →
//             </span>
//           </Link>

//           <Link
//             to="/admin/inventory"
//             className="group rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#b5c8bb] hover:shadow-md"
//           >
//             <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8e6f1] text-2xl text-[#51477d]">
//               ▣
//             </span>

//             <h3 className="mt-5 font-serif text-lg font-bold text-[#123f32]">
//               Manage Inventory
//             </h3>

//             <p className="mt-2 text-sm text-[#81796d]">
//               Review stock and identify items to restock.
//             </p>

//             <span className="mt-5 inline-block text-sm font-bold text-[#124536] transition group-hover:translate-x-1">
//               Open Inventory →
//             </span>
//           </Link>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default AdminDashboard;




// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";

// const money = (value) =>
//   `₹${Number(value || 0).toLocaleString("en-IN")}`;

// function getAmount(order) {
//   return Number(
//     order.totalAmount ?? order.total ?? order.grandTotal ?? 0
//   );
// }

// function getCustomer(order) {
//   return (
//     order.user?.name ||
//     order.customer?.name ||
//     order.shippingAddress?.fullName ||
//     "Customer"
//   );
// }

// function getOrderId(id) {
//   return `#${String(id || "").slice(-6).toUpperCase()}`;
// }

// function formatDate(date) {
//   if (!date || Number.isNaN(new Date(date).getTime())) return "—";

//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

// function getStatusStyle(status) {
//   switch ((status || "Pending").toLowerCase()) {
//     case "delivered":
//       return "bg-emerald-100 text-emerald-800";
//     case "cancelled":
//       return "bg-rose-100 text-rose-800";
//     case "shipped":
//       return "bg-sky-100 text-sky-800";
//     case "confirmed":
//     case "packed":
//       return "bg-amber-100 text-amber-800";
//     default:
//       return "bg-[#F0E8D8] text-[#725D36]";
//   }
// }

// function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalCustomers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     totalSales: 0,
//     lowStockItems: 0,
//   });

//   const [allOrders, setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [chartPeriod, setChartPeriod] = useState("Year");

//   const loadDashboard = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const [statsResult, ordersResult] = await Promise.allSettled([
//         api.get("/admin/dashboard"),
//         api.get("/admin/orders"),
//       ]);

//       if (statsResult.status === "rejected") {
//         const err = statsResult.reason;

//         if (err.response?.status === 401) {
//           setError("Login expired. Please login again.");
//         } else if (err.response?.status === 403) {
//           setError("Admin access required. Login with an admin account.");
//         } else {
//           setError(
//             err.response?.data?.message ||
//               "Unable to load dashboard statistics."
//           );
//         }

//         return;
//       }

//       const response = statsResult.value.data;
//       const data = response.data || response;

//       setStats({
//         totalCustomers: Number(data.totalCustomers ?? 0),
//         totalProducts: Number(data.totalProducts ?? 0),
//         totalOrders: Number(data.totalOrders ?? 0),
//         totalSales: Number(data.totalSales ?? 0),
//         lowStockItems: Number(data.lowStockItems ?? 0),
//       });

//       if (ordersResult.status === "fulfilled") {
//         const result = ordersResult.value.data;

//         const list = Array.isArray(result)
//           ? result
//           : Array.isArray(result.data)
//             ? result.data
//             : Array.isArray(result.orders)
//               ? result.orders
//               : Array.isArray(result.data?.orders)
//                 ? result.data.orders
//                 : [];

//         setAllOrders(list);
//       } else {
//         setAllOrders([]);
//       }
//     } catch (err) {
//       console.error("Dashboard error:", err);
//       setError("Something went wrong while loading dashboard.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadDashboard();
//   }, [loadDashboard]);

//   const filteredOrders = useMemo(() => {
//     return allOrders.filter((order) => {
//       if (!order.createdAt) return false;

//       const date = new Date(order.createdAt);

//       if (Number.isNaN(date.getTime())) return false;

//       const day = [
//         date.getFullYear(),
//         String(date.getMonth() + 1).padStart(2, "0"),
//         String(date.getDate()).padStart(2, "0"),
//       ].join("-");

//       if (fromDate && day < fromDate) return false;
//       if (toDate && day > toDate) return false;

//       return true;
//     });
//   }, [allOrders, fromDate, toDate]);

//   const reportSales = filteredOrders.reduce((total, order) => {
//     if ((order.status || "").toLowerCase() === "cancelled") {
//       return total;
//     }

//     return total + getAmount(order);
//   }, 0);

//   const cancelledOrders = filteredOrders.filter(
//     (order) => (order.status || "").toLowerCase() === "cancelled"
//   ).length;

//   const recentOrders = useMemo(() => {
//     return [...allOrders]
//       .sort(
//         (a, b) =>
//           new Date(b.createdAt || 0).getTime() -
//           new Date(a.createdAt || 0).getTime()
//       )
//       .slice(0, 5);
//   }, [allOrders]);

//   const chartData = useMemo(() => {
//     const now = new Date();
//     const count = chartPeriod === "Week" ? 7 : chartPeriod === "Month" ? 30 : 12;

//     return Array.from({ length: count }, (_, index) => {
//       let start;
//       let end;
//       let label;

//       if (chartPeriod === "Week") {
//         start = new Date(now);
//         start.setHours(0, 0, 0, 0);
//         start.setDate(now.getDate() - (6 - index));

//         end = new Date(start);
//         end.setDate(start.getDate() + 1);

//         label = start.toLocaleDateString("en-IN", {
//           weekday: "short",
//         });
//       } else if (chartPeriod === "Month") {
//         start = new Date(now);
//         start.setHours(0, 0, 0, 0);
//         start.setDate(now.getDate() - (count - 1 - index));

//         end = new Date(start);
//         end.setDate(start.getDate() + 1);

//         label = String(start.getDate());
//       } else {
//         start = new Date(now.getFullYear(), index, 1);
//         end = new Date(now.getFullYear(), index + 1, 1);

//         label = start.toLocaleDateString("en-IN", {
//           month: "short",
//         });
//       }

//       const sales = allOrders.reduce((sum, order) => {
//         if ((order.status || "").toLowerCase() === "cancelled") {
//           return sum;
//         }

//         const orderDate = new Date(order.createdAt);

//         if (
//           Number.isNaN(orderDate.getTime()) ||
//           orderDate < start ||
//           orderDate >= end
//         ) {
//           return sum;
//         }

//         return sum + getAmount(order);
//       }, 0);

//       return { label, sales };
//     });
//   }, [allOrders, chartPeriod]);

//   const chartMax = Math.max(...chartData.map((item) => item.sales), 1);

//   const cards = [
//     {
//       label: "Total Sales",
//       value: money(stats.totalSales),
//       note: "Excluding cancelled orders",
//       icon: "₹",
//       bg: "bg-[#F4E9D5]",
//     },
//     {
//       label: "Customers",
//       value: stats.totalCustomers.toLocaleString("en-IN"),
//       note: "Registered customers",
//       icon: "♙",
//       bg: "bg-[#E3ECE5]",
//     },
//     {
//       label: "Total Orders",
//       value: stats.totalOrders.toLocaleString("en-IN"),
//       note: "Orders received",
//       icon: "▤",
//       bg: "bg-[#E9E6F0]",
//     },
//     {
//       label: "Products",
//       value: stats.totalProducts.toLocaleString("en-IN"),
//       note: "Products in your store",
//       icon: "♧",
//       bg: "bg-[#F3E4E0]",
//     },
//   ];

//   return (
//     <main className="min-w-0 space-y-7 text-[#173D32]">
//       {/* Header */}
//       <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <p className="text-[10px] font-bold tracking-[0.24em] text-[#7C897E]">
//             MODEZA / STORE ANALYTICS
//           </p>
//           <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
//             Dashboard Overview
//           </h1>
//           <p className="mt-2 text-sm text-[#788078]">
//             Welcome back! Here&apos;s what&apos;s happening in your store.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={loadDashboard}
//           disabled={loading}
//           className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#164D3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0D382C] disabled:opacity-60 sm:self-auto"
//         >
//           <span className="text-lg">↻</span>
//           {loading ? "Loading..." : "Refresh"}
//         </button>
//       </header>

//       {error && (
//         <div
//           role="alert"
//           className="flex flex-col justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center"
//         >
//           <div>
//             <p className="font-bold text-rose-800">Dashboard error</p>
//             <p className="mt-1 text-sm text-rose-700">{error}</p>
//           </div>
//           <button
//             onClick={loadDashboard}
//             className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
//           >
//             Try again
//           </button>
//         </div>
//       )}

//       {/* Statistics */}
//       <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
//         {cards.map((card) => (
//           <article
//             key={card.label}
//             className="rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
//           >
//             <div className="flex items-center justify-between gap-3">
//               <p className="text-sm font-medium text-[#758078]">
//                 {card.label}
//               </p>
//               <span
//                 className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold text-[#164D3D] ${card.bg}`}
//               >
//                 {card.icon}
//               </span>
//             </div>
//             <p className="mt-5 break-words text-2xl font-bold sm:text-3xl">
//               {loading ? "—" : card.value}
//             </p>
//             <p className="mt-2 text-xs text-[#899087]">{card.note}</p>
//           </article>
//         ))}
//       </section>

//       {/* Sales chart and top products placeholder avoided */}
//       <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
//         <article className="min-w-0 rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm sm:p-6">
//           <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
//             <div>
//               <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A8B7C]">
//                 PERFORMANCE
//               </p>
//               <h2 className="mt-2 font-serif text-xl font-bold">
//                 Sales Performance
//               </h2>
//               <p className="mt-1 text-xs text-[#858A80]">
//                 Sales from available order records
//               </p>
//             </div>

//             <div className="flex rounded-xl bg-[#F3F0E7] p-1">
//               {["Week", "Month", "Year"].map((period) => (
//                 <button
//                   key={period}
//                   type="button"
//                   onClick={() => setChartPeriod(period)}
//                   className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
//                     chartPeriod === period
//                       ? "bg-[#164D3D] text-white shadow-sm"
//                       : "text-[#65756B] hover:bg-white"
//                   }`}
//                 >
//                   {period}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mt-8 flex h-56 gap-2 sm:gap-4">
//             <div className="flex flex-col justify-between pb-7 text-[10px] text-[#8A8E84]">
//               <span>{money(chartMax)}</span>
//               <span>{money(chartMax * 0.66)}</span>
//               <span>{money(chartMax * 0.33)}</span>
//               <span>₹0</span>
//             </div>

//             <div className="relative grid min-w-0 flex-1 grid-cols-7 items-end gap-2 sm:grid-cols-12 sm:gap-3">
//               <div className="pointer-events-none absolute inset-0 bottom-7 flex flex-col justify-between">
//                 {[0, 1, 2].map((line) => (
//                   <div
//                     key={line}
//                     className="w-full border-t border-dashed border-[#E9E5DB]"
//                   />
//                 ))}
//               </div>

//               {chartData.map((item, index) => (
//                 <div
//                   key={`${item.label}-${index}`}
//                   className="relative flex h-full min-w-0 flex-col items-center justify-end"
//                   title={`${item.label}: ${money(item.sales)}`}
//                 >
//                   <div className="flex h-full w-full items-end justify-center pb-7">
//                     <div
//                       className={`w-full max-w-7 rounded-t-md transition-all duration-300 ${
//                         item.sales > 0
//                           ? "bg-[#164D3D] hover:bg-[#36765E]"
//                           : "bg-[#E7E4DA]"
//                       }`}
//                       style={{
//                         height: `${Math.max(
//                           item.sales > 0 ? 5 : 2,
//                           (item.sales / chartMax) * 100
//                         )}%`,
//                       }}
//                     />
//                   </div>
//                   <span className="absolute bottom-0 text-[10px] text-[#858A80]">
//                     {item.label}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <p className="mt-4 text-xs text-[#899087]">
//             {chartPeriod === "Year"
//               ? "Monthly sales for the current year"
//               : chartPeriod === "Month"
//                 ? "Daily sales for the last 30 days"
//                 : "Daily sales for the last 7 days"}
//           </p>
//         </article>

//         {/* Inventory card */}
//         <article className="flex flex-col rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm sm:p-6">
//           <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A8B7C]">
//             STOCK MANAGEMENT
//           </p>
//           <h2 className="mt-2 font-serif text-xl font-bold">
//             Inventory Overview
//           </h2>
//           <p className="mt-1 text-sm text-[#858A80]">
//             Keep your collection ready for customers.
//           </p>

//           <div className="my-6 flex flex-1 flex-col justify-center rounded-2xl bg-[#F5F2E9] p-5">
//             <div className="flex items-center justify-between gap-3">
//               <div>
//                 <p className="text-sm text-[#737D72]">Low Stock Items</p>
//                 <p className="mt-2 text-4xl font-bold">
//                   {loading ? "—" : stats.lowStockItems}
//                 </p>
//               </div>
//               <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9DFC8] text-2xl text-[#82683B]">
//                 !
//               </span>
//             </div>
//             <p className="mt-4 text-xs leading-5 text-[#858A80]">
//               Check stock levels and update quantities before items run out.
//             </p>
//           </div>

//           <Link
//             to="/admin/inventory"
//             className="inline-flex items-center justify-center rounded-xl bg-[#164D3D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0D382C]"
//           >
//             Manage Inventory →
//           </Link>
//         </article>
//       </section>

//       {/* Reports */}
//       <section className="overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] shadow-sm">
//         <div className="border-b border-[#E7E1D5] p-5 sm:p-6">
//           <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A8B7C]">
//             BUSINESS ANALYTICS
//           </p>
//           <h2 className="mt-2 font-serif text-2xl font-bold">
//             Sales &amp; Order Report
//           </h2>
//           <p className="mt-1 text-sm text-[#858A80]">
//             Filter actual order records by date.
//           </p>

//           <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
//             <label className="text-sm font-semibold">
//               From Date
//               <input
//                 type="date"
//                 value={fromDate}
//                 max={toDate || undefined}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="mt-2 block w-full rounded-xl border border-[#DEDCCF] bg-white px-4 py-3 font-normal outline-none focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
//               />
//             </label>

//             <label className="text-sm font-semibold">
//               To Date
//               <input
//                 type="date"
//                 value={toDate}
//                 min={fromDate || undefined}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="mt-2 block w-full rounded-xl border border-[#DEDCCF] bg-white px-4 py-3 font-normal outline-none focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
//               />
//             </label>

//             <button
//               type="button"
//               onClick={() => {
//                 setFromDate("");
//                 setToDate("");
//               }}
//               className="rounded-xl border border-[#DEDCCF] px-5 py-3 text-sm font-semibold text-[#164D3D] transition hover:bg-[#F3F0E7]"
//             >
//               Reset Filter
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
//           <div className="rounded-xl bg-[#F3F0E7] p-5">
//             <p className="text-sm text-[#758078]">Orders in Range</p>
//             <p className="mt-3 text-2xl font-bold">
//               {loading ? "—" : filteredOrders.length}
//             </p>
//           </div>
//           <div className="rounded-xl bg-[#E3ECE5] p-5">
//             <p className="text-sm text-[#587262]">Sales in Range</p>
//             <p className="mt-3 break-words text-2xl font-bold">
//               {loading ? "—" : money(reportSales)}
//             </p>
//           </div>
//           <div className="rounded-xl bg-[#F3E4E0] p-5">
//             <p className="text-sm text-[#8B6258]">Cancelled Orders</p>
//             <p className="mt-3 text-2xl font-bold text-[#853F35]">
//               {loading ? "—" : cancelledOrders}
//             </p>
//           </div>
//         </div>

//         <div className="px-5 pb-5 sm:px-6 sm:pb-6">
//           <div className="overflow-x-auto rounded-xl border border-[#E7E1D5]">
//             <table className="w-full min-w-[680px] text-left">
//               <thead className="bg-[#F3F0E7]">
//                 <tr>
//                   {["Order ID", "Date", "Customer", "Amount", "Status"].map(
//                     (heading) => (
//                       <th
//                         key={heading}
//                         className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#758078]"
//                       >
//                         {heading}
//                       </th>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#EEE9DF]">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={5} className="px-5 py-10 text-center text-sm">
//                       Loading report...
//                     </td>
//                   </tr>
//                 ) : filteredOrders.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#858A80]">
//                       No orders found for the selected dates.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredOrders.map((order) => (
//                     <tr key={order._id} className="hover:bg-[#FAF8F0]">
//                       <td className="px-5 py-4 text-sm font-bold text-[#164D3D]">
//                         {getOrderId(order._id)}
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-4 text-sm text-[#758078]">
//                         {formatDate(order.createdAt)}
//                       </td>
//                       <td className="px-5 py-4 text-sm font-medium">
//                         {getCustomer(order)}
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold">
//                         {money(getAmount(order))}
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(order.status)}`}>
//                           {order.status || "Pending"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//       {/* Recent Orders */}
//       <section className="overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] shadow-sm">
//         <div className="flex flex-col justify-between gap-3 border-b border-[#E7E1D5] p-5 sm:flex-row sm:items-center sm:p-6">
//           <div>
//             <h2 className="font-serif text-xl font-bold">Recent Orders</h2>
//             <p className="mt-1 text-sm text-[#858A80]">
//               Latest orders received by your store.
//             </p>
//           </div>
//           <Link
//             to="/admin/orders"
//             className="text-sm font-bold text-[#164D3D] hover:underline"
//           >
//             View All Orders →
//           </Link>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[560px] text-left">
//             <thead className="bg-[#F3F0E7]">
//               <tr>
//                 {["Order ID", "Customer", "Amount", "Status"].map((heading) => (
//                   <th key={heading} className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#758078]">
//                     {heading}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#EEE9DF]">
//               {loading ? (
//                 <tr>
//                   <td colSpan={4} className="px-5 py-10 text-center text-sm">
//                     Loading orders...
//                   </td>
//                 </tr>
//               ) : recentOrders.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#858A80]">
//                     No recent orders available.
//                   </td>
//                 </tr>
//               ) : (
//                 recentOrders.map((order) => (
//                   <tr key={order._id} className="hover:bg-[#FAF8F0]">
//                     <td className="px-5 py-4 text-sm font-bold text-[#164D3D]">
//                       {getOrderId(order._id)}
//                     </td>
//                     <td className="px-5 py-4 text-sm font-medium">
//                       {getCustomer(order)}
//                     </td>
//                     <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold">
//                       {money(getAmount(order))}
//                     </td>
//                     <td className="px-5 py-4">
//                       <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(order.status)}`}>
//                         {order.status || "Pending"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Quick Management */}
//       <section>
//         <div className="mb-5">
//           <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A8B7C]">
//             STORE SHORTCUTS
//           </p>
//           <h2 className="mt-2 font-serif text-2xl font-bold">
//             Quick Management
//           </h2>
//           <p className="mt-1 text-sm text-[#858A80]">
//             Access your main store management pages.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           {[
//             {
//               title: "Products",
//               desc: "Add and update dresses",
//               icon: "♧",
//               path: "/admin/products",
//               bg: "bg-[#E3ECE5]",
//             },
//             {
//               title: "Categories",
//               desc: "Organise your collection",
//               icon: "▤",
//               path: "/admin/category",
//               bg: "bg-[#F4E9D5]",
//             },
//             {
//               title: "Orders",
//               desc: "Review customer orders",
//               icon: "▣",
//               path: "/admin/orders",
//               bg: "bg-[#E9E6F0]",
//             },
//             {
//               title: "Inventory",
//               desc: "Check and adjust stock",
//               icon: "⌑",
//               path: "/admin/inventory",
//               bg: "bg-[#F3E4E0]",
//             },
//           ].map((item) => (
//             <Link
//               key={item.title}
//               to={item.path}
//               className="group rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#B7C9BC] hover:shadow-md"
//             >
//               <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-[#164D3D] ${item.bg}`}>
//                 {item.icon}
//               </span>
//               <h3 className="mt-4 font-serif text-lg font-bold">
//                 {item.title}
//               </h3>
//               <p className="mt-1 text-sm text-[#858A80]">{item.desc}</p>
//               <p className="mt-4 text-sm font-bold text-[#164D3D] transition group-hover:translate-x-1">
//                 Open {item.title} →
//               </p>
//             </Link>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }

// export default AdminDashboard;





import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function getAmount(order) {
  return Number(
    order.totalAmount ?? order.total ?? order.grandTotal ?? 0
  );
}

function getCustomer(order) {
  return (
    order.user?.name ||
    order.customer?.name ||
    order.shippingAddress?.fullName ||
    "Customer"
  );
}

function getOrderId(id) {
  return `#${String(id || "").slice(-6).toUpperCase()}`;
}

function formatDate(date) {
  if (!date || Number.isNaN(new Date(date).getTime())) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status) {
  switch ((status || "Pending").toLowerCase()) {
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-rose-100 text-rose-800";
    case "shipped":
      return "bg-sky-100 text-sky-800";
    case "confirmed":
    case "packed":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-[#F0E8D8] text-[#725D36]";
  }
}

function getOrderItems(order) {
  return Array.isArray(order.items) ? order.items : [];
}

function getItemProduct(item) {
  const variant = item.productVariant;
  const product = item.product;

  if (variant && typeof variant === "object" && variant.product) {
    return variant.product;
  }

  if (product && typeof product === "object") {
    return product;
  }

  return {};
}

function getCategoryName(item) {
  const product = getItemProduct(item);
  const category = product.category;

  if (typeof category === "string") return category;
  return category?.name || "Uncategorized";
}

function getItemSales(item) {
  const quantity = Number(item.quantity ?? item.qty ?? 1);

  const product = getItemProduct(item);

  const variant =
    item.productVariant && typeof item.productVariant === "object"
      ? item.productVariant
      : {};

  const price = Number(
    item.price ??
      item.unitPrice ??
      variant.price ??
      product.price ??
      0
  );

  return price * quantity;
}

const CATEGORY_COLORS = [
  "#164D3D",
  "#71977B",
  "#D0B477",
  "#A8B9A8",
  "#9C8175",
  "#7B8EB0",
  "#BD8C9C",
];

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    lowStockItems: 0,
  });

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartPeriod, setChartPeriod] = useState("Year");
  const [orderSearch, setOrderSearch] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [statsResult, ordersResult] = await Promise.allSettled([
        api.get("/admin/dashboard"),
        api.get("/admin/orders"),
      ]);

      if (statsResult.status === "rejected") {
        const err = statsResult.reason;

        if (err.response?.status === 401) {
          setError("Login expired. Please login again.");
        } else if (err.response?.status === 403) {
          setError("Admin access required. Login with an admin account.");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard statistics."
          );
        }

        return;
      }

      const response = statsResult.value.data;
      const data = response.data || response;

      setStats({
        totalCustomers: Number(data.totalCustomers ?? 0),
        totalProducts: Number(data.totalProducts ?? 0),
        totalOrders: Number(data.totalOrders ?? 0),
        totalSales: Number(data.totalSales ?? 0),
        lowStockItems: Number(data.lowStockItems ?? 0),
      });

      if (ordersResult.status === "fulfilled") {
        const result = ordersResult.value.data;

        const list = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.orders)
              ? result.orders
              : Array.isArray(result.data?.orders)
                ? result.data.orders
                : [];

        setAllOrders(list);
      } else {
        setAllOrders([]);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Something went wrong while loading dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      if (!order.createdAt) return false;

      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) return false;

      const day = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      if (fromDate && day < fromDate) return false;
      if (toDate && day > toDate) return false;

      return true;
    });
  }, [allOrders, fromDate, toDate]);

  const reportSales = filteredOrders.reduce((total, order) => {
    if ((order.status || "").toLowerCase() === "cancelled") {
      return total;
    }

    return total + getAmount(order);
  }, 0);

  const cancelledOrders = filteredOrders.filter(
    (order) => (order.status || "").toLowerCase() === "cancelled"
  ).length;

  const recentOrders = useMemo(() => {
    return [...allOrders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [allOrders]);

  // Weekly, daily or monthly sales graph.
  const chartData = useMemo(() => {
    const now = new Date();
    const count = chartPeriod === "Week" ? 7 : chartPeriod === "Month" ? 30 : 12;

    return Array.from({ length: count }, (_, index) => {
      let start;
      let end;
      let label;

      if (chartPeriod === "Week") {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        start.setDate(now.getDate() - (6 - index));

        end = new Date(start);
        end.setDate(start.getDate() + 1);

        label = start.toLocaleDateString("en-IN", {
          weekday: "short",
        });
      } else if (chartPeriod === "Month") {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        start.setDate(now.getDate() - (count - 1 - index));

        end = new Date(start);
        end.setDate(start.getDate() + 1);

        label = String(start.getDate());
      } else {
        start = new Date(now.getFullYear(), index, 1);
        end = new Date(now.getFullYear(), index + 1, 1);

        label = start.toLocaleDateString("en-IN", {
          month: "short",
        });
      }

      const sales = allOrders.reduce((sum, order) => {
        if ((order.status || "").toLowerCase() === "cancelled") {
          return sum;
        }

        const orderDate = new Date(order.createdAt);

        if (
          Number.isNaN(orderDate.getTime()) ||
          orderDate < start ||
          orderDate >= end
        ) {
          return sum;
        }

        return sum + getAmount(order);
      }, 0);

      return { label, sales };
    });
  }, [allOrders, chartPeriod]);

  const chartMax = Math.max(...chartData.map((item) => item.sales), 1);

  // Category-wise revenue from order item records.
  const categorySales = useMemo(() => {
    const totals = {};

    filteredOrders.forEach((order) => {
      if ((order.status || "").toLowerCase() === "cancelled") {
        return;
      }

      getOrderItems(order).forEach((item) => {
        const category = getCategoryName(item);
        const amount = getItemSales(item);

        if (amount > 0) {
          totals[category] = (totals[category] || 0) + amount;
        }
      });
    });

    return Object.entries(totals)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales);
  }, [filteredOrders]);

  const categoryTotal = categorySales.reduce(
    (sum, item) => sum + item.sales,
    0
  );

  const donutGradient = useMemo(() => {
    if (!categoryTotal) return "#E8E5DA";

    let current = 0;

    const segments = categorySales.map((item, index) => {
      const start = current;
      current += (item.sales / categoryTotal) * 100;

      return `${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} ${start}% ${current}%`;
    });

    return `conic-gradient(${segments.join(", ")})`;
  }, [categorySales, categoryTotal]);

  const searchedOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();

    if (!query) return filteredOrders;

    return filteredOrders.filter((order) => {
      return (
        getOrderId(order._id).toLowerCase().includes(query) ||
        getCustomer(order).toLowerCase().includes(query) ||
        String(order.status || "").toLowerCase().includes(query)
      );
    });
  }, [filteredOrders, orderSearch]);

  const cards = [
    {
      label: "Total Sales",
      value: money(stats.totalSales),
      note: "Excluding cancelled orders",
      icon: "₹",
      bg: "bg-[#F4E9D5]",
    },
    {
      label: "Customers",
      value: stats.totalCustomers.toLocaleString("en-IN"),
      note: "Registered customers",
      icon: "♙",
      bg: "bg-[#E3ECE5]",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      note: "Orders received",
      icon: "▤",
      bg: "bg-[#E9E6F0]",
    },
    {
      label: "Products",
      value: stats.totalProducts.toLocaleString("en-IN"),
      note: "Products in your store",
      icon: "♧",
      bg: "bg-[#F3E4E0]",
    },
  ];

  return (
    <main className="min-w-0 space-y-7 text-[#173D32]">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold tracking-[0.24em] text-[#7C897E]">
            DRESS SHOP / STORE ANALYTICS
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-[#788078]">
            Welcome back! Here&apos;s what&apos;s happening in your store.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#164D3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0D382C] disabled:opacity-60 sm:self-auto"
        >
          <span className="text-lg">↻</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-bold text-rose-800">Dashboard error</p>
            <p className="mt-1 text-sm text-rose-700">{error}</p>
          </div>
          <button
            type="button"
            onClick={loadDashboard}
            className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#758078]">
                {card.label}
              </p>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold text-[#164D3D] ${card.bg}`}
              >
                {card.icon}
              </span>
            </div>
            <p className="mt-5 break-words text-2xl font-bold sm:text-3xl">
              {loading ? "—" : card.value}
            </p>
            <p className="mt-2 text-xs text-[#899087]">{card.note}</p>
          </article>
        ))}
      </section>

      {/* Sales graph */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
        <article className="min-w-0 rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A8B7C]">
                PERFORMANCE
              </p>
              <h2 className="mt-2 font-serif text-xl font-bold">
                Sales Performance
              </h2>
              <p className="mt-1 text-xs text-[#858A80]">
                Sales from available order records
              </p>
            </div>

            <div className="flex rounded-xl bg-[#F3F0E7] p-1">
              {["Week", "Month", "Year"].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setChartPeriod(period)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    chartPeriod === period
                      ? "bg-[#164D3D] text-white shadow-sm"
                      : "text-[#65756B] hover:bg-white"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex h-56 gap-2 sm:gap-4">
            <div className="flex flex-col justify-between pb-7 text-[10px] text-[#8A8E84]">
              <span>{money(chartMax)}</span>
              <span>{money(chartMax * 0.66)}</span>
              <span>{money(chartMax * 0.33)}</span>
              <span>₹0</span>
            </div>

            <div
              className={`relative grid min-w-0 flex-1 items-end gap-2 sm:gap-3 ${
                chartPeriod === "Year" ? "grid-cols-12" : "grid-cols-7"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bottom-7 flex flex-col justify-between">
                {[0, 1, 2].map((line) => (
                  <div
                    key={line}
                    className="w-full border-t border-dashed border-[#E9E5DB]"
                  />
                ))}
              </div>

              {chartData.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="relative flex h-full min-w-0 flex-col items-center justify-end"
                  title={`${item.label}: ${money(item.sales)}`}
                >
                  <div className="flex h-full w-full items-end justify-center pb-7">
                    <div
                      className={`w-full max-w-7 rounded-t-md transition-all duration-300 ${
                        item.sales > 0
                          ? "bg-[#164D3D] hover:bg-[#36765E]"
                          : "bg-[#E7E4DA]"
                      }`}
                      style={{
                        height: `${
                          item.sales > 0
                            ? Math.max(5, (item.sales / chartMax) * 100)
                            : 2
                        }%`,
                      }}
                    />
                  </div>
                  <span className="absolute bottom-0 text-[10px] text-[#858A80]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-[#899087]">
            {chartPeriod === "Year"
              ? "Monthly sales for the current year"
              : chartPeriod === "Month"
                ? "Daily sales for the last 30 days"
                : "Daily sales for the last 7 days"}
          </p>
        </article>

        {/* Inventory */}
        <article className="flex flex-col rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm sm:p-6">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A8B7C]">
            STOCK MANAGEMENT
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold">
            Inventory Overview
          </h2>
          <p className="mt-1 text-sm text-[#858A80]">
            Keep your collection ready for customers.
          </p>

          <div className="my-6 flex flex-1 flex-col justify-center rounded-2xl bg-[#F5F2E9] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#737D72]">Low Stock Items</p>
                <p className="mt-2 text-4xl font-bold">
                  {loading ? "—" : stats.lowStockItems}
                </p>
              </div>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9DFC8] text-2xl text-[#82683B]">
                !
              </span>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#858A80]">
              Check stock levels and update quantities before items run out.
            </p>
          </div>

          <Link
            to="/admin/inventory"
            className="inline-flex items-center justify-center rounded-xl bg-[#164D3D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0D382C]"
          >
            Manage Inventory →
          </Link>
        </article>
      </section>

      {/* Category donut wheel */}
      <section className="rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A8B7C]">
              CATEGORY ANALYTICS
            </p>
            <h2 className="mt-2 font-serif text-xl font-bold">
              Sales by Category
            </h2>
            <p className="mt-1 text-sm text-[#858A80]">
              Revenue distribution across categories
            </p>
          </div>

          <span className="rounded-xl bg-[#E3ECE5] px-4 py-2 text-sm font-semibold text-[#164D3D]">
            {categorySales.length} Categories
          </span>
        </div>

        {categoryTotal > 0 ? (
          <div className="mt-7 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="flex justify-center">
              <div
                className="relative flex h-56 w-56 items-center justify-center rounded-full"
                style={{ background: donutGradient }}
                role="img"
                aria-label="Category-wise sales donut chart"
              >
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#FFFEFA] shadow-inner">
                  <span className="text-xs text-[#858A80]">
                    Total Sales
                  </span>
                  <span className="mt-2 max-w-full break-words px-2 text-center text-xl font-bold text-[#164D3D]">
                    {money(categoryTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {categorySales.map((item, index) => {
                const percentage = (item.sales / categoryTotal) * 100;
                const color =
                  CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="h-3 w-3 shrink-0 rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate text-sm font-semibold text-[#173D32]">
                          {item.name}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#164D3D]">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="ml-6 mt-2 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#858A80]">
                        {money(item.sales)}
                      </span>
                      <span className="text-xs text-[#858A80]">
                        Sales
                      </span>
                    </div>

                    <div className="ml-6 mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAE8DF]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-[#F5F2E9] px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3ECE5] text-2xl text-[#164D3D]">
              ◉
            </div>
            <h3 className="mt-4 font-semibold text-[#173D32]">
              No category sales available
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#858A80]">
              Order items-il product category, quantity, price details
              populate cheythittundenkil category chart display cheyyum.
            </p>
          </div>
        )}
      </section>

     
      {/* Recent orders */}
      <section className="overflow-hidden rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#E7E1D5] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="font-serif text-xl font-bold">Recent Orders</h2>
            <p className="mt-1 text-sm text-[#858A80]">
              Latest orders received by your store.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-sm font-bold text-[#164D3D] hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-[#F3F0E7]">
              <tr>
                {["Order ID", "Customer", "Amount", "Status"].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#758078]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEE9DF]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm">
                    Loading orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-[#858A80]"
                  >
                    No recent orders available.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF8F0]">
                    <td className="px-5 py-4 text-sm font-bold text-[#164D3D]">
                      {getOrderId(order._id)}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium">
                      {getCustomer(order)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold">
                      {money(getAmount(order))}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(order.status)}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick management */}
      <section>
        <div className="mb-5">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A8B7C]">
            STORE SHORTCUTS
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold">
            Quick Management
          </h2>
          <p className="mt-1 text-sm text-[#858A80]">
            Access your main store management pages.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Products",
              desc: "Add and update dresses",
              icon: "♧",
              path: "/admin/products",
              bg: "bg-[#E3ECE5]",
            },
            {
              title: "Categories",
              desc: "Organise your collection",
              icon: "▤",
              path: "/admin/category",
              bg: "bg-[#F4E9D5]",
            },
            {
              title: "Orders",
              desc: "Review customer orders",
              icon: "▣",
              path: "/admin/orders",
              bg: "bg-[#E9E6F0]",
            },
            {
              title: "Inventory",
              desc: "Check and adjust stock",
              icon: "⌑",
              path: "/admin/inventory",
              bg: "bg-[#F3E4E0]",
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="group rounded-2xl border border-[#E7E1D5] bg-[#FFFEFA] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#B7C9BC] hover:shadow-md"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-[#164D3D] ${item.bg}`}
              >
                {item.icon}
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[#858A80]">{item.desc}</p>
              <p className="mt-4 text-sm font-bold text-[#164D3D] transition group-hover:translate-x-1">
                Open {item.title} →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
