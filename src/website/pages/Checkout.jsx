
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../../services/api";

// function Checkout() {
//   const navigate = useNavigate();

//   const [address, setAddress] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setLoading(true);

//       const response = await api.post("/order", {
//         shippingAddress: address,
//         paymentMethod,
//       });

//       console.log("ORDER CREATED:", response.data);
//       alert("Order placed successfully!");
//       navigate("/orders");
//     } catch (err) {
//       console.error("PLACE ORDER ERROR:", err);
//       setError(
//         err.response?.data?.message || "Failed to place order"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fields = [
//     {
//       name: "name",
//       label: "Full Name",
//       placeholder: "Enter your full name",
//       type: "text",
//       autoComplete: "name",
//     },
//     {
//       name: "phone",
//       label: "Phone Number",
//       placeholder: "Enter phone number",
//       type: "tel",
//       autoComplete: "tel",
//     },
//     {
//       name: "address",
//       label: "House / Street Address",
//       placeholder: "Enter your delivery address",
//       type: "text",
//       autoComplete: "street-address",
//     },
//     {
//       name: "city",
//       label: "City",
//       placeholder: "Enter your city",
//       type: "text",
//       autoComplete: "address-level2",
//     },
//     {
//       name: "state",
//       label: "State",
//       placeholder: "Enter your state",
//       type: "text",
//       autoComplete: "address-level1",
//     },
//     {
//       name: "pincode",
//       label: "PIN Code",
//       placeholder: "Enter 6-digit PIN code",
//       type: "text",
//       autoComplete: "postal-code",
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-[#faf7f0] px-4 py-10 text-[#24352e] sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-6xl">

//         {/* Header */}
//         <div className="mb-8">
//           <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#81796d]">
//             Dress Shop · Order securely
//           </p>

//           <h1 className="font-serif text-4xl font-bold text-[#123f32] sm:text-5xl">
//             Checkout
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-[#6b7169]">
//             Just a few more details before your order is on its way.
//           </p>
//         </div>

//         {/* Checkout layout */}
//         <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">

//           {/* Delivery form */}
//           <section className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-8">
//             <div className="mb-7 flex items-center gap-4 border-b border-[#e8dfd2] pb-5">
//               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf0e9] text-xl text-[#124536]">
//                 ♧
//               </div>

//               <div>
//                 <h2 className="font-serif text-2xl font-bold text-[#123f32]">
//                   Delivery Address
//                 </h2>
//                 <p className="mt-1 text-sm text-[#81796d]">
//                   Where should we deliver your order?
//                 </p>
//               </div>
//             </div>

//             {error && (
//               <div
//                 role="alert"
//                 className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//               >
//                 <span className="font-bold">!</span>
//                 <p>{error}</p>
//               </div>
//             )}

//             <form onSubmit={handlePlaceOrder}>
//               <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
//                 {fields.map((field) => (
//                   <div
//                     key={field.name}
//                     className={
//                       field.name === "address"
//                         ? "sm:col-span-2"
//                         : ""
//                     }
//                   >
//                     <label
//                       htmlFor={field.name}
//                       className="mb-2 block text-sm font-semibold text-[#24352e]"
//                     >
//                       {field.label}
//                     </label>

//                     <input
//                       id={field.name}
//                       name={field.name}
//                       type={field.type}
//                       value={address[field.name]}
//                       onChange={handleChange}
//                       placeholder={field.placeholder}
//                       autoComplete={field.autoComplete}
//                       required
//                       maxLength={
//                         field.name === "pincode" ? 6 : undefined
//                       }
//                       pattern={
//                         field.name === "phone"
//                           ? "[0-9+() -]{7,20}"
//                           : field.name === "pincode"
//                             ? "[0-9]{6}"
//                             : undefined
//                       }
//                       title={
//                         field.name === "pincode"
//                           ? "Enter a valid 6-digit PIN code"
//                           : field.name === "phone"
//                             ? "Enter a valid phone number"
//                             : undefined
//                       }
//                       className="w-full rounded-xl border border-[#ded6ca] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#24352e] outline-none transition placeholder:text-[#aaa397] focus:border-[#164d3d] focus:ring-4 focus:ring-[#164d3d]/10"
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Payment method */}
//               <div className="mt-9 border-t border-[#e8dfd2] pt-7">
//                 <h2 className="font-serif text-2xl font-bold text-[#123f32]">
//                   Payment Method
//                 </h2>

//                 <p className="mt-2 text-sm text-[#81796d]">
//                   Choose how you would like to pay.
//                 </p>

//                 <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <label
//                     className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
//                       paymentMethod === "COD"
//                         ? "border-[#124536] bg-[#f0f3eb] ring-1 ring-[#124536]"
//                         : "border-[#e8dfd2] bg-[#fffdf9] hover:border-[#a9b9aa]"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="COD"
//                       checked={paymentMethod === "COD"}
//                       onChange={(e) =>
//                         setPaymentMethod(e.target.value)
//                       }
//                       className="mt-1 h-4 w-4 accent-[#124536]"
//                     />

//                     <span>
//                       <span className="block font-semibold text-[#123f32]">
//                         Cash on Delivery
//                       </span>
//                       <span className="mt-1 block text-xs leading-5 text-[#81796d]">
//                         Pay when your order arrives.
//                       </span>
//                     </span>
//                   </label>

//                   <label
//                     className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
//                       paymentMethod === "ONLINE"
//                         ? "border-[#124536] bg-[#f0f3eb] ring-1 ring-[#124536]"
//                         : "border-[#e8dfd2] bg-[#fffdf9] hover:border-[#a9b9aa]"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="ONLINE"
//                       checked={paymentMethod === "ONLINE"}
//                       onChange={(e) =>
//                         setPaymentMethod(e.target.value)
//                       }
//                       className="mt-1 h-4 w-4 accent-[#124536]"
//                     />

//                     <span>
//                       <span className="block font-semibold text-[#123f32]">
//                         Online Payment
//                       </span>
//                       <span className="mt-1 block text-xs leading-5 text-[#81796d]">
//                         Online payment option.
//                       </span>
//                     </span>
//                   </label>
//                 </div>

//                 {paymentMethod === "ONLINE" && (
//                   <p className="mt-3 rounded-lg bg-[#f5f0e5] p-3 text-xs leading-5 text-[#6b7169]">
//                     Online payment processing must be configured with
//                     your payment gateway before payments can be completed.
//                   </p>
//                 )}
//               </div>

//               {/* Buttons */}
//               <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e8dfd2] pt-6 sm:flex-row sm:items-center sm:justify-between">
//                 <Link
//                   to="/cart"
//                   className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#ded6ca] px-5 py-3 text-sm font-semibold text-[#124536] transition hover:bg-[#faf7f0]"
//                 >
//                   ← Back to Cart
//                 </Link>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#124536] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b3428] focus:outline-none focus:ring-4 focus:ring-[#124536]/20 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {loading ? "Placing Order..." : "Place Order →"}
//                 </button>
//               </div>
//             </form>
//           </section>

//           {/* Helpful side panel */}
//           <aside className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-sm lg:sticky lg:top-6">
//             <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf0e9] text-xl text-[#124536]">
//               ✓
//             </div>

//             <h2 className="font-serif text-2xl font-bold text-[#123f32]">
//               Almost there!
//             </h2>

//             <p className="mt-3 text-sm leading-7 text-[#6b7169]">
//               Check your delivery details carefully before placing
//               your order.
//             </p>

//             <div className="my-6 border-t border-[#e8dfd2]" />

//             <p className="text-sm font-semibold text-[#123f32]">
//               Your checkout
//             </p>

//             <div className="mt-4 space-y-4 text-sm text-[#6b7169]">
//               <div className="flex items-start gap-3">
//                 <span className="text-[#124536]">✓</span>
//                 <span>Delivery address provided by you</span>
//               </div>

//               <div className="flex items-start gap-3">
//                 <span className="text-[#124536]">✓</span>
//                 <span>Choose your preferred payment method</span>
//               </div>

//               <div className="flex items-start gap-3">
//                 <span className="text-[#124536]">✓</span>
//                 <span>Review your order before submission</span>
//               </div>
//             </div>

//             <div className="mt-7 rounded-xl bg-[#f5f0e5] p-4">
//               <p className="text-sm font-semibold text-[#123f32]">
//                 Need to change something?
//               </p>

//               <Link
//                 to="/cart"
//                 className="mt-2 inline-block text-sm font-semibold text-[#124536] underline underline-offset-4 hover:text-[#0b3428]"
//               >
//                 Return to your cart
//               </Link>
//             </div>

//             <p className="mt-6 text-center text-xs text-[#81796d]">
//               Dress Shop · Everyday elegance
//             </p>
//           </aside>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default Checkout;



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
      placeholder: "Enter your complete delivery address",
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
      placeholder: "6-digit PIN code",
      type: "text",
      autoComplete: "postal-code",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-10 text-[#263a30] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b806f]">
            <span className="h-px w-8 bg-[#b8a88d]" />
            MODEZA
            <span className="text-[#c6bca9]">/</span>
            Secure Checkout
          </div>

          <h1 className="font-serif text-4xl font-medium tracking-tight text-[#123f32] sm:text-5xl lg:text-6xl">
            Complete your order<span className="text-[#b19a70]">.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#77796e] sm:text-base">
            A few final details, and your favourite pieces will be
            on their way to you.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-medium text-[#68756a]">
            <span className="flex items-center gap-2 rounded-full border border-[#e5ddcf] bg-[#fffdf9] px-4 py-2">
              <span className="text-[#164d3d]">01</span>
              Delivery
            </span>
            <span className="h-px w-6 bg-[#d9cebb]" />
            <span className="flex items-center gap-2 rounded-full border border-[#164d3d] bg-[#164d3d] px-4 py-2 text-white">
              <span>02</span>
              Payment
            </span>
            <span className="h-px w-6 bg-[#d9cebb]" />
            <span className="rounded-full border border-[#e5ddcf] px-4 py-2">
              03 Confirmation
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* Main Checkout Form */}
          <section className="overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] shadow-[0_12px_45px_rgba(40,55,42,0.045)]">

            {/* Delivery Heading */}
            <div className="border-b border-[#eee7db] px-5 py-6 sm:px-8 sm:py-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf0e9] text-[#164d3d]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5.5 9v11h13V9M9 20v-6h6v6" />
                  </svg>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a08e70]">
                    Step 01
                  </p>
                  <h2 className="font-serif text-2xl font-medium text-[#123f32] sm:text-3xl">
                    Delivery address
                  </h2>
                  <p className="mt-1 text-sm text-[#888679]">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="p-5 sm:p-8">

              {error && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                    !
                  </span>
                  <p>{error}</p>
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#314438]">
                  Personal & delivery details
                </h3>
                <span className="text-xs text-[#9a9385]">
                  * Required fields
                </span>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.name === "address" ? "sm:col-span-2" : ""
                    }
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
                      className="w-full rounded-xl border border-[#e4ddd1] bg-[#fffefa] px-4 py-3.5 text-sm text-[#263a30] outline-none transition duration-200 placeholder:text-[#b0aa9e] hover:border-[#c7cabb] focus:border-[#164d3d] focus:bg-white focus:ring-4 focus:ring-[#164d3d]/10"
                    />
                  </div>
                ))}
              </div>

              {/* Payment Selection */}
              <div className="mt-9 border-t border-[#eee7db] pt-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf0e9] text-[#164d3d]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 10h18M7 15h3" />
                    </svg>
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
                  Choose your preferred way to pay for your order.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* COD */}
                  <label
                    className={`relative flex cursor-pointer gap-3 rounded-2xl border p-5 transition duration-200 ${
                      paymentMethod === "COD"
                        ? "border-[#164d3d] bg-[#f1f4ed] ring-1 ring-[#164d3d]"
                        : "border-[#e8dfd2] bg-[#fffdf9] hover:border-[#a9b9aa]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 h-4 w-4 accent-[#164d3d]"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 font-semibold text-[#123f32]">
                        Cash on Delivery
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-[#7b8075]">
                        Pay when your order arrives at your doorstep.
                      </span>
                      <span className="mt-3 inline-flex rounded-full bg-[#e1eadd] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#245440]">
                        Pay on arrival
                      </span>
                    </span>
                    {paymentMethod === "COD" && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#164d3d] text-xs text-white">
                        ✓
                      </span>
                    )}
                  </label>

                  {/* Online */}
                  <label
                    className={`relative flex cursor-pointer gap-3 rounded-2xl border p-5 transition duration-200 ${
                      paymentMethod === "ONLINE"
                        ? "border-[#164d3d] bg-[#f1f4ed] ring-1 ring-[#164d3d]"
                        : "border-[#e8dfd2] bg-[#fffdf9] hover:border-[#a9b9aa]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === "ONLINE"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 h-4 w-4 accent-[#164d3d]"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="font-semibold text-[#123f32]">
                        Online Payment
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-[#7b8075]">
                        Pay electronically using a supported payment gateway.
                      </span>
                      <span className="mt-3 inline-flex rounded-full bg-[#f0e9dc] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#806844]">
                        Digital payment
                      </span>
                    </span>
                    {paymentMethod === "ONLINE" && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#164d3d] text-xs text-white">
                        ✓
                      </span>
                    )}
                  </label>
                </div>

                {paymentMethod === "ONLINE" && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#eadcc2] bg-[#faf4e8] p-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eee1c9] text-sm text-[#856a3f]">
                      i
                    </span>
                    <p className="text-xs leading-5 text-[#796c55]">
                      Online payments require a configured payment gateway.
                      Selecting this option alone does not process a payment.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#eee7db] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/cart"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#ddd5c8] px-5 py-3 text-sm font-semibold text-[#365445] transition hover:border-[#164d3d] hover:bg-[#f7f5ee]"
                >
                  <span className="mr-2">←</span>
                  Back to cart
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#164d3d] px-7 py-3 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(18,63,50,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#10392d] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#164d3d]/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Placing order...
                    </>
                  ) : (
                    <>
                      Place order
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Right Side Panel */}
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
                  Your next favourite piece is just one step away.
                  Review your details before placing your order.
                </p>

                <div className="mt-7 border-t border-white/15 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d1c4a8]">
                    Your checkout
                  </p>

                  <div className="mt-5 space-y-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-[#e1d2b2]">
                        1
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Delivery details
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#c5d2c7]">
                          Your address and contact information.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-[#e1d2b2]">
                        2
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Payment preference
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#c5d2c7]">
                          Select your preferred payment method.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-[#e1d2b2]">
                        3
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Order confirmation
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#c5d2c7]">
                          Review your order after submission.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-[#0e352a] px-6 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5 shrink-0 text-[#d4c4a2]"
                    aria-hidden="true"
                  >
                    <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.5 7.5 9.5 4.3-2 7.5-5 7.5-9.5V6L12 3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <p className="text-xs leading-5 text-[#d1ddd3]">
                    Your details are used to process your order.
                  </p>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="mt-5 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5">
              <p className="text-sm font-bold text-[#123f32]">
                Need to change something?
              </p>

              <p className="mt-2 text-xs leading-5 text-[#858477]">
                You can return to your cart to review the items in your order.
              </p>

              <Link
                to="/cart"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#164d3d] transition hover:text-[#9a8055]"
              >
                Return to cart
                <span>→</span>
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





