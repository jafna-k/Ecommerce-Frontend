

// import { useCallback, useEffect, useState } from "react";
// import api from "../../services/api";

// const initialForm = {
//   product: "",
//   size: "",
//   color: "",
//   price: "",
//   stock: "0",
//   sku: "",
// };

// const money = (value) =>
//   `₹${Number(value || 0).toLocaleString("en-IN")}`;

// export default function AdminProductVariants() {
//   const [variants, setVariants] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [toast, setToast] = useState(null);

//   // Display a notification and automatically hide it after three seconds.
//   const showToast = (message, type = "success") => {
//     setToast({ message, type });

//     setTimeout(() => {
//       setToast(null);
//     }, 3000);
//   };

//   // Fetch product variants and products from the backend.
//   const loadData = useCallback(async () => {
//     setLoading(true);

//     try {
//       const [variantResponse, productResponse] = await Promise.all([
//         api.get("/productvariant"),
//         api.get("/product"),
//       ]);

//       const variantData = variantResponse.data;
//       const productData = productResponse.data;

//       setVariants(
//         Array.isArray(variantData)
//           ? variantData
//           : variantData?.data || variantData?.variants || []
//       );

//       setProducts(
//         Array.isArray(productData)
//           ? productData
//           : productData?.data || productData?.products || []
//       );
//     } catch (error) {
//       showToast(
//         error.response?.data?.message ||
//           "Failed to load products and variants.",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   // Update the form whenever an input value changes.
//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // Clear the form and exit edit mode.
//   const resetForm = () => {
//     setForm(initialForm);
//     setEditingId(null);
//   };

//   // Validate the form and create or update a product variant.
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (
//       !form.product ||
//       !form.size ||
//       !form.color.trim() ||
//       !form.sku.trim()
//     ) {
//       showToast("Please complete all required fields.", "error");
//       return;
//     }

//     const price = Number(form.price);
//     const stock = Number(form.stock);

//     if (
//       form.price === "" ||
//       !Number.isFinite(price) ||
//       price < 0
//     ) {
//       showToast("Please enter a valid price.", "error");
//       return;
//     }

//     if (
//       form.stock === "" ||
//       !Number.isInteger(stock) ||
//       stock < 0
//     ) {
//       showToast(
//         "Stock must be a non-negative whole number.",
//         "error"
//       );
//       return;
//     }

//     const payload = {
//       product: form.product,
//       size: form.size.trim(),
//       color: form.color.trim(),
//       price,
//       stock,
//       sku: form.sku.trim(),
//     };

//     setSaving(true);

//     try {
//       if (editingId) {
//         await api.put(`/productvariant/${editingId}`, payload);
//         showToast("Product variant updated successfully.");
//       } else {
//         await api.post("/productvariant", payload);
//         showToast("Product variant added successfully.");
//       }

//       resetForm();
//       await loadData();
//     } catch (error) {
//       showToast(
//         error.response?.data?.message ||
//           "Failed to save the product variant.",
//         "error"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Load the selected variant details into the form for editing.
//   const handleEdit = (variant) => {
//     setEditingId(variant._id);

//     setForm({
//       product:
//         typeof variant.product === "object"
//           ? variant.product?._id || ""
//           : variant.product || "",
//       size: variant.size || "",
//       color: variant.color || "",
//       price: String(variant.price ?? ""),
//       stock: String(variant.stock ?? 0),
//       sku: variant.sku || "",
//     });

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Open the confirmation dialog before deleting a variant.
//   const handleDeleteClick = (variant) => {
//     setDeleteTarget(variant);
//   };

//   // Delete the selected variant only after confirmation.
//   const confirmDelete = async () => {
//     if (!deleteTarget?._id) return;

//     setDeleting(true);

//     try {
//       await api.delete(`/productvariant/${deleteTarget._id}`);

//       setVariants((previous) =>
//         previous.filter(
//           (variant) => variant._id !== deleteTarget._id
//         )
//       );

//       if (editingId === deleteTarget._id) {
//         resetForm();
//       }

//       setDeleteTarget(null);
//       showToast("Product variant deleted successfully.");
//     } catch (error) {
//       showToast(
//         error.response?.data?.message ||
//           "Failed to delete the product variant.",
//         "error"
//       );
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // Filter variants by product name, size, color, or SKU.
//   const filteredVariants = variants.filter((variant) => {
//     const productName =
//       typeof variant.product === "object"
//         ? variant.product?.name || ""
//         : products.find(
//             (product) => product._id === variant.product
//           )?.name || "";

//     const searchText = [
//       productName,
//       variant.size,
//       variant.color,
//       variant.sku,
//     ]
//       .join(" ")
//       .toLowerCase();

//     return searchText.includes(search.toLowerCase());
//   });

//   const lowStockCount = variants.filter(
//     (variant) => Number(variant.stock || 0) <= 5
//   ).length;

//   return (
//     <div className="min-h-screen bg-[#faf7f0] p-4 text-[#173f32] sm:p-6 lg:p-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Page heading */}
//         <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#8a967f]">
//               MODEZA / INVENTORY
//             </p>

//             <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//               Product Variants
//             </h1>

//             <p className="mt-2 text-sm text-[#718075]">
//               Manage product sizes, colors, prices, SKUs, and stock.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={loadData}
//             disabled={loading}
//             className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce5d9] bg-white px-5 py-3 text-sm font-semibold text-[#174735] shadow-sm transition hover:bg-[#f0f5ed] disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             <span className={loading ? "animate-spin" : ""}>↻</span>
//             {loading ? "Loading..." : "Refresh"}
//           </button>
//         </div>

//         {/* Summary cards */}
//         <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <div className="rounded-2xl border border-[#e6e7da] bg-white p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium text-[#778477]">
//                 Total Variants
//               </p>
//               <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f1e7] text-xl">
//                 ◈
//               </span>
//             </div>
//             <p className="mt-4 text-3xl font-bold">{variants.length}</p>
//             <p className="mt-1 text-xs text-[#879187]">
//               Available size and color combinations
//             </p>
//           </div>

//           <div className="rounded-2xl border border-[#e6e7da] bg-white p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium text-[#778477]">
//                 Total Products
//               </p>
//               <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5efdf] text-xl">
//                 ♡
//               </span>
//             </div>
//             <p className="mt-4 text-3xl font-bold">{products.length}</p>
//             <p className="mt-1 text-xs text-[#879187]">
//               Products in the catalog
//             </p>
//           </div>

//           <div className="rounded-2xl border border-[#e6e7da] bg-white p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium text-[#778477]">
//                 Low Stock
//               </p>
//               <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e6] text-xl">
//                 !
//               </span>
//             </div>
//             <p className="mt-4 text-3xl font-bold text-[#b65a32]">
//               {lowStockCount}
//             </p>
//             <p className="mt-1 text-xs text-[#879187]">
//               Variants with 5 or fewer items
//             </p>
//           </div>
//         </div>

//         {/* Add or edit product variant form */}
//         <section className="mb-8 overflow-hidden rounded-2xl border border-[#e6e7da] bg-white shadow-sm">
//           <div className="border-b border-[#edf0e8] px-5 py-5 sm:px-7">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174735] text-xl text-white">
//                 {editingId ? "✎" : "+"}
//               </div>

//               <div>
//                 <h2 className="text-lg font-bold">
//                   {editingId ? "Edit Product Variant" : "Add New Variant"}
//                 </h2>
//                 <p className="mt-1 text-sm text-[#849084]">
//                   {editingId
//                     ? "Update the details of this product variant."
//                     : "Add a size and color combination for a product."}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="p-5 sm:p-7">
//             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//               {/* Product selection */}
//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Product <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   name="product"
//                   value={form.product}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-xl border border-[#dce5d9] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10"
//                 >
//                   <option value="">Select a product</option>

//                   {products.map((product) => (
//                     <option key={product._id} value={product._id}>
//                       {product.name}
//                     </option>
//                   ))}
//                 </select>

//                 {products.length === 0 && (
//                   <p className="mt-2 text-xs text-[#b65a32]">
//                     Add a product before creating a variant.
//                   </p>
//                 )}
//               </div>

//               {/* Size selection */}
//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Size <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   name="size"
//                   value={form.size}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-xl border border-[#dce5d9] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10"
//                 >
//                   <option value="">Select a size</option>
//                   <option value="XS">XS</option>
//                   <option value="S">S</option>
//                   <option value="M">M</option>
//                   <option value="L">L</option>
//                   <option value="XL">XL</option>
//                   <option value="XXL">XXL</option>
//                   <option value="Free Size">Free Size</option>
//                 </select>
//               </div>

//               {/* Color input */}
//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Color <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   name="color"
//                   value={form.color}
//                   onChange={handleChange}
//                   placeholder="e.g. Dark Green"
//                   required
//                   className="w-full rounded-xl border border-[#dce5d9] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition placeholder:text-[#a5ada3] focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10"
//                 />
//               </div>

//               {/* Variant price input */}
//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Variant Price (₹) <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="number"
//                   name="price"
//                   value={form.price}
//                   onChange={handleChange}
//                   min="0"
//                   step="0.01"
//                   placeholder="e.g. 1499"
//                   required
//                   className="w-full rounded-xl border border-[#dce5d9] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition placeholder:text-[#a5ada3] focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10"
//                 />
//               </div>

//               {/* Available stock input */}
//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Stock Quantity <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="number"
//                   name="stock"
//                   value={form.stock}
//                   onChange={handleChange}
//                   min="0"
//                   step="1"
//                   required
//                   placeholder="e.g. 10"
//                   className="w-full rounded-xl border border-[#dce5d9] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition placeholder:text-[#a5ada3] focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10"
//                 />
//               </div>

//               {/* Unique stock keeping unit */}
//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   SKU <span className="text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   name="sku"
//                   value={form.sku}
//                   onChange={handleChange}
//                   placeholder="e.g. DRESS-M-GREEN-001"
//                   required
//                   className="w-full rounded-xl border border-[#dce5d9] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition placeholder:text-[#a5ada3] focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10"
//                 />
//               </div>
//             </div>

//             {/* Form action buttons */}
//             <div className="mt-7 flex flex-col gap-3 border-t border-[#edf0e8] pt-5 sm:flex-row sm:justify-end">
//               {editingId && (
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="rounded-xl border border-[#dce5d9] px-6 py-3 text-sm font-semibold text-[#536457] transition hover:bg-[#f5f6f0]"
//                 >
//                   Cancel Edit
//                 </button>
//               )}

//               <button
//                 type="submit"
//                 disabled={saving || products.length === 0}
//                 className="rounded-xl bg-[#174735] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103728] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {saving
//                   ? "Saving..."
//                   : editingId
//                     ? "Update Variant"
//                     : "+ Add Variant"}
//               </button>
//             </div>
//           </form>
//         </section>

//         {/* Product variants table */}
//         <section className="overflow-hidden rounded-2xl border border-[#e6e7da] bg-white shadow-sm">
//           <div className="flex flex-col gap-4 border-b border-[#edf0e8] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
//             <div>
//               <h2 className="text-lg font-bold">All Product Variants</h2>
//               <p className="mt-1 text-sm text-[#849084]">
//                 {filteredVariants.length} variant(s) found
//               </p>
//             </div>

//             <div className="relative w-full sm:max-w-xs">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#849084]">
//                 ⌕
//               </span>

//               <input
//                 type="search"
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search product, size, SKU..."
//                 className="w-full rounded-xl border border-[#dce5d9] bg-[#fffdf9] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10"
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[850px] text-left">
//               <thead className="bg-[#f6f7f0]">
//                 <tr className="text-xs uppercase tracking-wider text-[#738174]">
//                   <th className="px-6 py-4 font-bold">Product</th>
//                   <th className="px-6 py-4 font-bold">Size / Color</th>
//                   <th className="px-6 py-4 font-bold">SKU</th>
//                   <th className="px-6 py-4 font-bold">Price</th>
//                   <th className="px-6 py-4 font-bold">Stock</th>
//                   <th className="px-6 py-4 text-right font-bold">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#edf0e8]">
//                 {loading && variants.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="6"
//                       className="px-6 py-12 text-center text-sm text-[#849084]"
//                     >
//                       Loading variants...
//                     </td>
//                   </tr>
//                 ) : filteredVariants.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-14 text-center">
//                       <div className="text-3xl">◇</div>
//                       <p className="mt-3 font-semibold text-[#536457]">
//                         No variants found
//                       </p>
//                       <p className="mt-1 text-sm text-[#849084]">
//                         Add a new variant or adjust your search.
//                       </p>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredVariants.map((variant) => {
//                     const productName =
//                       typeof variant.product === "object"
//                         ? variant.product?.name || "Unknown Product"
//                         : products.find(
//                             (product) =>
//                               product._id === variant.product
//                           )?.name || "Unknown Product";

//                     const stock = Number(variant.stock || 0);
//                     const isLowStock = stock <= 5;

//                     return (
//                       <tr
//                         key={variant._id}
//                         className="transition hover:bg-[#fbfcf8]"
//                       >
//                         <td className="px-6 py-5">
//                           <p className="font-semibold text-[#173f32]">
//                             {productName}
//                           </p>
//                           <p className="mt-1 text-xs text-[#849084]">
//                             ID: {variant._id?.slice(-6) || "-"}
//                           </p>
//                         </td>

//                         <td className="px-6 py-5">
//                           <div className="flex flex-wrap items-center gap-2">
//                             <span className="rounded-lg bg-[#e8f1e7] px-3 py-1.5 text-xs font-bold text-[#174735]">
//                               {variant.size || "-"}
//                             </span>
//                             <span className="rounded-lg bg-[#f5efdf] px-3 py-1.5 text-xs font-medium text-[#796744]">
//                               {variant.color || "-"}
//                             </span>
//                           </div>
//                         </td>

//                         <td className="px-6 py-5">
//                           <span className="rounded-md bg-[#f6f7f0] px-2.5 py-1.5 font-mono text-xs text-[#536457]">
//                             {variant.sku || "-"}
//                           </span>
//                         </td>

//                         <td className="px-6 py-5 font-bold text-[#174735]">
//                           {money(variant.price)}
//                         </td>

//                         <td className="px-6 py-5">
//                           <span
//                             className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
//                               isLowStock
//                                 ? "bg-[#fff0e6] text-[#b65a32]"
//                                 : "bg-[#e8f1e7] text-[#286345]"
//                             }`}
//                           >
//                             <span
//                               className={`h-1.5 w-1.5 rounded-full ${
//                                 isLowStock
//                                   ? "bg-[#d66a3e]"
//                                   : "bg-[#39845a]"
//                               }`}
//                             />
//                             {stock} {isLowStock ? "Low Stock" : "In Stock"}
//                           </span>
//                         </td>

//                         <td className="px-6 py-5">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               type="button"
//                               onClick={() => handleEdit(variant)}
//                               title="Edit variant"
//                               className="rounded-lg border border-[#dce5d9] px-3 py-2 text-sm font-semibold text-[#174735] transition hover:bg-[#e8f1e7]"
//                             >
//                               Edit
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() => handleDeleteClick(variant)}
//                               title="Delete variant"
//                               className="rounded-lg border border-[#f0d7cf] px-3 py-2 text-sm font-semibold text-[#b44c35] transition hover:bg-[#fff0e6]"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </div>

//       {/* Success and error notification */}
//       {toast && (
//         <div
//           role="status"
//           className={`fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl sm:right-6 sm:top-6 ${
//             toast.type === "error"
//               ? "border-red-200"
//               : "border-[#cfe2d0]"
//           }`}
//         >
//           <div
//             className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
//               toast.type === "error"
//                 ? "bg-red-100 text-red-600"
//                 : "bg-[#e4f2e4] text-[#22633d]"
//             }`}
//           >
//             {toast.type === "error" ? "!" : "✓"}
//           </div>

//           <div className="flex-1">
//             <p className="font-bold text-[#173f32]">
//               {toast.type === "error" ? "Error!" : "Success!"}
//             </p>
//             <p className="mt-1 text-sm text-[#667568]">
//               {toast.message}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => setToast(null)}
//             aria-label="Close notification"
//             className="text-xl leading-none text-[#849084] hover:text-[#173f32]"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* Delete confirmation dialog */}
//       {deleteTarget && (
//         <div
//           className="fixed inset-0 z-[60] flex items-center justify-center bg-[#10291f]/50 p-4 backdrop-blur-sm"
//           onClick={() => !deleting && setDeleteTarget(null)}
//         >
//           <div
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="delete-variant-title"
//             className="w-full max-w-md rounded-3xl bg-[#fffdf9] p-6 shadow-2xl sm:p-8"
//             onClick={(event) => event.stopPropagation()}
//           >
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#b44c35]">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.7"
//                 className="h-8 w-8"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M3 6h18M9 6V4h6v2m-9 0 1 14h10l1-14M10 10v6m4-6v6"
//                 />
//               </svg>
//             </div>

//             <h2
//               id="delete-variant-title"
//               className="mt-5 text-center text-xl font-bold text-[#173f32]"
//             >
//               Delete Product Variant?
//             </h2>

//             <p className="mt-3 text-center text-sm leading-6 text-[#718075]">
//               Are you sure you want to permanently delete this variant?
//               This action cannot be undone.
//             </p>

//             <div className="mt-5 rounded-xl border border-[#e6e7da] bg-white p-4">
//               <p className="font-semibold text-[#173f32]">
//                 {typeof deleteTarget.product === "object"
//                   ? deleteTarget.product?.name || "Product Variant"
//                   : products.find(
//                       (product) =>
//                         product._id === deleteTarget.product
//                     )?.name || "Product Variant"}
//               </p>

//               <div className="mt-2 flex flex-wrap gap-2 text-xs">
//                 <span className="rounded-md bg-[#e8f1e7] px-2.5 py-1.5 font-semibold text-[#174735]">
//                   Size: {deleteTarget.size || "-"}
//                 </span>
//                 <span className="rounded-md bg-[#f5efdf] px-2.5 py-1.5 font-semibold text-[#796744]">
//                   Color: {deleteTarget.color || "-"}
//                 </span>
//               </div>

//               <p className="mt-3 font-mono text-xs text-[#849084]">
//                 SKU: {deleteTarget.sku || "-"}
//               </p>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 disabled={deleting}
//                 onClick={() => setDeleteTarget(null)}
//                 className="rounded-xl border border-[#dce5d9] px-4 py-3 text-sm font-bold text-[#536457] transition hover:bg-[#f1f4ed] disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 disabled={deleting}
//                 onClick={confirmDelete}
//                 className="rounded-xl bg-[#b44c35] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#963b28] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {deleting ? "Deleting..." : "Yes, Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Popup animations */}
//       <style>{`
//         @keyframes toastSlideIn {
//           from {
//             opacity: 0;
//             transform: translateX(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         @keyframes modalPopIn {
//           from {
//             opacity: 0;
//             transform: scale(0.96) translateY(8px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }

//         [role="status"] {
//           animation: toastSlideIn 0.25s ease-out;
//         }

//         [role="dialog"] {
//           animation: modalPopIn 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }




import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const initialForm = {
  product: "",
  size: "",
  color: "",
  price: "",
  stock: "0",
  sku: "",
};

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

function getList(response, keys = []) {
  const data = response?.data;

  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }

  if (Array.isArray(data?.data)) return data.data;

  return [];
}

function getProductName(variant) {
  const product = variant?.product;

  if (product && typeof product === "object") {
    return product.name || product.title || "Unknown product";
  }

  return variant?.productName || "Unknown product";
}

export default function AdminProductVariants() {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingId(null);
  }, []);

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [variantResponse, productResponse] = await Promise.all([
        api.get("/productvariant"),
        api.get("/product"),
      ]);

      setVariants(
        getList(variantResponse, ["variants", "data"])
      );

      setProducts(
        getList(productResponse, ["products", "data"])
      );
    } catch (error) {
      console.error("Failed to load product variants:", error);
      showToast(
        error.response?.data?.message ||
          "Failed to load product variants.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredVariants = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return variants;

    return variants.filter((variant) => {
      const searchableText = [
        getProductName(variant),
        variant.size,
        variant.color,
        variant.sku,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [variants, search]);

  const lowStockCount = variants.filter(
    (variant) => Number(variant.stock || 0) <= 5
  ).length;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.product ||
      !form.size.trim() ||
      !form.color.trim() ||
      form.price === "" ||
      form.stock === "" ||
      !form.sku.trim()
    ) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    if (
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      showToast("Please enter a valid price.", "error");
      return;
    }

    if (
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      showToast(
        "Stock must be a whole number greater than or equal to zero.",
        "error"
      );
      return;
    }

    const payload = {
      product: form.product,
      size: form.size.trim(),
      color: form.color.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      sku: form.sku.trim(),
    };

    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/productvariant/${editingId}`, payload);
        showToast("Product variant updated successfully.");
      } else {
        await api.post("/productvariant", payload);
        showToast("Product variant added successfully.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      console.error("Failed to save product variant:", error);
      showToast(
        error.response?.data?.message ||
          "Failed to save product variant.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (variant) => {
    const productId =
      typeof variant.product === "object"
        ? variant.product?._id
        : variant.product;

    setForm({
      product: productId || "",
      size: variant.size || "",
      color: variant.color || "",
      price: String(variant.price ?? ""),
      stock: String(variant.stock ?? 0),
      sku: variant.sku || "",
    });

    setEditingId(variant._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await api.delete(`/productvariant/${deleteTarget._id}`);

      setVariants((previous) =>
        previous.filter(
          (variant) => variant._id !== deleteTarget._id
        )
      );

      setDeleteTarget(null);
      showToast("Product variant deleted successfully.");
    } catch (error) {
      console.error("Failed to delete product variant:", error);
      showToast(
        error.response?.data?.message ||
          "Failed to delete product variant.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#deded2] bg-white px-4 py-3 text-sm text-[#173f32] outline-none transition placeholder:text-[#a4a79c] focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10";

  const labelClass =
    "block text-sm font-semibold text-[#28483b]";

  return (
    <div className="min-h-screen bg-[#faf7f0] p-4 text-[#173f32] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8b9a86]">
              Inventory Management
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Product Variants
            </h1>

            <p className="mt-2 text-sm text-[#788579]">
              Manage product sizes, colors, prices, SKUs, and stock.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="rounded-xl border border-[#d8dfd5] bg-white px-4 py-3 text-sm font-semibold text-[#174735] transition hover:bg-[#f0f4ed] disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (showForm && !editingId) {
                  closeForm();
                } else {
                  resetForm();
                  setShowForm(true);
                }
              }}
              className="rounded-xl bg-[#174735] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103728]"
            >
              {showForm && !editingId
                ? "Close Form"
                : "+ Add Variant"}
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e8e5d9] bg-[#fffdf9] p-5 shadow-sm">
            <p className="text-sm font-medium text-[#788579]">
              Total Variants
            </p>
            <p className="mt-3 text-3xl font-bold">
              {variants.length}
            </p>
            <p className="mt-1 text-xs text-[#8b9a86]">
              All product variations
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8e5d9] bg-[#fffdf9] p-5 shadow-sm">
            <p className="text-sm font-medium text-[#788579]">
              Products Available
            </p>
            <p className="mt-3 text-3xl font-bold">
              {products.length}
            </p>
            <p className="mt-1 text-xs text-[#8b9a86]">
              Products in the catalog
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8e5d9] bg-[#fffdf9] p-5 shadow-sm">
            <p className="text-sm font-medium text-[#788579]">
              Low Stock Variants
            </p>
            <p className="mt-3 text-3xl font-bold text-[#a65d32]">
              {lowStockCount}
            </p>
            <p className="mt-1 text-xs text-[#8b9a86]">
              Stock of 5 or fewer
            </p>
          </div>
        </div>

        {/* Add/Edit form: hidden until Add Variant or Edit is clicked */}
        {showForm && (
          <section className="overflow-hidden rounded-2xl border border-[#e5e5d9] bg-[#fffdf9] shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-[#eeece3] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId ? "Edit Product Variant" : "Add Product Variant"}
                </h2>

                <p className="mt-1 text-sm text-[#788579]">
                  Enter the details for this product variation.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="self-start rounded-lg px-3 py-2 text-sm font-semibold text-[#788579] transition hover:bg-[#f4f2e9] hover:text-[#173f32] sm:self-auto"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="product" className={labelClass}>
                    Product *
                  </label>

                  <select
                    id="product"
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select a product</option>

                    {products.map((product) => (
                      <option
                        key={product._id}
                        value={product._id}
                      >
                        {product.name}
                      </option>
                    ))}
                  </select>

                  {products.length === 0 && (
                    <p className="mt-2 text-xs text-[#a65d32]">
                      Add a product before creating a variant.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="size" className={labelClass}>
                    Size *
                  </label>

                  <select
                    id="size"
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select a size</option>
                    {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map(
                      (size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="color" className={labelClass}>
                    Color *
                  </label>

                  <input
                    id="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    placeholder="e.g. Dark Green"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="price" className={labelClass}>
                    Price (₹) *
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="stock" className={labelClass}>
                    Stock Quantity *
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="sku" className={labelClass}>
                    SKU *
                  </label>

                  <input
                    id="sku"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="e.g. FLORAL-MAXI-M-GREEN"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#eeece3] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#d8dfd5] bg-white px-5 py-3 text-sm font-semibold text-[#526558] transition hover:bg-[#f4f2e9] disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || products.length === 0}
                  className="rounded-xl bg-[#174735] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#103728] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Add Variant"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Variants table */}
        <section className="overflow-hidden rounded-2xl border border-[#e5e5d9] bg-[#fffdf9] shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-[#eeece3] p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-lg font-bold">
                All Variants
              </h2>
              <p className="mt-1 text-sm text-[#788579]">
                View and manage existing product variants.
              </p>
            </div>

            <div className="w-full sm:max-w-xs">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product, size, color, SKU..."
                className="w-full rounded-xl border border-[#deded2] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#a4a79c] focus:border-[#174735] focus:ring-2 focus:ring-[#174735]/10"
              />
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-[#788579]">
              Loading product variants...
            </div>
          ) : filteredVariants.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2e9] text-2xl">
                ◇
              </div>

              <h3 className="mt-4 font-bold">
                {search
                  ? "No matching variants found"
                  : "No product variants yet"}
              </h3>

              <p className="mt-2 text-sm text-[#788579]">
                {search
                  ? "Try a different search term."
                  : "Click Add Variant to create your first product variation."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="mt-5 rounded-xl bg-[#174735] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#103728]"
                >
                  + Add Variant
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#f5f3eb]">
                  <tr className="text-xs uppercase tracking-wider text-[#788579]">
                    <th className="px-6 py-4 font-bold">Product</th>
                    <th className="px-6 py-4 font-bold">Size / Color</th>
                    <th className="px-6 py-4 font-bold">SKU</th>
                    <th className="px-6 py-4 font-bold">Price</th>
                    <th className="px-6 py-4 font-bold">Stock</th>
                    <th className="px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eeece3]">
                  {filteredVariants.map((variant) => {
                    const stock = Number(variant.stock || 0);

                    return (
                      <tr
                        key={variant._id}
                        className="transition hover:bg-[#faf9f3]"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-[#173f32]">
                            {getProductName(variant)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-lg bg-[#eef2e9] px-3 py-1 text-xs font-bold text-[#174735]">
                            {variant.size || "—"}
                          </span>

                          <p className="mt-2 text-sm text-[#788579]">
                            {variant.color || "—"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-md bg-[#f5f3eb] px-2 py-1 font-mono text-xs text-[#526558]">
                            {variant.sku || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-5 font-semibold">
                          {money(variant.price)}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              stock === 0
                                ? "bg-red-50 text-red-700"
                                : stock <= 5
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-green-50 text-green-700"
                            }`}
                          >
                            {stock === 0
                              ? "Out of stock"
                              : stock <= 5
                                ? `Low: ${stock}`
                                : stock}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(variant)}
                              className="rounded-lg border border-[#d8dfd5] px-3 py-2 text-xs font-bold text-[#174735] transition hover:bg-[#eef2e9]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(variant)}
                              className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredVariants.length > 0 && (
            <div className="border-t border-[#eeece3] px-6 py-4 text-xs text-[#788579]">
              Showing {filteredVariants.length} of {variants.length} variants
            </div>
          )}
        </section>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14251d]/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#e5e5d9] bg-[#fffdf9] p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Delete Product Variant?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#788579]">
              Are you sure you want to delete the{" "}
              <span className="font-semibold text-[#173f32]">
                {getProductName(deleteTarget)}
              </span>{" "}
              variant ({deleteTarget.size} / {deleteTarget.color})? This
              action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-[#d8dfd5] px-5 py-3 text-sm font-semibold text-[#526558] transition hover:bg-[#f4f2e9] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Variant"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl px-5 py-4 text-sm font-semibold text-white shadow-xl ${
            toast.type === "error"
              ? "bg-red-600"
              : "bg-[#174735]"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
