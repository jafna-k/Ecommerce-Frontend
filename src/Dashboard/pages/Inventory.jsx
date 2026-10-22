


// import { useCallback, useEffect, useState } from "react";
// import api from "../../services/api";

// function Inventory() {
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [adjustments, setAdjustments] = useState({});
//   const [updatingId, setUpdatingId] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const fetchInventory = useCallback(async () => {
//     try {
//       setError("");

//       const response = await api.get("/admin/inventory");
//       setInventory(response.data.data || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Inventory load cheyyan kazhinjilla"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchInventory();
//   }, [fetchInventory]);

//   useEffect(() => {
//     if (!successMessage && !errorMessage) return;

//     const timer = setTimeout(() => {
//       setSuccessMessage("");
//       setErrorMessage("");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [successMessage, errorMessage]);

//   const handleAdjustment = (id, value) => {
//     setAdjustments((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   const updateStock = async (id) => {
//     const rawAdjustment = adjustments[id];
//     const adjustment = Number(rawAdjustment);

//     setSuccessMessage("");
//     setErrorMessage("");

//     if (
//       rawAdjustment === "" ||
//       rawAdjustment === undefined ||
//       !Number.isInteger(adjustment) ||
//       adjustment === 0
//     ) {
//       setErrorMessage(
//         "Valid stock adjustment enter cheyyuka (+5 or -2)."
//       );
//       return;
//     }

//     try {
//       setUpdatingId(id);

//       await api.patch(`/admin/inventory/${id}/stock`, {
//         adjustment,
//       });

//       setAdjustments((prev) => ({
//         ...prev,
//         [id]: "",
//       }));

//       setSuccessMessage("Stock updated successfully!");

//       await fetchInventory();
//     } catch (err) {
//       setErrorMessage(
//         err.response?.data?.message ||
//           "Stock update cheyyan kazhinjilla"
//       );
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const totalStock = inventory.reduce(
//     (total, item) => total + Number(item.stock || 0),
//     0
//   );

//   const lowStockCount = inventory.filter(
//     (item) => Number(item.stock) <= 5
//   ).length;

//   const inputClass =
//     "w-24 rounded-lg border border-[#ded6ca] bg-white px-2 py-2 text-sm text-[#24352e] outline-none transition placeholder:text-[#a29a8e] focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10";

//   const buttonClass =
//     "inline-flex items-center justify-center gap-2 rounded-lg bg-[#124536] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3428] disabled:cursor-not-allowed disabled:opacity-60";

//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center bg-[#faf7f0]">
//         <div className="text-center">
//           <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#dce5dc] border-t-[#124536]" />
//           <p className="text-sm font-medium text-[#6b7169]">
//             Loading inventory...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#faf7f0] px-4 py-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-[1600px]">

//         {/* Success / Error Toast */}
//         {(successMessage || errorMessage) && (
//           <div
//             role={successMessage ? "status" : "alert"}
//             aria-live="polite"
//             className={`fixed right-4 top-5 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-2xl border bg-[#fffdf9] p-4 shadow-[0_12px_40px_rgba(18,63,50,0.18)] sm:right-6 ${
//               successMessage
//                 ? "border-[#d5e5d6]"
//                 : "border-red-200"
//             }`}
//           >
//             <div
//               className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
//                 successMessage
//                   ? "bg-[#e5efe5] text-[#164d3d]"
//                   : "bg-red-50 text-red-600"
//               }`}
//             >
//               {successMessage ? (
//                 <svg
//                   className="h-6 w-6"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                 >
//                   <path
//                     d="m5 12 4 4L19 6"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="h-6 w-6"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path
//                     d="M12 8v4m0 4h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               )}
//             </div>

//             <div className="min-w-0 flex-1">
//               <p
//                 className={`text-sm font-bold ${
//                   successMessage
//                     ? "text-[#123f32]"
//                     : "text-red-700"
//                 }`}
//               >
//                 {successMessage ? "Stock Updated!" : "Update Failed"}
//               </p>

//               <p className="mt-1 text-xs leading-5 text-[#6b7169]">
//                 {successMessage || errorMessage}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => {
//                 setSuccessMessage("");
//                 setErrorMessage("");
//               }}
//               className="shrink-0 rounded-lg px-2 py-1 text-xl text-[#81796d] transition hover:bg-[#f4f0e7] hover:text-[#123f32]"
//               aria-label="Close notification"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Header */}
//         <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#81796d]">
//               MODEZA / ADMIN
//             </p>

//             <h1 className="text-2xl font-bold tracking-tight text-[#123f32] sm:text-3xl">
//               Inventory Management
//             </h1>

//             <p className="mt-2 text-sm text-[#6b7169] sm:text-base">
//               Manage product stock and inventory levels.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={fetchInventory}
//             className={buttonClass}
//           >
//             <svg
//               className="h-4 w-4"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M20 7v5h-5" />
//               <path d="M4 17v-5h5" />
//               <path d="M5.6 9a7 7 0 0 1 11.5-2L20 12" />
//               <path d="M4 12l2.9 5a7 7 0 0 0 11.5-2" />
//             </svg>
//             Refresh
//           </button>
//         </div>

//         {/* Loading error */}
//         {error && (
//           <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
//             <p>{error}</p>
//             <button
//               type="button"
//               onClick={fetchInventory}
//               className="w-fit font-semibold underline"
//             >
//               Try again
//             </button>
//           </div>
//         )}

//         {/* Summary Cards */}
//         <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//           <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-[#6b7169]">
//                   Total Variants
//                 </p>
//                 <h2 className="mt-3 text-3xl font-bold text-[#123f32]">
//                   {inventory.length}
//                 </h2>
//               </div>

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8efe7] text-[#124536]">
//                 <svg
//                   className="h-6 w-6"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                 >
//                   <path d="m12 3 9 5-9 5-9-5 9-5Z" />
//                   <path d="m3 12 9 5 9-5" />
//                   <path d="m3 16 9 5 9-5" />
//                 </svg>
//               </div>
//             </div>
//             <p className="mt-4 text-xs text-[#81796d]">
//               Products and their variants
//             </p>
//           </div>

//           <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-[#6b7169]">
//                   Total Stock
//                 </p>
//                 <h2 className="mt-3 text-3xl font-bold text-[#123f32]">
//                   {totalStock.toLocaleString("en-IN")}
//                 </h2>
//               </div>

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
//                 <svg
//                   className="h-6 w-6"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                 >
//                   <path d="M5 7h14l1 13H4L5 7Z" />
//                   <path d="M9 9V6a3 3 0 0 1 6 0v3" />
//                 </svg>
//               </div>
//             </div>
//             <p className="mt-4 text-xs text-[#81796d]">
//               Total available units
//             </p>
//           </div>

//           <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-[#6b7169]">
//                   Low Stock Items
//                 </p>
//                 <h2 className="mt-3 text-3xl font-bold text-amber-700">
//                   {lowStockCount}
//                 </h2>
//               </div>

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
//                 <svg
//                   className="h-6 w-6"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                 >
//                   <path d="m12 3 10 18H2L12 3Z" />
//                   <path d="M12 9v5" />
//                   <path d="M12 17h.01" />
//                 </svg>
//               </div>
//             </div>
//             <p className="mt-4 text-xs text-[#81796d]">
//               Items with 5 or fewer units
//             </p>
//           </div>
//         </div>

//         {/* Inventory Table */}
//         <div className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
//           <div className="flex flex-col gap-1 border-b border-[#e8dfd2] px-5 py-4 sm:px-6">
//             <h2 className="text-lg font-bold text-[#123f32]">
//               Stock Inventory
//             </h2>
//             <p className="text-sm text-[#81796d]">
//               Adjust stock quantities quickly and easily.
//             </p>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[950px] border-collapse text-left">
//               <thead className="bg-[#f4f0e7]">
//                 <tr>
//                   {[
//                     "Product",
//                     "Size",
//                     "Color",
//                     "Price",
//                     "Current Stock",
//                     "Status",
//                     "Adjustment",
//                     "Action",
//                   ].map((heading) => (
//                     <th
//                       key={heading}
//                       className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-[#5d665c]"
//                     >
//                       {heading}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#eee7dc]">
//                 {inventory.map((item) => {
//                   const lowStock = Number(item.stock) <= 5;
//                   const isUpdating = updatingId === item._id;

//                   return (
//                     <tr
//                       key={item._id}
//                       className="transition hover:bg-[#faf7f0]/70"
//                     >
//                       <td className="px-4 py-4">
//                         <p className="max-w-48 font-semibold text-[#24352e]">
//                           {item.product?.name || "Product not linked"}
//                         </p>
//                         <p className="mt-1 text-xs text-[#81796d]">
//                           SKU: {item.sku || "N/A"}
//                         </p>
//                       </td>

//                       <td className="px-4 py-4 text-sm text-[#24352e]">
//                         {item.size || "—"}
//                       </td>

//                       <td className="px-4 py-4 text-sm text-[#24352e]">
//                         {item.color || "—"}
//                       </td>

//                       <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#24352e]">
//                         ₹{Number(item.price || 0).toLocaleString("en-IN")}
//                       </td>

//                       <td className="px-4 py-4">
//                         <span className="text-base font-bold text-[#123f32]">
//                           {Number(item.stock || 0)}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4">
//                         <span
//                           className={`inline-flex whitespace-nowrap items-center rounded-full px-3 py-1 text-xs font-semibold ${
//                             lowStock
//                               ? "bg-amber-100 text-amber-800"
//                               : "bg-emerald-100 text-emerald-800"
//                           }`}
//                         >
//                           <span
//                             className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
//                               lowStock
//                                 ? "bg-amber-600"
//                                 : "bg-emerald-600"
//                             }`}
//                           />
//                           {lowStock ? "Low Stock" : "In Stock"}
//                         </span>
//                       </td>

//                       {/* Short adjustment input */}
//                       <td className="px-4 py-4">
//                         <input
//                           className={inputClass}
//                           type="number"
//                           step="1"
//                           value={adjustments[item._id] ?? ""}
//                           placeholder="+5 / -2"
//                           aria-label={`Stock adjustment for ${item.product?.name || item.sku || "item"}`}
//                           onChange={(e) =>
//                             handleAdjustment(item._id, e.target.value)
//                           }
//                         />
//                       </td>

//                       <td className="px-4 py-4">
//                         <button
//                           type="button"
//                           disabled={isUpdating}
//                           onClick={() => updateStock(item._id)}
//                           className={`${buttonClass} min-w-24`}
//                         >
//                           {isUpdating ? (
//                             <>
//                               <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                               Saving...
//                             </>
//                           ) : (
//                             "Update"
//                           )}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {inventory.length === 0 && (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-16 text-center">
//                       <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f0e7] text-[#81796d]">
//                         <svg
//                           className="h-6 w-6"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="1.8"
//                         >
//                           <path d="M5 7h14l1 13H4L5 7Z" />
//                           <path d="M9 9V6a3 3 0 0 1 6 0v3" />
//                         </svg>
//                       </div>

//                       <p className="font-semibold text-[#123f32]">
//                         {error
//                           ? "Inventory could not be loaded"
//                           : "No inventory items found"}
//                       </p>
//                       <p className="mt-1 text-sm text-[#81796d]">
//                         {error
//                           ? "Check the API and try again."
//                           : "Your inventory items will appear here."}
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="border-t border-[#e8dfd2] px-5 py-3 text-xs text-[#81796d] sm:px-6">
//             Showing {inventory.length} inventory variant
//             {inventory.length !== 1 ? "s" : ""}
//           </div>
//         </div>

//         <p className="mt-4 text-xs text-[#81796d]">
//           Tip: Use a positive number to add stock (e.g. +5), or a
//           negative number to reduce stock (e.g. -2).
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Inventory;



import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adjustments, setAdjustments] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchInventory = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/admin/inventory");
      setInventory(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const handleAdjustment = (id, value) => {
    setAdjustments((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateStock = async (id) => {
    const rawAdjustment = adjustments[id];
    const adjustment = Number(rawAdjustment);

    setSuccessMessage("");
    setErrorMessage("");

    if (
      rawAdjustment === "" ||
      rawAdjustment === undefined ||
      !Number.isInteger(adjustment) ||
      adjustment === 0
    ) {
      setErrorMessage(
        "Please enter a valid stock adjustment, such as +5 or -2."
      );
      return;
    }

    try {
      setUpdatingId(id);

      await api.patch(`/admin/inventory/${id}/stock`, {
        adjustment,
      });

      setAdjustments((prev) => ({
        ...prev,
        [id]: "",
      }));

      setSuccessMessage("Stock updated successfully!");

      await fetchInventory();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to update stock."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalStock = inventory.reduce(
    (total, item) => total + Number(item.stock || 0),
    0
  );

  const lowStockCount = inventory.filter(
    (item) => Number(item.stock) <= 5
  ).length;

  const inputClass =
    "w-24 rounded-lg border border-[#ded6ca] bg-white px-2 py-2 text-sm text-[#24352e] outline-none transition placeholder:text-[#a29a8e] focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10";

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#124536] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3428] disabled:cursor-not-allowed disabled:opacity-60";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#faf7f0]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#dce5dc] border-t-[#124536]" />
          <p className="text-sm font-medium text-[#6b7169]">
            Loading inventory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f0] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        {/* Success and error notifications */}
        {(successMessage || errorMessage) && (
          <div
            role={successMessage ? "status" : "alert"}
            aria-live="polite"
            className={`fixed right-4 top-5 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-2xl border bg-[#fffdf9] p-4 shadow-[0_12px_40px_rgba(18,63,50,0.18)] sm:right-6 ${
              successMessage
                ? "border-[#d5e5d6]"
                : "border-red-200"
            }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                successMessage
                  ? "bg-[#e5efe5] text-[#164d3d]"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {successMessage ? (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 8v4m0 4h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-bold ${
                  successMessage
                    ? "text-[#123f32]"
                    : "text-red-700"
                }`}
              >
                {successMessage ? "Stock Updated!" : "Update Failed"}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#6b7169]">
                {successMessage || errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccessMessage("");
                setErrorMessage("");
              }}
              className="shrink-0 rounded-lg px-2 py-1 text-xl text-[#81796d] transition hover:bg-[#f4f0e7] hover:text-[#123f32]"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        )}

        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#81796d]">
              MODEZA / ADMIN
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#123f32] sm:text-3xl">
              Inventory Management
            </h1>

            <p className="mt-2 text-sm text-[#6b7169] sm:text-base">
              Manage product stock and inventory levels.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchInventory}
            className={buttonClass}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 7v5h-5" />
              <path d="M4 17v-5h5" />
              <path d="M5.6 9a7 7 0 0 1 11.5-2L20 12" />
              <path d="M4 12l2.9 5a7 7 0 0 0 11.5-2" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Inventory loading error */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchInventory}
              className="w-fit font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7169]">
                  Total Variants
                </p>
                <h2 className="mt-3 text-3xl font-bold text-[#123f32]">
                  {inventory.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8efe7] text-[#124536]">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                  <path d="m3 12 9 5 9-5" />
                  <path d="m3 16 9 5 9-5" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#81796d]">
              Products and their variants
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7169]">
                  Total Stock
                </p>
                <h2 className="mt-3 text-3xl font-bold text-[#123f32]">
                  {totalStock.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 7h14l1 13H4L5 7Z" />
                  <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#81796d]">
              Total available units
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6b7169]">
                  Low Stock Items
                </p>
                <h2 className="mt-3 text-3xl font-bold text-amber-700">
                  {lowStockCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="m12 3 10 18H2L12 3Z" />
                  <path d="M12 9v5" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#81796d]">
              Items with 5 or fewer units
            </p>
          </div>
        </div>

        {/* Inventory table */}
        <div className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
          <div className="flex flex-col gap-1 border-b border-[#e8dfd2] px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#123f32]">
              Stock Inventory
            </h2>
            <p className="text-sm text-[#81796d]">
              Adjust stock quantities quickly and easily.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead className="bg-[#f4f0e7]">
                <tr>
                  {[
                    "Product",
                    "Size",
                    "Color",
                    "Price",
                    "Current Stock",
                    "Status",
                    "Adjustment",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-[#5d665c]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee7dc]">
                {inventory.map((item) => {
                  const lowStock = Number(item.stock) <= 5;
                  const isUpdating = updatingId === item._id;

                  return (
                    <tr
                      key={item._id}
                      className="transition hover:bg-[#faf7f0]/70"
                    >
                      <td className="px-4 py-4">
                        <p className="max-w-48 font-semibold text-[#24352e]">
                          {item.product?.name || "Product not linked"}
                        </p>
                        <p className="mt-1 text-xs text-[#81796d]">
                          SKU: {item.sku || "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-[#24352e]">
                        {item.size || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#24352e]">
                        {item.color || "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#24352e]">
                        ₹{Number(item.price || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-base font-bold text-[#123f32]">
                          {Number(item.stock || 0)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                            lowStock
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              lowStock
                                ? "bg-amber-600"
                                : "bg-emerald-600"
                            }`}
                          />
                          {lowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      {/* Stock adjustment input */}
                      <td className="px-4 py-4">
                        <input
                          className={inputClass}
                          type="number"
                          step="1"
                          value={adjustments[item._id] ?? ""}
                          placeholder="+5 / -2"
                          aria-label={`Stock adjustment for ${
                            item.product?.name || item.sku || "item"
                          }`}
                          onChange={(event) =>
                            handleAdjustment(item._id, event.target.value)
                          }
                        />
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateStock(item._id)}
                          className={`${buttonClass} min-w-24`}
                        >
                          {isUpdating ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Saving...
                            </>
                          ) : (
                            "Update"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {inventory.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f0e7] text-[#81796d]">
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M5 7h14l1 13H4L5 7Z" />
                          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                        </svg>
                      </div>

                      <p className="font-semibold text-[#123f32]">
                        {error
                          ? "Inventory could not be loaded"
                          : "No inventory items found"}
                      </p>
                      <p className="mt-1 text-sm text-[#81796d]">
                        {error
                          ? "Check the API connection and try again."
                          : "Your inventory items will appear here."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#e8dfd2] px-5 py-3 text-xs text-[#81796d] sm:px-6">
            Showing {inventory.length} inventory variant
            {inventory.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Stock adjustment instructions */}
        <p className="mt-4 text-xs text-[#81796d]">
          Tip: Enter a positive number to add stock (e.g. +5), or a
          negative number to reduce stock (e.g. -2).
        </p>
      </div>
    </div>
  );
}

export default Inventory;
