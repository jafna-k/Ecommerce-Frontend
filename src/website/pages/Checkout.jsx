
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

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
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
      autoComplete: "name",
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "Enter phone number",
      type: "tel",
      autoComplete: "tel",
    },
    {
      name: "address",
      label: "House / Street Address",
      placeholder: "Enter your delivery address",
      type: "text",
      autoComplete: "street-address",
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter your city",
      type: "text",
      autoComplete: "address-level2",
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter your state",
      type: "text",
      autoComplete: "address-level1",
    },
    {
      name: "pincode",
      label: "PIN Code",
      placeholder: "Enter 6-digit PIN code",
      type: "text",
      autoComplete: "postal-code",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-10 text-[#24352e] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#81796d]">
            Dress Shop · Order securely
          </p>

          <h1 className="font-serif text-4xl font-bold text-[#123f32] sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6b7169]">
            Just a few more details before your order is on its way.
          </p>
        </div>

        {/* Checkout layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">

          {/* Delivery form */}
          <section className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center gap-4 border-b border-[#e8dfd2] pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf0e9] text-xl text-[#124536]">
                ♧
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                  Delivery Address
                </h2>
                <p className="mt-1 text-sm text-[#81796d]">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <span className="font-bold">!</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handlePlaceOrder}>
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.name === "address"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-[#24352e]"
                    >
                      {field.label}
                    </label>

                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={address[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      required
                      maxLength={
                        field.name === "pincode" ? 6 : undefined
                      }
                      pattern={
                        field.name === "phone"
                          ? "[0-9+() -]{7,20}"
                          : field.name === "pincode"
                            ? "[0-9]{6}"
                            : undefined
                      }
                      title={
                        field.name === "pincode"
                          ? "Enter a valid 6-digit PIN code"
                          : field.name === "phone"
                            ? "Enter a valid phone number"
                            : undefined
                      }
                      className="w-full rounded-xl border border-[#ded6ca] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#24352e] outline-none transition placeholder:text-[#aaa397] focus:border-[#164d3d] focus:ring-4 focus:ring-[#164d3d]/10"
                    />
                  </div>
                ))}
              </div>

              {/* Payment method */}
              <div className="mt-9 border-t border-[#e8dfd2] pt-7">
                <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                  Payment Method
                </h2>

                <p className="mt-2 text-sm text-[#81796d]">
                  Choose how you would like to pay.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      paymentMethod === "COD"
                        ? "border-[#124536] bg-[#f0f3eb] ring-1 ring-[#124536]"
                        : "border-[#e8dfd2] bg-[#fffdf9] hover:border-[#a9b9aa]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="mt-1 h-4 w-4 accent-[#124536]"
                    />

                    <span>
                      <span className="block font-semibold text-[#123f32]">
                        Cash on Delivery
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#81796d]">
                        Pay when your order arrives.
                      </span>
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      paymentMethod === "ONLINE"
                        ? "border-[#124536] bg-[#f0f3eb] ring-1 ring-[#124536]"
                        : "border-[#e8dfd2] bg-[#fffdf9] hover:border-[#a9b9aa]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === "ONLINE"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="mt-1 h-4 w-4 accent-[#124536]"
                    />

                    <span>
                      <span className="block font-semibold text-[#123f32]">
                        Online Payment
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#81796d]">
                        Online payment option.
                      </span>
                    </span>
                  </label>
                </div>

                {paymentMethod === "ONLINE" && (
                  <p className="mt-3 rounded-lg bg-[#f5f0e5] p-3 text-xs leading-5 text-[#6b7169]">
                    Online payment processing must be configured with
                    your payment gateway before payments can be completed.
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e8dfd2] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/cart"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#ded6ca] px-5 py-3 text-sm font-semibold text-[#124536] transition hover:bg-[#faf7f0]"
                >
                  ← Back to Cart
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#124536] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b3428] focus:outline-none focus:ring-4 focus:ring-[#124536]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Placing Order..." : "Place Order →"}
                </button>
              </div>
            </form>
          </section>

          {/* Helpful side panel */}
          <aside className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm lg:sticky lg:top-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf0e9] text-xl text-[#124536]">
              ✓
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#123f32]">
              Almost there!
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6b7169]">
              Check your delivery details carefully before placing
              your order.
            </p>

            <div className="my-6 border-t border-[#e8dfd2]" />

            <p className="text-sm font-semibold text-[#123f32]">
              Your checkout
            </p>

            <div className="mt-4 space-y-4 text-sm text-[#6b7169]">
              <div className="flex items-start gap-3">
                <span className="text-[#124536]">✓</span>
                <span>Delivery address provided by you</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#124536]">✓</span>
                <span>Choose your preferred payment method</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#124536]">✓</span>
                <span>Review your order before submission</span>
              </div>
            </div>

            <div className="mt-7 rounded-xl bg-[#f5f0e5] p-4">
              <p className="text-sm font-semibold text-[#123f32]">
                Need to change something?
              </p>

              <Link
                to="/cart"
                className="mt-2 inline-block text-sm font-semibold text-[#124536] underline underline-offset-4 hover:text-[#0b3428]"
              >
                Return to your cart
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-[#81796d]">
              Dress Shop · Everyday elegance
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
