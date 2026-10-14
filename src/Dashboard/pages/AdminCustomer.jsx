import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/customer");
        setCustomers(
          Array.isArray(response.data)
            ? response.data
            : response.data.customers || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load customers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <div className="admin-page-heading">
        <p className="admin-eyebrow">CUSTOMER DIRECTORY</p>
        <h1>Customers</h1>
        <p>View your registered customers.</p>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name || "Unnamed Customer"}</td>
                  <td>{customer.email || "—"}</td>
                  <td>
                    <span className="admin-status">
                      {customer.role || "customer"}
                    </span>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="3" className="admin-empty-cell">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;