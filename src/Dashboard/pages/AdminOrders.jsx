
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.orders)
        ? data.orders
        : Array.isArray(data?.data?.orders)
        ? data.data.orders
        : [];

      setOrders(list);
    } catch (err) {
      console.error("ADMIN ORDERS ERROR:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getCustomerName = (order) => {
    const user = order.user;

    if (user && typeof user === "object") {
      return (
        user.name ||
        user.fullName ||
        order.shippingAddress?.fullName ||
        order.shippingAddress?.name ||
        "Customer"
      );
    }

    return (
      order.shippingAddress?.fullName ||
      order.shippingAddress?.name ||
      "Customer"
    );
  };

  const getCustomerEmail = (order) => {
    if (order.user && typeof order.user === "object") {
      return order.user.email || "";
    }

    return order.customer?.email || "";
  };

  const getAmount = (order) =>
    Number(
      order.totalAmount ??
        order.total ??
        order.grandTotal ??
        order.totalPrice ??
        0
    );

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const getDate = (order) => {
    const date = order.createdAt || order.orderDate;

    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700 ring-amber-200",
      Confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
      Packed: "bg-violet-50 text-violet-700 ring-violet-200",
      Shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Cancelled: "bg-red-50 text-red-700 ring-red-200",
    };

    return (
      styles[status] ||
      "bg-stone-100 text-stone-700 ring-stone-200"
    );
  };

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = String(order._id || "").toLowerCase();
      const shortOrderId = orderId.slice(-6);
      const customerName = getCustomerName(order).toLowerCase();
      const email = getCustomerEmail(order).toLowerCase();

      const matchesSearch =
        !searchText ||
        orderId.includes(searchText) ||
        shortOrderId.includes(searchText) ||
        customerName.includes(searchText) ||
        email.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        (order.status || "Pending").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const pendingOrders = orders.filter(
    (order) => (order.status || "Pending") === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalOrderValue = orders.reduce(
    (sum, order) => sum + getAmount(order),
    0
  );

  const statCards = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: "▤",
      color: "bg-[#e8f0e9] text-[#164d3d]",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: "◷",
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: "✓",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Total Order Value",
      value: `₹${money(totalOrderValue)}`,
      icon: "₹",
      color: "bg-[#f2e9db] text-[#795a35]",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-6 text-[#24352e] sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#81796d]">
              Sales Management
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#123f32] sm:text-4xl">
              Orders
            </h1>

            <p className="mt-2 text-sm text-[#6b7169] sm:text-base">
              Review customer purchases and view order details.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#124536] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b3428] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <span className="text-lg">↻</span>
            {loading ? "Loading..." : "Refresh Orders"}
          </button>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#6b7169]">
                    {card.title}
                  </p>

                  <h2 className="mt-3 break-words text-2xl font-bold text-[#123f32] sm:text-3xl">
                    {loading ? "—" : card.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-semibold ${card.color}`}
                >
                  {card.icon}
                </div>
              </div>

              <div className="mt-5 h-1 w-full rounded-full bg-[#eee8dd]">
                <div className="h-1 w-2/5 rounded-full bg-[#527c68]" />
              </div>
            </article>
          ))}
        </section>

        {/* Error */}
        {error && (
          <div
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
            role="alert"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchOrders}
              className="self-start rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition hover:bg-red-800 sm:self-auto"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders Table */}
        <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
          <div className="border-b border-[#eee7dc] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-[#123f32]">
                  All Orders
                </h2>

                <p className="mt-1 text-sm text-[#81796d]">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#e8f0e9] px-3 py-1.5 text-xs font-semibold text-[#164d3d]">
                {filteredOrders.length} results
              </span>
            </div>

            {/* Search and Filter */}
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#81796d]">
                  ⌕
                </span>

                <input
                  type="search"
                  placeholder="Search order ID, customer or email..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-[#ded6ca] bg-white py-3 pl-11 pr-4 text-sm text-[#24352e] outline-none transition placeholder:text-[#a19a8e] focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm text-[#24352e] outline-none focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#dce6dd] border-t-[#164d3d]" />
              <p className="text-sm text-[#6b7169]">
                Loading orders...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#f7f3eb]">
                    {[
                      "Order ID",
                      "Customer",
                      "Date",
                      "Amount",
                      "Payment",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#716d63]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee7dc]">
                  {filteredOrders.map((order) => {
                    const status = order.status || "Pending";
                    const customerName = getCustomerName(order);
                    const customerEmail = getCustomerEmail(order);

                    return (
                      <tr
                        key={order._id}
                        className="transition hover:bg-[#faf8f2]"
                      >
                        <td className="whitespace-nowrap px-5 py-5">
                          <span className="font-bold text-[#164d3d]">
                            #
                            {String(order._id || "")
                              .slice(-6)
                              .toUpperCase()}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0e9] font-bold text-[#164d3d]">
                              {customerName.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="whitespace-nowrap text-sm font-semibold text-[#24352e]">
                                {customerName}
                              </p>

                              {customerEmail && (
                                <p className="mt-1 max-w-[200px] truncate text-xs text-[#81796d]">
                                  {customerEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm text-[#6b7169]">
                          {getDate(order)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-bold text-[#123f32]">
                          ₹{money(getAmount(order))}
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex whitespace-nowrap rounded-lg bg-[#f2eee6] px-3 py-1.5 text-xs font-medium text-[#625b50]">
                            {order.paymentStatus ||
                              order.paymentMethod ||
                              "Pending"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(status)}`}
                          >
                            <span className="mr-1.5">●</span>
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#cbdacf] px-3 py-2 text-xs font-semibold text-[#164d3d] transition hover:border-[#164d3d] hover:bg-[#e8f0e9]"
                          >
                            View Details
                            <span>→</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2eee6] text-2xl text-[#81796d]">
                          ▤
                        </div>

                        <h3 className="mt-4 font-semibold text-[#123f32]">
                          {orders.length === 0
                            ? "No orders found"
                            : "No matching orders"}
                        </h3>

                        <p className="mt-1 text-sm text-[#81796d]">
                          {orders.length === 0
                            ? "Customer orders will appear here."
                            : "Try changing your search or status filter."}
                        </p>

                        {(search || statusFilter !== "All") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setStatusFilter("All");
                            }}
                            className="mt-4 text-sm font-semibold text-[#164d3d] underline underline-offset-4 hover:text-[#0b3428]"
                          >
                            Clear filters
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && orders.length > 0 && (
            <div className="border-t border-[#eee7dc] bg-[#fdfbf6] px-5 py-4">
              <p className="text-xs text-[#81796d]">
                Displaying {filteredOrders.length} matching orders out of{" "}
                {orders.length} total orders.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminOrders;
