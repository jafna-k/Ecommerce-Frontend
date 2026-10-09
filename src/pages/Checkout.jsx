import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/order", {
        shippingAddress: address,
        paymentMethod,
      });

      console.log("ORDER CREATED:", response.data);
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("PLACE ORDER ERROR:", err);
      setError(
        err.response?.data?.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", placeholder: "Enter your full name" },
    { name: "phone", label: "Phone Number", placeholder: "Enter phone number" },
    { name: "address", label: "House / Street Address", placeholder: "Enter delivery address" },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "state", label: "State", placeholder: "Enter state" },
    { name: "pincode", label: "PIN Code", placeholder: "Enter PIN code" },
  ];

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p>Enter your delivery details.</p>

        <form onSubmit={handlePlaceOrder}>
          {fields.map((field) => (
            <div className="checkout-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={address[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}

          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="ONLINE">Online Payment</option>
          </select>

          {error && <p className="checkout-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <Link to="/cart" className="back-to-cart">
          Back to Cart
        </Link>
      </div>
    </div>
  );
}

export default Checkout;