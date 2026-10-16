
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    lowStockItems: 0,
  });

  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const status = err.response?.status;

        if (status === 401) {
          setError("Login expired. Please login again.");
        } else if (status === 403) {
          setError(
            "Admin access required. Login with an admin account."
          );
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard statistics."
          );
        }

        setAllOrders([]);
        setOrders([]);
        return;
      }

      const responseData = statsResult.value.data;
      const data = responseData.data || responseData;

      setStats({
        totalCustomers: data.totalCustomers ?? 0,
        totalProducts: data.totalProducts ?? 0,
        totalOrders: data.totalOrders ?? 0,
        totalSales: data.totalSales ?? 0,
        lowStockItems: data.lowStockItems ?? 0,
      });

      if (ordersResult.status === "fulfilled") {
        const orderData = ordersResult.value.data;

        const list = Array.isArray(orderData)
          ? orderData
          : Array.isArray(orderData.data)
          ? orderData.data
          : Array.isArray(orderData.orders)
          ? orderData.orders
          : Array.isArray(orderData.data?.orders)
          ? orderData.data.orders
          : [];

        setAllOrders(list);
        setOrders(list.slice(0, 5));
      } else {
        setAllOrders([]);
        setOrders([]);
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

  const filteredOrders = allOrders.filter((order) => {
    const orderDate = order.createdAt
      ? new Date(order.createdAt).toISOString().slice(0, 10)
      : "";

    if (!orderDate) return false;
    if (fromDate && orderDate < fromDate) return false;
    if (toDate && orderDate > toDate) return false;

    return true;
  });

  const reportSales = filteredOrders.reduce((total, order) => {
    if (order.status === "Cancelled") return total;

    return (
      total +
      Number(
        order.totalAmount ??
          order.total ??
          order.grandTotal ??
          0
      )
    );
  }, 0);

  const reportOrderCount = filteredOrders.length;

  const cancelledOrders = filteredOrders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const cards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: "♙",
      description: "Registered customers",
      iconBg: "bg-[#e5ece3]",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "♧",
      description: "Products in your store",
      iconBg: "bg-[#f0e8d8]",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "▤",
      description: "Orders received",
      iconBg: "bg-[#e8e6f1]",
    },
    {
      title: "Total Sales",
      value: `₹${Number(stats.totalSales).toLocaleString("en-IN")}`,
      icon: "₹",
      description: "Excluding cancelled orders",
      iconBg: "bg-[#f4e4df]",
    },
  ];

  function getOrderAmount(order) {
    return Number(
      order.totalAmount ??
        order.total ??
        order.grandTotal ??
        0
    );
  }

  function getCustomerName(order) {
    return (
      order.user?.name ||
      order.customer?.name ||
      order.shippingAddress?.fullName ||
      "Customer"
    );
  }

  function getStatusStyle(status) {
    const value = (status || "Pending").toLowerCase();

    if (value === "delivered") {
      return "bg-green-100 text-green-800";
    }

    if (value === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (value === "shipped") {
      return "bg-blue-100 text-blue-800";
    }

    if (value === "confirmed" || value === "packed") {
      return "bg-amber-100 text-amber-800";
    }

    return "bg-[#f0e8d8] text-[#725d36]";
  }

  function formatDate(date) {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatOrderId(id) {
    return `#${String(id || "").slice(-6).toUpperCase()}`;
  }

  return (
    <main className="min-w-0 space-y-8">

      {/* Dashboard Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-[#81796d]">
            STORE PERFORMANCE
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold text-[#123f32] sm:text-4xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6b7169]">
            Welcome back! Here's what's happening in your store.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#124536] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3428] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <span className="text-lg">↻</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center"
        >
          <div>
            <h2 className="font-semibold text-red-800">
              Dashboard could not load
            </h2>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#6b7169]">
                {card.title}
              </p>

              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-semibold text-[#124536] ${card.iconBg}`}
              >
                {card.icon}
              </span>
            </div>

            <h2 className="mt-5 break-words text-3xl font-bold tracking-tight text-[#123f32]">
              {loading ? "—" : card.value}
            </h2>

            <p className="mt-2 text-xs text-[#81796d]">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      {/* Inventory Alert */}
      <section className="flex flex-col gap-5 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl text-amber-700">
            !
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-[#123f32]">
              Inventory Alert
            </h2>
            <p className="mt-1 text-sm text-[#81796d]">
              Products that may need restocking.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-[#faf7f0] px-5 py-3">
            <p className="text-xs text-[#81796d]">Low Stock Items</p>
            <p className="mt-1 text-2xl font-bold text-[#123f32]">
              {loading ? "—" : stats.lowStockItems}
            </p>
          </div>

          <Link
            to="/admin/inventory"
            className="rounded-xl bg-[#124536] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3428]"
          >
            Manage Inventory →
          </Link>
        </div>
      </section>

      {/* Sales and Order Report */}
      <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">

        <div className="border-b border-[#e8dfd2] p-5 sm:p-7">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#81796d]">
            BUSINESS ANALYTICS
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold text-[#123f32]">
            Sales &amp; Order Report
          </h2>

          <p className="mt-2 text-sm text-[#6b7169]">
            Select a date range to review your store performance.
          </p>

          {/* Date Filters */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <label className="block text-sm font-semibold text-[#24352e]">
              From Date
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm font-normal text-[#24352e] outline-none focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10"
              />
            </label>

            <label className="block text-sm font-semibold text-[#24352e]">
              To Date
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm font-normal text-[#24352e] outline-none focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="rounded-xl border border-[#ded6ca] bg-white px-5 py-3 text-sm font-semibold text-[#124536] transition hover:border-[#124536] hover:bg-[#f4f1e9]"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Report Summary Cards */}
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-7">
          <article className="rounded-xl bg-[#f5f1e8] p-5">
            <p className="text-sm font-medium text-[#6b7169]">
              Total Orders
            </p>
            <strong className="mt-3 block text-2xl font-bold text-[#123f32]">
              {loading ? "—" : reportOrderCount}
            </strong>
          </article>

          <article className="rounded-xl bg-[#e5ece3] p-5">
            <p className="text-sm font-medium text-[#456353]">
              Total Sales
            </p>
            <strong className="mt-3 block break-words text-2xl font-bold text-[#123f32]">
              {loading
                ? "—"
                : `₹${reportSales.toLocaleString("en-IN")}`}
            </strong>
          </article>

          <article className="rounded-xl bg-[#f4e4df] p-5">
            <p className="text-sm font-medium text-[#81584e]">
              Cancelled Orders
            </p>
            <strong className="mt-3 block text-2xl font-bold text-[#7f3428]">
              {loading ? "—" : cancelledOrders}
            </strong>
          </article>
        </div>

        {/* Report Table */}
        <div className="px-5 pb-5 sm:px-7 sm:pb-7">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-bold text-[#123f32]">
              Order Report Details
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#e8dfd2]">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-[#f5f1e8]">
                <tr>
                  {["Order ID", "Date", "Customer", "Amount", "Status"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee7dc]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-[#81796d]"
                    >
                      Loading report...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-[#81796d]"
                    >
                      No orders found for the selected dates.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-[#faf7f0]"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-[#124536]">
                        {formatOrderId(order._id)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#6b7169]">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-[#24352e]">
                        {getCustomerName(order)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#123f32]">
                        ₹{getOrderAmount(order).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(order.status)}`}
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
        </div>
      </section>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#e8dfd2] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#123f32]">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-[#81796d]">
              Review the latest orders from your customers.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#124536] transition hover:text-[#0b3428] hover:underline hover:underline-offset-4"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-[#f5f1e8]">
              <tr>
                {["Order ID", "Customer", "Amount", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eee7dc]">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-[#81796d]"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-[#81796d]"
                  >
                    No recent orders available.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition hover:bg-[#faf7f0]"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#124536]">
                      {formatOrderId(order._id)}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#24352e]">
                      {getCustomerName(order)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#123f32]">
                      ₹{getOrderAmount(order).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(order.status)}`}
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

      {/* Quick Management */}
      <section>
        <div className="mb-5">
          <h2 className="font-serif text-2xl font-bold text-[#123f32]">
            Quick Management
          </h2>
          <p className="mt-2 text-sm text-[#6b7169]">
            Manage your dress collection, customer orders, and store inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/products"
            className="group rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#b5c8bb] hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5ece3] text-2xl text-[#124536]">
              ♧
            </span>

            <h3 className="mt-5 font-serif text-lg font-bold text-[#123f32]">
              Manage Products
            </h3>

            <p className="mt-2 text-sm text-[#81796d]">
              Add or update dresses.
            </p>

            <span className="mt-5 inline-block text-sm font-bold text-[#124536] transition group-hover:translate-x-1">
              Open Products →
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className="group rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#b5c8bb] hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0e8d8] text-2xl text-[#725d36]">
              ▤
            </span>

            <h3 className="mt-5 font-serif text-lg font-bold text-[#123f32]">
              Manage Orders
            </h3>

            <p className="mt-2 text-sm text-[#81796d]">
              Review and update customer orders.
            </p>

            <span className="mt-5 inline-block text-sm font-bold text-[#124536] transition group-hover:translate-x-1">
              Open Orders →
            </span>
          </Link>

          <Link
            to="/admin/inventory"
            className="group rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#b5c8bb] hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8e6f1] text-2xl text-[#51477d]">
              ▣
            </span>

            <h3 className="mt-5 font-serif text-lg font-bold text-[#123f32]">
              Manage Inventory
            </h3>

            <p className="mt-2 text-sm text-[#81796d]">
              Review stock and identify items to restock.
            </p>

            <span className="mt-5 inline-block text-sm font-bold text-[#124536] transition group-hover:translate-x-1">
              Open Inventory →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
