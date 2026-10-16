
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/customers");
      const result = response.data;

      const list = Array.isArray(result)
        ? result
        : result.data ?? result.customers ?? [];

      setCustomers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(
        "Customers API Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const name =
        customer.name ||
        customer.fullName ||
        [customer.firstName, customer.lastName]
          .filter(Boolean)
          .join(" ");

      const email = customer.email || "";
      const phone = customer.phone || customer.phoneNumber || "";

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        String(phone).toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="min-w-0 space-y-7">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#81796d]">
            DRESS SHOP / ADMIN
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold text-[#123f32]">
            Customers
          </h1>

          <p className="mt-2 text-sm text-[#6b7169]">
            Manage your registered customers.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#124536] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3428] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <span className="text-lg">↻</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e5ece3] text-2xl text-[#124536]">
            ♙
          </div>

          <div>
            <p className="text-sm font-medium text-[#81796d]">
              Total Customers
            </p>
            <h2 className="mt-1 text-3xl font-bold text-[#123f32]">
              {customers.length}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f0e8d8] text-2xl text-[#725d36]">
            ⌕
          </div>

          <div>
            <p className="text-sm font-medium text-[#81796d]">
              Search Results
            </p>
            <h2 className="mt-1 text-3xl font-bold text-[#123f32]">
              {filteredCustomers.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Customer Table Card */}
      <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-[#e8dfd2] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#123f32]">
              Customer List
            </h2>
            <p className="mt-1 text-sm text-[#81796d]">
              View your registered customer details.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#81796d]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#ded6ca] bg-white py-3 pl-11 pr-4 text-sm text-[#24352e] outline-none transition placeholder:text-[#a49a8c] focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-56 flex-col items-center justify-center gap-4 p-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e5ece3] border-t-[#124536]" />
            <p className="text-sm text-[#6b7169]">
              Loading customers...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
              !
            </div>

            <p className="mt-4 max-w-lg text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchCustomers}
              className="mt-5 rounded-xl bg-[#124536] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3428]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#f5f1e8]">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#6b7169]">
                      Joined Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee7dc]">
                  {filteredCustomers.map((customer, index) => {
                    const name =
                      customer.name ||
                      customer.fullName ||
                      [
                        customer.firstName,
                        customer.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") ||
                      "Unnamed Customer";

                    const email = customer.email || "—";
                    const phone =
                      customer.phone ||
                      customer.phoneNumber ||
                      "—";

                    const role = customer.role || "customer";

                    return (
                      <tr
                        key={customer._id || customer.id || index}
                        className="transition hover:bg-[#faf7f0]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5ece3] font-serif text-lg font-bold text-[#124536]">
                              {name.charAt(0).toUpperCase()}
                            </div>

                            <span className="font-semibold text-[#24352e]">
                              {name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#6b7169]">
                          {email}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#6b7169]">
                          {phone}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-[#e5ece3] px-3 py-1.5 text-xs font-semibold capitalize text-[#124536]">
                            {role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#6b7169]">
                          {formatDate(customer.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredCustomers.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
                <span className="text-4xl text-[#b8b0a3]">♙</span>

                <h3 className="mt-3 font-serif text-lg font-bold text-[#123f32]">
                  {search
                    ? "No customers found"
                    : "No customers yet"}
                </h3>

                <p className="mt-1 text-sm text-[#81796d]">
                  {search
                    ? "Try another name, email or phone number."
                    : "Registered customers will appear here."}
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-4 text-sm font-semibold text-[#124536] underline underline-offset-4 hover:text-[#0b3428]"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col gap-2 border-t border-[#e8dfd2] bg-[#faf7f0] px-5 py-4 text-xs text-[#81796d] sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>
                Showing {filteredCustomers.length} of {customers.length} customers
              </p>
              <p>DRESS SHOP · CUSTOMER MANAGEMENT</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminCustomers;
