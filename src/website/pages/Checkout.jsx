
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const EMPTY_ADDRESS = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const fields = [
  { name: "name", label: "Full Name", type: "text", placeholder: "Enter your full name", autoComplete: "name" },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "Enter phone number", autoComplete: "tel" },
  { name: "address", label: "House / Street Address", type: "text", placeholder: "Enter your complete address", autoComplete: "street-address" },
  { name: "city", label: "City", type: "text", placeholder: "Enter your city", autoComplete: "address-level2" },
  { name: "state", label: "State", type: "text", placeholder: "Enter your state", autoComplete: "address-level1" },
  { name: "pincode", label: "PIN Code", type: "text", placeholder: "6-digit PIN code", autoComplete: "postal-code" },
];

function Checkout() {
  const navigate = useNavigate();

  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [originalAddress, setOriginalAddress] = useState(EMPTY_ADDRESS);
  const [addressId, setAddressId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const loadAddress = async () => {
      try {
        const response = await api.get("/address");
        const addresses = Array.isArray(response.data)
          ? response.data
          : [];

        const saved = addresses[0];

        if (!active) return;

        if (saved) {
          const details = {
            name: saved.name || "",
            phone: saved.phone || "",
            address: saved.address || "",
            city: saved.city || "",
            state: saved.state || "",
            pincode: saved.pincode || "",
          };

          setAddressId(saved._id);
          setAddress(details);
          setOriginalAddress(details);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load saved customer details."
          );
        }
      } finally {
        if (active) setAddressLoading(false);
      }
    };

    loadAddress();

    return () => {
      active = false;
    };
  }, []);

  // Click any saved field to enable editing.
  const handleFieldFocus = () => {
    if (addressId && !editingAddress) {
      setEditingAddress(true);
      setError("");
      setSuccess("");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateAddress = () => {
    if (!address.name.trim()) return "Please enter your full name.";

    if (!/^[0-9+() -]{7,20}$/.test(address.phone.trim())) {
      return "Please enter a valid phone number.";
    }

    if (!address.address.trim()) {
      return "Please enter your delivery address.";
    }

    if (!address.city.trim()) return "Please enter your city.";
    if (!address.state.trim()) return "Please enter your state.";

    if (!/^[0-9]{6}$/.test(address.pincode.trim())) {
      return "Please enter a valid 6-digit PIN code.";
    }

    return "";
  };

  // Save customer details independently.
  const handleSaveAddress = async () => {
    const validationError = validateAddress();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      let saved;

      if (addressId) {
        const response = await api.put(
          `/address/${addressId}`,
          address
        );
        saved = response.data;
      } else {
        const response = await api.post("/address", address);
        saved = response.data;

        if (!saved?._id) {
          throw new Error("Address could not be saved.");
        }

        setAddressId(saved._id);
      }

      const updated = {
        name: saved?.name ?? address.name,
        phone: saved?.phone ?? address.phone,
        address: saved?.address ?? address.address,
        city: saved?.city ?? address.city,
        state: saved?.state ?? address.state,
        pincode: saved?.pincode ?? address.pincode,
      };

      setAddress(updated);
      setOriginalAddress(updated);
      setEditingAddress(false);
      setSuccess("Customer details updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save customer details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEditing = () => {
    setAddress(originalAddress);
    setEditingAddress(false);
    setError("");
    setSuccess("");
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (editingAddress) {
      setError("Please save or cancel your changes before placing the order.");
      return;
    }

    const validationError = validateAddress();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (paymentMethod === "ONLINE") {
      setError(
        "Online payment gateway is not configured yet. Please select Cash on Delivery."
      );
      return;
    }

    try {
      setLoading(true);

      // Save the address first if this is the customer's first checkout.
      if (!addressId) {
        const response = await api.post("/address", address);

        if (!response.data?._id) {
          throw new Error("Could not save your delivery address.");
        }

        setAddressId(response.data._id);
        setOriginalAddress(address);
      } else {
        // Ensure the latest details are saved before creating the order.
        await api.put(`/address/${addressId}`, address);
        setOriginalAddress(address);
      }

      await api.post("/order", {
        shippingAddress: address,
        paymentMethod,
      });

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-10 text-[#263a30] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b806f]">
            <span className="h-px w-8 bg-[#b8a88d]" />
            MODEZA <span className="text-[#c6bca9]">/</span> Secure Checkout
          </div>

          <h1 className="font-serif text-4xl font-medium tracking-tight text-[#123f32] sm:text-5xl lg:text-6xl">
            Complete your order
            <span className="text-[#b19a70]">.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#77796e] sm:text-base">
            A few final details, and your favourite pieces will be on their way to you.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-medium text-[#68756a]">
            <span className="rounded-full border border-[#164d3d] bg-[#164d3d] px-4 py-2 text-white">
              01 Delivery
            </span>
            <span className="h-px w-6 bg-[#d9cebb]" />
            <span className="rounded-full border border-[#e5ddcf] bg-[#fffdf9] px-4 py-2">
              02 Payment
            </span>
            <span className="h-px w-6 bg-[#d9cebb]" />
            <span className="rounded-full border border-[#e5ddcf] px-4 py-2">
              03 Confirmation
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] shadow-[0_12px_45px_rgba(40,55,42,0.045)]">
            <div className="border-b border-[#eee7db] px-5 py-6 sm:px-8 sm:py-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf0e9] text-xl text-[#164d3d]">
                  ⌂
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a08e70]">
                    Step 01
                  </p>
                  <h2 className="font-serif text-2xl font-medium text-[#123f32] sm:text-3xl">
                    Delivery details
                  </h2>
                  <p className="mt-1 text-sm text-[#888679]">
                    Click any detail to edit it.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="p-5 sm:p-8">
              {error && (
                <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div role="status" className="mb-5 rounded-xl border border-[#dce7da] bg-[#f1f5ed] px-4 py-3 text-sm text-[#164d3d]">
                  {success}
                </div>
              )}

              {addressLoading && (
                <p className="mb-5 text-sm text-[#77796e]">
                  Loading your saved details...
                </p>
              )}

              {!addressLoading && addressId && (
                <div className="mb-6 rounded-2xl border border-[#dce7da] bg-[#f1f5ed] p-4">
                  <p className="text-sm font-semibold text-[#164d3d]">
                    ✓ Saved customer details
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#68756a]">
                    {editingAddress
                      ? "Edit any field and select Save Changes."
                      : "Click any name, phone number, or address field to start editing."}
                  </p>
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#314438]">
                  Personal & delivery information
                </h3>
                <span className="text-xs text-[#9a9385]">* Required</span>
              </div>

              <fieldset
                disabled={addressLoading || loading}
                className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2"
              >
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.name === "address" ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-xs font-bold tracking-wide text-[#394a3d]"
                    >
                      {field.label}
                      <span className="ml-1 text-[#a88e61]">*</span>
                    </label>

                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={address[field.name]}
                      onChange={handleChange}
                      onFocus={() => {
                        if (addressId && !editingAddress) {
                          setEditingAddress(true);
                          setError("");
                          setSuccess("");
                        }
                      }}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      required
                      maxLength={
                        field.name === "pincode"
                          ? 6
                          : field.name === "phone"
                            ? 20
                            : undefined
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
                      className="w-full rounded-xl border border-[#e4ddd1] bg-[#fffefa] px-4 py-3.5 text-sm text-[#263a30] outline-none transition placeholder:text-[#b0aa9e] hover:border-[#c7cabb] focus:border-[#164d3d] focus:ring-4 focus:ring-[#164d3d]/10"
                    />
                  </div>
                ))}
              </fieldset>

              {editingAddress && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    disabled={loading}
                    className="rounded-xl bg-[#164d3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10392d] disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                  {addressId && (
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      disabled={loading}
                      className="rounded-xl border border-[#ddd5c8] px-6 py-3 text-sm font-semibold text-[#365445] transition hover:bg-[#f7f5ee] disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}

              <div className="mt-9 border-t border-[#eee7db] pt-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf0e9] text-lg text-[#164d3d]">
                    ▤
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a08e70]">
                      Step 02
                    </p>
                    <h2 className="font-serif text-2xl font-medium text-[#123f32] sm:text-3xl">
                      Payment method
                    </h2>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-[#888679]">
                  Choose your preferred way to pay.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className={`flex cursor-pointer gap-3 rounded-2xl border p-5 transition ${paymentMethod === "COD" ? "border-[#164d3d] bg-[#f1f4ed] ring-1 ring-[#164d3d]" : "border-[#e8dfd2] bg-[#fffdf9] hover:border-[#a9b9aa]"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 h-4 w-4 accent-[#164d3d]"
                    />
                    <span>
                      <span className="font-semibold text-[#123f32]">Cash on Delivery</span>
                      <span className="mt-2 block text-xs leading-5 text-[#7b8075]">
                        Pay when your order arrives.
                      </span>
                    </span>
                  </label>

                  <label className={`flex cursor-pointer gap-3 rounded-2xl border p-5 transition ${paymentMethod === "ONLINE" ? "border-[#164d3d] bg-[#f1f4ed] ring-1 ring-[#164d3d]" : "border-[#e8dfd2] bg-[#fffdf9] hover:border-[#a9b9aa]"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === "ONLINE"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 h-4 w-4 accent-[#164d3d]"
                    />
                    <span>
                      <span className="font-semibold text-[#123f32]">Online Payment</span>
                      <span className="mt-2 block text-xs leading-5 text-[#7b8075]">
                        Digital payment through a configured gateway.
                      </span>
                    </span>
                  </label>
                </div>

                {paymentMethod === "ONLINE" && (
                  <p className="mt-4 rounded-xl border border-[#eadcc2] bg-[#faf4e8] p-4 text-xs leading-5 text-[#796c55]">
                    Online payment gateway must be configured before online payments can be processed.
                  </p>
                )}
              </div>

              <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#eee7db] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/cart"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#ddd5c8] px-5 py-3 text-sm font-semibold text-[#365445] transition hover:border-[#164d3d] hover:bg-[#f7f5ee]"
                >
                  ← Back to cart
                </Link>

                <button
                  type="submit"
                  disabled={loading || addressLoading || editingAddress}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#164d3d] px-7 py-3 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(18,63,50,0.16)] transition hover:bg-[#10392d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Processing..." : "Place order →"}
                </button>
              </div>
            </form>
          </section>

          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-3xl bg-[#123f32] text-white shadow-[0_16px_40px_rgba(18,63,50,0.14)]">
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d1c4a8]">
                    MODEZA
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-[#d6c6a4]">
                    ♡
                  </span>
                </div>

                <h2 className="mt-7 font-serif text-3xl font-medium leading-tight">
                  Thoughtful style,
                  <br />
                  delivered to you.
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#d1ddd3]">
                  Review your delivery details before placing your order.
                </p>

                <div className="mt-7 space-y-5 border-t border-white/15 pt-5">
                  {[
                    ["1", "Delivery details", "Review your saved address."],
                    ["2", "Payment preference", "Choose your payment method."],
                    ["3", "Order confirmation", "Review your order after submission."],
                  ].map(([number, title, description]) => (
                    <div key={number} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-[#e1d2b2]">
                        {number}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-[#c5d2c7]">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 bg-[#0e352a] px-6 py-4 sm:px-7">
                <p className="text-xs leading-5 text-[#d1ddd3]">
                  Your saved details can be reused for future checkouts.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5">
              <p className="text-sm font-bold text-[#123f32]">Need to change something?</p>
              <p className="mt-2 text-xs leading-5 text-[#858477]">
                Return to your cart to review your order items.
              </p>
              <Link
                to="/cart"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#164d3d] transition hover:text-[#9a8055]"
              >
                Return to cart →
              </Link>
            </div>

            <p className="mt-5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#a39a89]">
              MODEZA · Everyday elegance
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
