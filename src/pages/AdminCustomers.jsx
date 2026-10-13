
import { useEffect, useState } from "react";
import api from "../services/api";
import "../index.css";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/customers");

      // API response array aanenkilum,
      // data property-il array aanenkilum support cheyyum.
      const result = response.data;
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.customers)
        ? result.customers
        : [];

      setCustomers(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Customers load cheyyan kazhinjilla."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section admin-customers">
      <p className="eyebrow">DRESS SHOP ADMIN</p>
      <h1>Customers Management</h1>
      <p className="admin-subtitle">
        Registered customers details ivide kaanam.
      </p>

      {loading && <p>Loading customers...</p>}

      {error && (
        <div className="customer-error">
          <p>{error}</p>
          <button onClick={fetchCustomers}>Try Again</button>
        </div>
      )}

      {!loading && !error && (
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={customer._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      {customer.name ||
                        customer.fullName ||
                        customer.username ||
                        "N/A"}
                    </td>
                    <td>{customer.email || "N/A"}</td>
                    <td>
                      <span className="customer-role">
                        {customer.role || "customer"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-customers">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="customer-refresh-btn"
        onClick={fetchCustomers}
        disabled={loading}
      >
        Refresh Customers
      </button>
    </main>
  );
}

export default AdminCustomers;
