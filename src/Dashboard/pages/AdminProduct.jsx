
// import { useCallback, useEffect, useState } from "react";
// import api from "../../services/api";

// const initialForm = {
//   name: "",
//   description: "",
//   category: "",
//   originalPrice: "",
//   discountPercentage: 0,
//   price: "",
//   status: "active",
//   image: null,
// };

// function SuccessPopup({ message, onClose }) {
//   useEffect(() => {
//     if (!message) return;

//     const timer = setTimeout(onClose, 4000);
//     return () => clearTimeout(timer);
//   }, [message, onClose]);

//   if (!message) return null;

//   return (
//     <div
//       role="status"
//       aria-live="polite"
//       className="fixed right-5 top-5 z-[99999] w-[calc(100%-40px)] max-w-sm"
//     >
//       <div className="flex items-center gap-3 rounded-2xl border border-[#C9E4D2] bg-[#FFFCF8] p-4 shadow-2xl">
//         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4F4E9] text-xl font-bold text-[#176747]">
//           ✓
//         </div>

//         <div className="min-w-0 flex-1">
//           <h3 className="font-bold text-[#123F34]">Success!</h3>
//           <p className="mt-1 break-words text-sm text-[#64756A]">
//             {message}
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={onClose}
//           aria-label="Close notification"
//           className="rounded-lg px-2 py-1 text-xl text-[#858176] transition hover:bg-[#F0EBE2]"
//         >
//           ×
//         </button>
//       </div>
//     </div>
//   );
// }

// function SummaryCard({ title, value, icon }) {
//   return (
//     <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <p className="text-sm font-medium text-[#788178]">{title}</p>
//           <h3 className="mt-2 text-2xl font-bold text-[#123F32]">
//             {value}
//           </h3>
//         </div>

//         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2E8] text-2xl text-[#164D3D]">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AdminProduct() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const closeSuccess = useCallback(() => {
//     setSuccess("");
//   }, []);

//   const loadProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const [productResponse, categoryResponse] = await Promise.all([
//         api.get("/product"),
//         api.get("/category"),
//       ]);

//       const productData =
//         productResponse.data?.data ?? productResponse.data;

//       const categoryData =
//         categoryResponse.data?.data ?? categoryResponse.data;

//       setProducts(
//         Array.isArray(productData)
//           ? productData
//           : productData?.products ?? []
//       );

//       setCategories(
//         Array.isArray(categoryData)
//           ? categoryData
//           : categoryData?.categories ?? []
//       );
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to load products. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   const getImageUrl = (image) => {
//     if (!image) return "";

//     if (typeof image === "object") {
//       image = image.url || image.path || image.filename || "";
//     }

//     if (!image || typeof image !== "string") return "";

//     if (image.startsWith("http://") || image.startsWith("https://")) {
//       return image;
//     }

//     const baseURL =
//       api.defaults?.baseURL?.replace(/\/$/, "") ||
//       "http://localhost:5000";

//     if (image.startsWith("/")) return `${baseURL}${image}`;

//     return `${baseURL}/uploads/${image}`;
//   };

//   const calculatePrice = (originalPrice, discountPercentage) => {
//     const original = Number(originalPrice) || 0;
//     const discount = Number(discountPercentage) || 0;

//     return Math.max(0, original - (original * discount) / 100);
//   };

//   const handleFormChange = (event) => {
//     const { name, value, files } = event.target;

//     if (name === "image") {
//       setForm((previous) => ({
//         ...previous,
//         image: files?.[0] || null,
//       }));
//       return;
//     }

//     setForm((previous) => {
//       const updated = { ...previous, [name]: value };

//       if (name === "originalPrice" || name === "discountPercentage") {
//         const original =
//           name === "originalPrice" ? value : previous.originalPrice;

//         const discount =
//           name === "discountPercentage"
//             ? value
//             : previous.discountPercentage;

//         updated.price = calculatePrice(original, discount);
//       }

//       return updated;
//     });
//   };

//   const resetForm = () => {
//     setForm({ ...initialForm });
//     setEditingId(null);
//   };

//   const openAddForm = () => {
//     resetForm();
//     setError("");
//     setShowForm(true);
//   };

//   const openEditForm = (product) => {
//     setEditingId(product._id);

//     setForm({
//       name: product.name || "",
//       description: product.description || "",
//       category: product.category?._id || product.category || "",
//       originalPrice: product.originalPrice ?? product.price ?? "",
//       discountPercentage: product.discountPercentage ?? 0,
//       price: product.price ?? "",
//       status: product.status || "active",
//       image: null,
//     });

//     setError("");
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const wasEditing = Boolean(editingId);

//     if (!form.name.trim()) {
//       setError("Please enter a product name.");
//       return;
//     }

//     if (
//       form.originalPrice === "" ||
//       !Number.isFinite(Number(form.originalPrice)) ||
//       Number(form.originalPrice) < 0
//     ) {
//       setError("Please enter a valid original price.");
//       return;
//     }

//     if (
//       !Number.isFinite(Number(form.discountPercentage)) ||
//       Number(form.discountPercentage) < 0 ||
//       Number(form.discountPercentage) > 100
//     ) {
//       setError("Discount must be between 0 and 100%.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");

//       const formData = new FormData();

//       formData.append("name", form.name.trim());
//       formData.append("description", form.description);
//       formData.append("originalPrice", Number(form.originalPrice));
//       formData.append(
//         "discountPercentage",
//         Number(form.discountPercentage)
//       );
//       formData.append(
//         "price",
//         calculatePrice(form.originalPrice, form.discountPercentage)
//       );
//       formData.append("status", form.status);

//       if (form.category) {
//         formData.append("category", form.category);
//       }

//       if (form.image) {
//         formData.append("image", form.image);
//       }

//       if (wasEditing) {
//         await api.put(`/product/${editingId}`, formData);
//       } else {
//         await api.post("/product", formData);
//       }

//       resetForm();
//       setShowForm(false);
//       setSuccess(
//         wasEditing
//           ? "Product updated successfully!"
//           : "Product added successfully!"
//       );

//       await loadProducts();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save the product. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (product) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${product.name}"?`
//     );

//     if (!confirmed) return;

//     try {
//       setError("");

//       await api.delete(`/product/${product._id}`);

//       setSuccess("Product deleted successfully!");
//       await loadProducts();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete the product. Please try again."
//       );
//     }
//   };

//   const filteredProducts = products.filter((product) =>
//     `${product.name || ""} ${product.category?.name || ""}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   const activeCount = products.filter(
//     (product) => product.status === "active"
//   ).length;

//   const inactiveCount = products.length - activeCount;

//   const totalValue = products.reduce(
//     (total, product) => total + (Number(product.price) || 0),
//     0
//   );

//   return (
//     <div className="min-h-screen bg-[#FAF7F0] p-4 text-[#263B31] sm:p-6 lg:p-8">
//       <SuccessPopup message={success} onClose={closeSuccess} />

//       <div className="mx-auto max-w-7xl space-y-6">
//         {/* Page Heading */}
//         <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#829083]">
//               MODEZA / ADMIN
//             </p>

//             <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123F32] sm:text-4xl">
//               Product Management
//             </h1>

//             <p className="mt-2 text-sm text-[#788178]">
//               Manage your products, pricing, and inventory.
//             </p>
//           </div>

//           {!showForm && (
//             <button
//               type="button"
//               onClick={openAddForm}
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123F32] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#1B5141] focus:outline-none focus:ring-2 focus:ring-[#6E9A7B] focus:ring-offset-2"
//             >
//               <span className="text-xl">+</span>
//               Add Product
//             </button>
//           )}
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div
//             role="alert"
//             className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
//           >
//             <span>{error}</span>

//             <button
//               type="button"
//               onClick={() => setError("")}
//               className="font-bold"
//               aria-label="Dismiss error"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Add / Edit Form */}
//         {showForm && (
//           <section className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white shadow-sm">
//             <div className="flex items-center justify-between gap-3 border-b border-[#EAE5DA] bg-[#F4F0E7] px-5 py-4 sm:px-7">
//               <div>
//                 <h2 className="text-xl font-bold text-[#123F32]">
//                   {editingId ? "Edit Product" : "Add New Product"}
//                 </h2>

//                 <p className="mt-1 text-sm text-[#788178]">
//                   Enter the product details below.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false);
//                   resetForm();
//                   setError("");
//                 }}
//                 className="rounded-xl border border-[#D9D5C9] bg-white px-3 py-2 text-sm font-semibold text-[#526257] transition hover:bg-[#EAE5DA]"
//               >
//                 Close ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 {/* Product Name */}
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Product Name *
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleFormChange}
//                     required
//                     placeholder="Example: Cotton Dress"
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none transition placeholder:text-[#A5A79D] focus:border-[#46745A] focus:ring-2 focus:ring-[#46745A]/15"
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Category
//                   </label>

//                   <select
//                     name="category"
//                     value={form.category}
//                     onChange={handleFormChange}
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A] focus:ring-2 focus:ring-[#46745A]/15"
//                   >
//                     <option value="">Select category</option>

//                     {categories.map((category) => (
//                       <option key={category._id} value={category._id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Description */}
//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Description
//                   </label>

//                   <textarea
//                     name="description"
//                     value={form.description}
//                     onChange={handleFormChange}
//                     rows={4}
//                     placeholder="Describe the product..."
//                     className="w-full resize-y rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A] focus:ring-2 focus:ring-[#46745A]/15"
//                   />
//                 </div>

//                 {/* Original Price */}
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Original Price (₹) *
//                   </label>

//                   <input
//                     type="number"
//                     name="originalPrice"
//                     value={form.originalPrice}
//                     onChange={handleFormChange}
//                     min="0"
//                     step="0.01"
//                     required
//                     placeholder="1999"
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A] focus:ring-2 focus:ring-[#46745A]/15"
//                   />
//                 </div>

//                 {/* Discount */}
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Discount (%)
//                   </label>

//                   <input
//                     type="number"
//                     name="discountPercentage"
//                     value={form.discountPercentage}
//                     onChange={handleFormChange}
//                     min="0"
//                     max="100"
//                     step="1"
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A] focus:ring-2 focus:ring-[#46745A]/15"
//                   />
//                 </div>

//                 {/* Final Price */}
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Final Price (₹)
//                   </label>

//                   <div className="rounded-xl border border-[#D5E6D7] bg-[#EDF5EB] px-4 py-3 font-bold text-[#164D3D]">
//                     ₹
//                     {calculatePrice(
//                       form.originalPrice,
//                       form.discountPercentage
//                     ).toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </div>

//                   <p className="mt-1 text-xs text-[#849083]">
//                     Final price after discount.
//                   </p>
//                 </div>

//                 {/* Status */}
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Status
//                   </label>

//                   <select
//                     name="status"
//                     value={form.status}
//                     onChange={handleFormChange}
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A] focus:ring-2 focus:ring-[#46745A]/15"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>

//                 {/* Product Image */}
//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Product Image {editingId ? "(optional)" : ""}
//                   </label>

//                   <input
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleFormChange}
//                     className="block w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] text-sm text-[#526257] file:mr-4 file:cursor-pointer file:border-0 file:bg-[#EAF2E8] file:px-4 file:py-3 file:font-semibold file:text-[#164D3D] hover:file:bg-[#DCEADB]"
//                   />

//                   {form.image && (
//                     <p className="mt-2 text-sm text-[#46745A]">
//                       Selected: {form.image.name}
//                     </p>
//                   )}

//                   {editingId &&
//                     !form.image &&
//                     products.find((item) => item._id === editingId)?.image && (
//                       <p className="mt-2 text-sm text-[#788178]">
//                         The existing image will be kept unless you upload a new one.
//                       </p>
//                     )}
//                 </div>
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-col-reverse gap-3 border-t border-[#EAE5DA] pt-5 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     resetForm();
//                     setError("");
//                   }}
//                   className="rounded-xl border border-[#DCDDD2] px-5 py-3 font-semibold text-[#526257] transition hover:bg-[#F4F0E7]"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-xl bg-[#123F32] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#1B5141] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editingId
//                       ? "Save Changes"
//                       : "Save Product"}
//                 </button>
//               </div>
//             </form>
//           </section>
//         )}

//         {/* Product Summary and List */}
//         {!showForm && (
//           <>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//               <SummaryCard
//                 title="Total Products"
//                 value={products.length}
//                 icon="▦"
//               />

//               <SummaryCard
//                 title="Active Products"
//                 value={activeCount}
//                 icon="✓"
//               />

//               <SummaryCard
//                 title="Inactive Products"
//                 value={inactiveCount}
//                 icon="◷"
//               />

//               <SummaryCard
//                 title="Combined Listed Prices"
//                 value={`₹${totalValue.toLocaleString("en-IN")}`}
//                 icon="₹"
//               />
//             </div>

//             <section className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white shadow-sm">
//               <div className="flex flex-col gap-4 border-b border-[#EAE5DA] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//                 <div>
//                   <h2 className="text-xl font-bold text-[#123F32]">
//                     All Products
//                   </h2>

//                   <p className="mt-1 text-sm text-[#788178]">
//                     {filteredProducts.length} product(s) found
//                   </p>
//                 </div>

//                 <div className="w-full sm:max-w-xs">
//                   <input
//                     type="search"
//                     value={search}
//                     onChange={(event) => setSearch(event.target.value)}
//                     placeholder="Search products..."
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none transition placeholder:text-[#A5A79D] focus:border-[#46745A] focus:ring-2 focus:ring-[#46745A]/15"
//                   />
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="p-12 text-center">
//                   <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DDE7D9] border-t-[#164D3D]" />

//                   <p className="mt-4 text-sm text-[#788178]">
//                     Loading products...
//                   </p>
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <div className="text-4xl text-[#A7B6A5]">▦</div>

//                   <h3 className="mt-3 font-bold text-[#123F32]">
//                     No products found
//                   </h3>

//                   <p className="mt-1 text-sm text-[#788178]">
//                     Add a new product or try a different search.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={openAddForm}
//                     className="mt-5 rounded-xl bg-[#123F32] px-5 py-3 font-semibold text-white transition hover:bg-[#1B5141]"
//                   >
//                     + Add Product
//                   </button>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[760px] text-left">
//                     <thead className="bg-[#F4F0E7] text-xs uppercase tracking-wider text-[#788178]">
//                       <tr>
//                         <th className="px-6 py-4 font-bold">Product</th>
//                         <th className="px-6 py-4 font-bold">Category</th>
//                         <th className="px-6 py-4 font-bold">Price</th>
//                         <th className="px-6 py-4 font-bold">Discount</th>
//                         <th className="px-6 py-4 font-bold">Status</th>
//                         <th className="px-6 py-4 text-right font-bold">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y divide-[#F0ECE3]">
//                       {filteredProducts.map((product) => {
//                         const imageUrl = getImageUrl(product.image);

//                         return (
//                           <tr
//                             key={product._id}
//                             className="transition hover:bg-[#FCFAF5]"
//                           >
//                             <td className="px-6 py-4">
//                               <div className="flex items-center gap-3">
//                                 {imageUrl ? (
//                                   <img
//                                     src={imageUrl}
//                                     alt={product.name}
//                                     className="h-14 w-12 rounded-lg border border-[#E5E0D5] object-cover"
//                                     onError={(event) => {
//                                       event.currentTarget.style.display = "none";
//                                     }}
//                                   />
//                                 ) : (
//                                   <div className="flex h-14 w-12 items-center justify-center rounded-lg bg-[#EAF2E8] text-xl text-[#164D3D]">
//                                     ♡
//                                   </div>
//                                 )}

//                                 <div className="max-w-xs">
//                                   <p className="font-semibold text-[#263B31]">
//                                     {product.name}
//                                   </p>

//                                   <p className="mt-1 line-clamp-2 text-xs text-[#899087]">
//                                     {product.description || "No description"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </td>

//                             <td className="px-6 py-4 text-sm text-[#64756A]">
//                               {product.category?.name || "—"}
//                             </td>

//                             <td className="px-6 py-4">
//                               <p className="font-bold text-[#164D3D]">
//                                 ₹
//                                 {Number(product.price || 0).toLocaleString(
//                                   "en-IN"
//                                 )}
//                               </p>

//                               {Number(product.discountPercentage) > 0 && (
//                                 <p className="mt-1 text-xs text-[#899087] line-through">
//                                   ₹
//                                   {Number(
//                                     product.originalPrice || 0
//                                   ).toLocaleString("en-IN")}
//                                 </p>
//                               )}
//                             </td>

//                             <td className="px-6 py-4">
//                               {Number(product.discountPercentage) > 0 ? (
//                                 <span className="rounded-full bg-[#EAF2E8] px-3 py-1 text-xs font-bold text-[#176747]">
//                                   {product.discountPercentage}% OFF
//                                 </span>
//                               ) : (
//                                 <span className="text-sm text-[#899087]">
//                                   No discount
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-6 py-4">
//                               <span
//                                 className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
//                                   product.status === "active"
//                                     ? "bg-[#E4F4E9] text-[#176747]"
//                                     : "bg-[#F0EBE2] text-[#817866]"
//                                 }`}
//                               >
//                                 {product.status || "active"}
//                               </span>
//                             </td>

//                             <td className="px-6 py-4">
//                               <div className="flex justify-end gap-2">
//                                 <button
//                                   type="button"
//                                   onClick={() => openEditForm(product)}
//                                   className="rounded-lg border border-[#D5DFD2] bg-[#F4F8F1] px-3 py-2 text-sm font-semibold text-[#164D3D] transition hover:bg-[#E4EEDF]"
//                                 >
//                                   Edit
//                                 </button>

//                                 <button
//                                   type="button"
//                                   onClick={() => handleDelete(product)}
//                                   className="rounded-lg border border-[#F0D7D2] bg-[#FFF7F5] px-3 py-2 text-sm font-semibold text-[#A34435] transition hover:bg-[#FCE9E5]"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }












// import { useCallback, useEffect, useState } from "react";
// import api from "../../services/api";

// const initialForm = {
//   name: "",
//   description: "",
//   category: "",
//   originalPrice: "",
//   discountPercentage: 0,
//   price: "",
//   status: "active",
//   image: null,
// };

// function SuccessPopup({ message, onClose }) {
//   useEffect(() => {
//     if (!message) return;
//     const timer = setTimeout(onClose, 4000);
//     return () => clearTimeout(timer);
//   }, [message, onClose]);

//   if (!message) return null;

//   return (
//     <div
//       role="status"
//       aria-live="polite"
//       className="fixed right-5 top-5 z-[99999] w-[calc(100%-40px)] max-w-sm"
//     >
//       <div className="flex items-center gap-3 rounded-2xl border border-[#C9E4D2] bg-[#FFFCF8] p-4 shadow-2xl">
//         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4F4E9] text-xl font-bold text-[#176747]">
//           ✓
//         </div>
//         <div className="min-w-0 flex-1">
//           <h3 className="font-bold text-[#123F34]">Success!</h3>
//           <p className="mt-1 break-words text-sm text-[#64756A]">
//             {message}
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={onClose}
//           aria-label="Close notification"
//           className="rounded-lg px-2 py-1 text-xl text-[#858176] hover:bg-[#F0EBE2]"
//         >
//           ×
//         </button>
//       </div>
//     </div>
//   );
// }

// function SummaryCard({ title, value, icon }) {
//   return (
//     <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <p className="text-sm font-medium text-[#788178]">{title}</p>
//           <h3 className="mt-2 text-2xl font-bold text-[#123F32]">
//             {value}
//           </h3>
//         </div>
//         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2E8] text-2xl text-[#164D3D]">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function DeleteConfirmPopup({ product, deleting, onCancel, onConfirm }) {
//   if (!product) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[99998] flex items-center justify-center bg-[#14251D]/50 p-4 backdrop-blur-sm"
//       role="presentation"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget && !deleting) {
//           onCancel();
//         }
//       }}
//     >
//       <section
//         role="alertdialog"
//         aria-modal="true"
//         aria-labelledby="delete-title"
//         aria-describedby="delete-description"
//         className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5E0D5] bg-[#FFFCF8] shadow-2xl"
//       >
//         <div className="flex justify-center pt-7">
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FCE9E5] text-3xl text-[#A34435]">
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.8"
//               className="h-8 w-8"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3 6h18M9 6V4h6v2m-9 0 1 14h10l1-14M10 10v6m4-6v6"
//               />
//             </svg>
//           </div>
//         </div>

//         <div className="px-6 pb-6 pt-5 text-center">
//           <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#829083]">
//             MODEZA / PRODUCT MANAGEMENT
//           </p>

//           <h2
//             id="delete-title"
//             className="mt-3 text-2xl font-bold text-[#123F32]"
//           >
//             Delete Product?
//           </h2>

//           <p
//             id="delete-description"
//             className="mt-3 text-sm leading-6 text-[#788178]"
//           >
//             Are you sure you want to delete{" "}
//             <span className="font-bold text-[#263B31]">
//               {product.name}
//             </span>
//             ? This action cannot be undone.
//           </p>

//           <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
//             <button
//               type="button"
//               disabled={deleting}
//               onClick={onCancel}
//               className="flex-1 rounded-xl border border-[#DCDDD2] bg-white px-5 py-3 font-semibold text-[#526257] transition hover:bg-[#F4F0E7] disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               disabled={deleting}
//               onClick={onConfirm}
//               className="flex-1 rounded-xl bg-[#A34435] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#87372B] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {deleting ? "Deleting..." : "Yes, Delete"}
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default function AdminProduct() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const closeSuccess = useCallback(() => setSuccess(""), []);

//   const loadProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const [productResponse, categoryResponse] = await Promise.all([
//         api.get("/product"),
//         api.get("/category"),
//       ]);

//       const productData =
//         productResponse.data?.data ?? productResponse.data;
//       const categoryData =
//         categoryResponse.data?.data ?? categoryResponse.data;

//       setProducts(
//         Array.isArray(productData)
//           ? productData
//           : productData?.products ?? []
//       );

//       setCategories(
//         Array.isArray(categoryData)
//           ? categoryData
//           : categoryData?.categories ?? []
//       );
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to load products. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   const getImageUrl = (image) => {
//     if (!image) return "";

//     if (typeof image === "object") {
//       image = image.url || image.path || image.filename || "";
//     }

//     if (typeof image !== "string" || !image) return "";

//     if (/^https?:\/\//i.test(image)) return image;

//     const baseURL =
//       api.defaults?.baseURL?.replace(/\/$/, "") ||
//       "http://localhost:5000";

//     if (image.startsWith("/")) return `${baseURL}${image}`;

//     return `${baseURL}/uploads/${image}`;
//   };

//   const calculatePrice = (originalPrice, discountPercentage) => {
//     const original = Number(originalPrice) || 0;
//     const discount = Number(discountPercentage) || 0;
//     return Math.max(0, original - (original * discount) / 100);
//   };

//   const handleFormChange = (event) => {
//     const { name, value, files } = event.target;

//     if (name === "image") {
//       setForm((previous) => ({
//         ...previous,
//         image: files?.[0] || null,
//       }));
//       return;
//     }

//     setForm((previous) => {
//       const updated = { ...previous, [name]: value };

//       if (name === "originalPrice" || name === "discountPercentage") {
//         const original =
//           name === "originalPrice" ? value : previous.originalPrice;
//         const discount =
//           name === "discountPercentage"
//             ? value
//             : previous.discountPercentage;

//         updated.price = calculatePrice(original, discount);
//       }

//       return updated;
//     });
//   };

//   const resetForm = () => {
//     setForm({ ...initialForm });
//     setEditingId(null);
//   };

//   const openAddForm = () => {
//     resetForm();
//     setError("");
//     setShowForm(true);
//   };

//   const openEditForm = (product) => {
//     setEditingId(product._id);
//     setForm({
//       name: product.name || "",
//       description: product.description || "",
//       category: product.category?._id || product.category || "",
//       originalPrice: product.originalPrice ?? product.price ?? "",
//       discountPercentage: product.discountPercentage ?? 0,
//       price: product.price ?? "",
//       status: product.status || "active",
//       image: null,
//     });
//     setError("");
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const wasEditing = Boolean(editingId);

//     if (!form.name.trim()) {
//       setError("Please enter a product name.");
//       return;
//     }

//     if (
//       form.originalPrice === "" ||
//       !Number.isFinite(Number(form.originalPrice)) ||
//       Number(form.originalPrice) < 0
//     ) {
//       setError("Please enter a valid original price.");
//       return;
//     }

//     if (
//       !Number.isFinite(Number(form.discountPercentage)) ||
//       Number(form.discountPercentage) < 0 ||
//       Number(form.discountPercentage) > 100
//     ) {
//       setError("Discount must be between 0 and 100%.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");

//       const formData = new FormData();
//       formData.append("name", form.name.trim());
//       formData.append("description", form.description);
//       formData.append("originalPrice", Number(form.originalPrice));
//       formData.append(
//         "discountPercentage",
//         Number(form.discountPercentage)
//       );
//       formData.append(
//         "price",
//         calculatePrice(form.originalPrice, form.discountPercentage)
//       );
//       formData.append("status", form.status);

//       if (form.category) {
//         formData.append("category", form.category);
//       }

//       if (form.image) {
//         formData.append("image", form.image);
//       }

//       if (wasEditing) {
//         await api.put(`/product/${editingId}`, formData);
//       } else {
//         await api.post("/product", formData);
//       }

//       resetForm();
//       setShowForm(false);
//       setSuccess(
//         wasEditing
//           ? "Product updated successfully!"
//           : "Product added successfully!"
//       );

//       await loadProducts();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save the product. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Open the confirmation modal instead of deleting immediately.
//   const handleDelete = (product) => {
//     setError("");
//     setDeleteTarget(product);
//   };

//   // Delete only after the user confirms.
//   const confirmDelete = async () => {
//     if (!deleteTarget || deleting) return;

//     const product = deleteTarget;

//     try {
//       setDeleting(true);
//       setError("");

//       await api.delete(`/product/${product._id}`);

//       setDeleteTarget(null);
//       setSuccess(`"${product.name}" deleted successfully!`);

//       await loadProducts();
//     } catch (err) {
//       setDeleteTarget(null);
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete the product. Please try again."
//       );
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const filteredProducts = products.filter((product) =>
//     `${product.name || ""} ${product.category?.name || ""}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   const activeCount = products.filter(
//     (product) => product.status === "active"
//   ).length;

//   const inactiveCount = products.length - activeCount;

//   const totalValue = products.reduce(
//     (total, product) => total + (Number(product.price) || 0),
//     0
//   );

//   return (
//     <div className="min-h-screen bg-[#FAF7F0] p-4 text-[#263B31] sm:p-6 lg:p-8">
//       <SuccessPopup message={success} onClose={closeSuccess} />

//       <DeleteConfirmPopup
//         product={deleteTarget}
//         deleting={deleting}
//         onCancel={() => {
//           if (!deleting) setDeleteTarget(null);
//         }}
//         onConfirm={confirmDelete}
//       />

//       <div className="mx-auto max-w-7xl space-y-6">
//         <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#829083]">
//               MODEZA / ADMIN
//             </p>
//             <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123F32] sm:text-4xl">
//               Product Management
//             </h1>
//             <p className="mt-2 text-sm text-[#788178]">
//               Manage your products, pricing, and inventory.
//             </p>
//           </div>

//           {!showForm && (
//             <button
//               type="button"
//               onClick={openAddForm}
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123F32] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#1B5141]"
//             >
//               <span className="text-xl">+</span> Add Product
//             </button>
//           )}
//         </div>

//         {error && (
//           <div
//             role="alert"
//             className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
//           >
//             <span>{error}</span>
//             <button
//               type="button"
//               onClick={() => setError("")}
//               aria-label="Dismiss error"
//               className="font-bold"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {showForm && (
//           <section className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white shadow-sm">
//             <div className="flex items-center justify-between gap-3 border-b border-[#EAE5DA] bg-[#F4F0E7] px-5 py-4 sm:px-7">
//               <div>
//                 <h2 className="text-xl font-bold text-[#123F32]">
//                   {editingId ? "Edit Product" : "Add New Product"}
//                 </h2>
//                 <p className="mt-1 text-sm text-[#788178]">
//                   Enter the product details below.
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false);
//                   resetForm();
//                   setError("");
//                 }}
//                 className="rounded-xl border border-[#D9D5C9] bg-white px-3 py-2 text-sm font-semibold text-[#526257] hover:bg-[#EAE5DA]"
//               >
//                 Close ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleFormChange}
//                     required
//                     placeholder="Example: Cotton Dress"
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A] focus:ring-2 focus:ring-[#46745A]/15"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Category
//                   </label>
//                   <select
//                     name="category"
//                     value={form.category}
//                     onChange={handleFormChange}
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A]"
//                   >
//                     <option value="">Select category</option>
//                     {categories.map((category) => (
//                       <option key={category._id} value={category._id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={form.description}
//                     onChange={handleFormChange}
//                     rows={4}
//                     placeholder="Describe the product..."
//                     className="w-full resize-y rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Original Price (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     name="originalPrice"
//                     value={form.originalPrice}
//                     onChange={handleFormChange}
//                     min="0"
//                     step="0.01"
//                     required
//                     placeholder="1999"
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Discount (%)
//                   </label>
//                   <input
//                     type="number"
//                     name="discountPercentage"
//                     value={form.discountPercentage}
//                     onChange={handleFormChange}
//                     min="0"
//                     max="100"
//                     step="1"
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A]"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Final Price (₹)
//                   </label>
//                   <div className="rounded-xl border border-[#D5E6D7] bg-[#EDF5EB] px-4 py-3 font-bold text-[#164D3D]">
//                     ₹
//                     {calculatePrice(
//                       form.originalPrice,
//                       form.discountPercentage
//                     ).toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </div>
//                   <p className="mt-1 text-xs text-[#849083]">
//                     Final price after discount.
//                   </p>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={form.status}
//                     onChange={handleFormChange}
//                     className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A]"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="mb-2 block text-sm font-semibold text-[#34483B]">
//                     Product Image {editingId ? "(optional)" : ""}
//                   </label>
//                   <input
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleFormChange}
//                     className="block w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] text-sm text-[#526257] file:mr-4 file:cursor-pointer file:border-0 file:bg-[#EAF2E8] file:px-4 file:py-3 file:font-semibold file:text-[#164D3D]"
//                   />
//                   {form.image && (
//                     <p className="mt-2 text-sm text-[#46745A]">
//                       Selected: {form.image.name}
//                     </p>
//                   )}
//                   {editingId &&
//                     !form.image &&
//                     products.find((item) => item._id === editingId)?.image && (
//                       <p className="mt-2 text-sm text-[#788178]">
//                         Existing image will be kept unless you upload a new one.
//                       </p>
//                     )}
//                 </div>
//               </div>

//               <div className="flex flex-col-reverse gap-3 border-t border-[#EAE5DA] pt-5 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     resetForm();
//                     setError("");
//                   }}
//                   className="rounded-xl border border-[#DCDDD2] px-5 py-3 font-semibold text-[#526257] hover:bg-[#F4F0E7]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-xl bg-[#123F32] px-6 py-3 font-semibold text-white hover:bg-[#1B5141] disabled:opacity-60"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editingId
//                       ? "Save Changes"
//                       : "Save Product"}
//                 </button>
//               </div>
//             </form>
//           </section>
//         )}

//         {!showForm && (
//           <>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//               <SummaryCard title="Total Products" value={products.length} icon="▦" />
//               <SummaryCard title="Active Products" value={activeCount} icon="✓" />
//               <SummaryCard title="Inactive Products" value={inactiveCount} icon="◷" />
//               <SummaryCard
//                 title="Combined Listed Prices"
//                 value={`₹${totalValue.toLocaleString("en-IN")}`}
//                 icon="₹"
//               />
//             </div>

//             <section className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white shadow-sm">
//               <div className="flex flex-col gap-4 border-b border-[#EAE5DA] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//                 <div>
//                   <h2 className="text-xl font-bold text-[#123F32]">
//                     All Products
//                   </h2>
//                   <p className="mt-1 text-sm text-[#788178]">
//                     {filteredProducts.length} product(s) found
//                   </p>
//                 </div>
//                 <input
//                   type="search"
//                   value={search}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder="Search products..."
//                   className="w-full rounded-xl border border-[#DCDDD2] bg-[#FFFEFB] px-4 py-3 outline-none focus:border-[#46745A] sm:max-w-xs"
//                 />
//               </div>

//               {loading ? (
//                 <div className="p-12 text-center">
//                   <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DDE7D9] border-t-[#164D3D]" />
//                   <p className="mt-4 text-sm text-[#788178]">
//                     Loading products...
//                   </p>
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <div className="text-4xl text-[#A7B6A5]">▦</div>
//                   <h3 className="mt-3 font-bold text-[#123F32]">
//                     No products found
//                   </h3>
//                   <p className="mt-1 text-sm text-[#788178]">
//                     Add a new product or try a different search.
//                   </p>
//                   <button
//                     type="button"
//                     onClick={openAddForm}
//                     className="mt-5 rounded-xl bg-[#123F32] px-5 py-3 font-semibold text-white hover:bg-[#1B5141]"
//                   >
//                     + Add Product
//                   </button>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[760px] text-left">
//                     <thead className="bg-[#F4F0E7] text-xs uppercase tracking-wider text-[#788178]">
//                       <tr>
//                         <th className="px-6 py-4 font-bold">Product</th>
//                         <th className="px-6 py-4 font-bold">Category</th>
//                         <th className="px-6 py-4 font-bold">Price</th>
//                         <th className="px-6 py-4 font-bold">Discount</th>
//                         <th className="px-6 py-4 font-bold">Status</th>
//                         <th className="px-6 py-4 text-right font-bold">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-[#F0ECE3]">
//                       {filteredProducts.map((product) => {
//                         const imageUrl = getImageUrl(product.image);

//                         return (
//                           <tr key={product._id} className="transition hover:bg-[#FCFAF5]">
//                             <td className="px-6 py-4">
//                               <div className="flex items-center gap-3">
//                                 {imageUrl ? (
//                                   <img
//                                     src={imageUrl}
//                                     alt={product.name}
//                                     className="h-14 w-12 rounded-lg border border-[#E5E0D5] object-cover"
//                                     onError={(event) => {
//                                       event.currentTarget.style.display = "none";
//                                     }}
//                                   />
//                                 ) : (
//                                   <div className="flex h-14 w-12 items-center justify-center rounded-lg bg-[#EAF2E8] text-xl text-[#164D3D]">
//                                     ♡
//                                   </div>
//                                 )}
//                                 <div className="max-w-xs">
//                                   <p className="font-semibold text-[#263B31]">
//                                     {product.name}
//                                   </p>
//                                   <p className="mt-1 line-clamp-2 text-xs text-[#899087]">
//                                     {product.description || "No description"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </td>

//                             <td className="px-6 py-4 text-sm text-[#64756A]">
//                               {product.category?.name || "—"}
//                             </td>

//                             <td className="px-6 py-4">
//                               <p className="font-bold text-[#164D3D]">
//                                 ₹{Number(product.price || 0).toLocaleString("en-IN")}
//                               </p>
//                               {Number(product.discountPercentage) > 0 && (
//                                 <p className="mt-1 text-xs text-[#899087] line-through">
//                                   ₹{Number(product.originalPrice || 0).toLocaleString("en-IN")}
//                                 </p>
//                               )}
//                             </td>

//                             <td className="px-6 py-4">
//                               {Number(product.discountPercentage) > 0 ? (
//                                 <span className="rounded-full bg-[#EAF2E8] px-3 py-1 text-xs font-bold text-[#176747]">
//                                   {product.discountPercentage}% OFF
//                                 </span>
//                               ) : (
//                                 <span className="text-sm text-[#899087]">
//                                   No discount
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-6 py-4">
//                               <span
//                                 className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
//                                   product.status === "active"
//                                     ? "bg-[#E4F4E9] text-[#176747]"
//                                     : "bg-[#F0EBE2] text-[#817866]"
//                                 }`}
//                               >
//                                 {product.status || "active"}
//                               </span>
//                             </td>

//                             <td className="px-6 py-4">
//                               <div className="flex justify-end gap-2">
//                                 <button
//                                   type="button"
//                                   onClick={() => openEditForm(product)}
//                                   className="rounded-lg border border-[#D5DFD2] bg-[#F4F8F1] px-3 py-2 text-sm font-semibold text-[#164D3D] hover:bg-[#E4EEDF]"
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   type="button"
//                                   onClick={() => handleDelete(product)}
//                                   className="rounded-lg border border-[#F0D7D2] bg-[#FFF7F5] px-3 py-2 text-sm font-semibold text-[#A34435] hover:bg-[#FCE9E5]"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }





import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  category: "",
  originalPrice: "",
  discountPercentage: 0,
  price: "",
  status: "active",
  image: null,
};

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

function getResponseData(response) {
  return response?.data?.data ?? response?.data;
}

// SUCCESS POPUP
function SuccessPopup({ message, onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed right-4 top-5 z-[100000] w-[calc(100%-2rem)] max-w-sm animate-[slideIn_.3s_ease-out]">
      <div className="flex items-start gap-3 rounded-2xl border border-[#D8E8D9] bg-[#FFFCF8] p-4 shadow-2xl">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E3F1E3] text-xl font-bold text-[#246343]">
          ✓
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[#123F32]">
            Success!
          </h3>
          <p className="mt-1 break-words text-sm text-[#6D786E]">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close success message"
          className="rounded-lg px-2 text-xl text-[#829083] hover:bg-[#F1EEE5]"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// DELETE CONFIRMATION POPUP
function DeleteAlert({ product, onCancel, onConfirm, deleting }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#123F32]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5E0D5] bg-[#FFFCF8] shadow-2xl"
      >
        <div className="h-2 bg-[#A34435]" />

        <div className="px-6 pb-7 pt-7 sm:px-8">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-[#F8E5DF] bg-[#FCE9E5] text-3xl text-[#A34435]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#829083]">
              MODEZA / ADMIN
            </p>

            <h2
              id="delete-product-title"
              className="mt-3 text-2xl font-bold tracking-tight text-[#123F32] sm:text-3xl"
            >
              Delete Product?
            </h2>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#788178]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#123F32]">
                {product.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 rounded-xl border border-[#DCDDD2] bg-white px-5 py-3 text-sm font-semibold text-[#526257] transition hover:border-[#123F32] hover:bg-[#F4F0E7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 rounded-xl bg-[#A34435] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#A34435]/15 transition hover:bg-[#87372B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Deleting...
                </span>
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-[#9A9E94]">
            The product will be removed from your catalogue.
          </p>
        </div>
      </div>
    </div>
  );
}

// SUMMARY CARD
function SummaryCard({ title, value, description, icon }) {
  return (
    <div className="rounded-2xl border border-[#E8E2D6] bg-[#FFFCF8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#7D877D]">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-[#123F32]">
            {value}
          </h3>
          <p className="mt-1 text-xs text-[#92988E]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EFE5] text-xl text-[#164D3D]">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        api.get("/product"),
        api.get("/category"),
      ]);

      const productData = getResponseData(productResponse);
      const categoryData = getResponseData(categoryResponse);

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData?.products ?? []
      );

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : categoryData?.categories ?? []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "object") {
      image = image.url || image.path || image.filename || "";
    }

    if (!image || typeof image !== "string") return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const baseURL = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");

    if (image.startsWith("/")) {
      return `${baseURL}${image}`;
    }

    return `${baseURL}/uploads/${image}`;
  };

  const calculatePrice = (originalPrice, discountPercentage) => {
    const original = Number(originalPrice || 0);
    const discount = Number(discountPercentage || 0);

    return Math.max(
      0,
      original - (original * discount) / 100
    ).toFixed(2);
  };

  const handleFormChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      setForm((previous) => ({
        ...previous,
        image: files?.[0] || null,
      }));
      return;
    }

    setForm((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "originalPrice" || name === "discountPercentage") {
        updated.price = calculatePrice(
          name === "originalPrice" ? value : previous.originalPrice,
          name === "discountPercentage"
            ? value
            : previous.discountPercentage
        );
      }

      return updated;
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setError("");
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setError("");
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      category:
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "",
      originalPrice: product.originalPrice ?? product.price ?? "",
      discountPercentage: product.discountPercentage ?? 0,
      price: product.price ?? "",
      status: product.status || "active",
      image: null,
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (
      form.originalPrice === "" ||
      !Number.isFinite(Number(form.originalPrice)) ||
      Number(form.originalPrice) < 0
    ) {
      setError("Please enter a valid original price.");
      return;
    }

    const discount = Number(form.discountPercentage);

    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      setError("Discount must be between 0 and 100.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description);
      formData.append("originalPrice", Number(form.originalPrice));
      formData.append("discountPercentage", discount);
      formData.append(
        "price",
        calculatePrice(form.originalPrice, discount)
      );
      formData.append("status", form.status);

      if (form.category) {
        formData.append("category", form.category);
      }

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await api.put(`/product/${editingId}`, formData);
        setSuccess("Product updated successfully!");
      } else {
        await api.post("/product", formData);
        setSuccess("Product added successfully!");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Open the custom delete popup
  const handleDelete = (product) => {
    setError("");
    setSuccess("");
    setDeleteTarget(product);
  };

  // Delete only after confirmation
  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;

    const product = deleteTarget;

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/product/${product._id}`);

      setDeleteTarget(null);
      setSuccess(`${product.name} deleted successfully!`);

      await loadProducts();
    } catch (err) {
      setDeleteTarget(null);
      setError(
        err.response?.data?.message ||
          "Failed to delete the product. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const categoryName =
      typeof product.category === "object"
        ? product.category?.name || ""
        : "";

    const searchText = search.toLowerCase();

    return (
      (product.name || "").toLowerCase().includes(searchText) ||
      categoryName.toLowerCase().includes(searchText)
    );
  });

  const activeCount = products.filter(
    (product) => product.status === "active"
  ).length;

  const inactiveCount = products.filter(
    (product) => product.status === "inactive"
  ).length;

  const totalValue = products.reduce(
    (total, product) => total + Number(product.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] px-4 py-6 text-[#123F32] sm:px-6 lg:px-8">
      <SuccessPopup
        message={success}
        onClose={() => setSuccess("")}
      />

      <DeleteAlert
        product={deleteTarget}
        deleting={deleting}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />

      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADER */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#879181]">
              MODEZA / ADMIN PANEL
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Product Management
            </h1>
            <p className="mt-2 text-sm text-[#788178]">
              Manage your products, pricing, discounts and catalogue.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123F32] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#164D3D]"
          >
            <span className="text-xl">+</span>
            Add Product
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-[#F0D1C9] bg-[#FFF0EC] p-4 text-sm text-[#963F32]"
          >
            <span className="text-lg">!</span>
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Products"
            value={products.length}
            description="Products in catalogue"
            icon="◈"
          />
          <SummaryCard
            title="Active Products"
            value={activeCount}
            description="Visible products"
            icon="✓"
          />
          <SummaryCard
            title="Inactive Products"
            value={inactiveCount}
            description="Hidden products"
            icon="◌"
          />
          <SummaryCard
            title="Catalogue Value"
            value={money(totalValue)}
            description="Based on current prices"
            icon="₹"
          />
        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-[#E8E2D6] bg-[#FFFCF8] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAE5DB] px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-[#899085]">
                  Enter product details below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EEE6] text-xl text-[#526257] transition hover:bg-[#E5E0D5]"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-7">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Cotton Midi Dress"
                    required
                    className="w-full rounded-xl border border-[#DDDCCF] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#DDDCCF] bg-white px-4 py-3 text-sm outline-none focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Describe the fabric, fit, style and features..."
                    className="w-full resize-y rounded-xl border border-[#DDDCCF] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Original Price (₹){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={form.originalPrice}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="1999"
                    className="w-full rounded-xl border border-[#DDDCCF] bg-white px-4 py-3 text-sm outline-none focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={form.discountPercentage}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="1"
                    className="w-full rounded-xl border border-[#DDDCCF] bg-white px-4 py-3 text-sm outline-none focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Final Selling Price (₹)
                  </label>
                  <div className="rounded-xl border border-[#D8E6D6] bg-[#EDF4E9] px-4 py-3">
                    <span className="text-lg font-bold text-[#164D3D]">
                      {money(
                        calculatePrice(
                          form.originalPrice,
                          form.discountPercentage
                        )
                      )}
                    </span>
                    <p className="mt-1 text-xs text-[#758775]">
                      Calculated automatically from discount
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-[#DDDCCF] bg-white px-4 py-3 text-sm outline-none focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Product Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFormChange}
                    className="block w-full rounded-xl border border-[#DDDCCF] bg-white text-sm text-[#526257] file:mr-4 file:border-0 file:bg-[#E8EFE5] file:px-4 file:py-3 file:font-semibold file:text-[#164D3D] hover:file:bg-[#DCE8D8]"
                  />

                  {form.image instanceof File && (
                    <p className="mt-2 text-xs text-[#788178]">
                      Selected: {form.image.name}
                    </p>
                  )}

                  {editingId &&
                    !form.image &&
                    products.find((product) => product._id === editingId)
                      ?.image && (
                      <p className="mt-2 text-xs text-[#788178]">
                        Current image will be kept unless a new image is selected.
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#EAE5DB] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-[#DCDDD2] px-6 py-3 text-sm font-semibold text-[#526257] transition hover:bg-[#F4F0E7] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#123F32] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#164D3D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRODUCT TABLE */}
        <div className="overflow-hidden rounded-2xl border border-[#E8E2D6] bg-[#FFFCF8] shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#EAE5DB] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-xl font-bold">All Products</h2>
              <p className="mt-1 text-sm text-[#899085]">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899085]">
                ⌕
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-[#DDDCCF] bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#164D3D] focus:ring-2 focus:ring-[#164D3D]/10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-[#788178]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DCE5D8] border-t-[#164D3D]" />
              <p className="text-sm">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8EFE5] text-3xl text-[#164D3D]">
                ◈
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#123F32]">
                No products found
              </h3>
              <p className="mt-2 text-sm text-[#899085]">
                {search
                  ? "Try another search term."
                  : "Add your first product to get started."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 rounded-xl bg-[#123F32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#164D3D]"
                >
                  + Add Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#F5F2E9] text-xs uppercase tracking-wider text-[#788178]">
                    <th className="px-5 py-4 font-bold">Product</th>
                    <th className="px-5 py-4 font-bold">Category</th>
                    <th className="px-5 py-4 font-bold">Price</th>
                    <th className="px-5 py-4 font-bold">Discount</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEE9DF]">
                  {filteredProducts.map((product) => {
                    const categoryName =
                      typeof product.category === "object"
                        ? product.category?.name || "Uncategorised"
                        : "Uncategorised";

                    const imageUrl = getImageUrl(product.image);

                    return (
                      <tr
                        key={product._id}
                        className="transition hover:bg-[#FAF8F2]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E8E2D6] bg-[#F0EEE6]">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xl text-[#899085]">
                                  ♧
                                </div>
                              )}
                            </div>

                            <div className="max-w-xs">
                              <p className="font-semibold text-[#123F32]">
                                {product.name}
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs text-[#899085]">
                                {product.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#657165]">
                          {categoryName}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-[#123F32]">
                            {money(product.price)}
                          </p>

                          {Number(product.discountPercentage || 0) > 0 && (
                            <p className="mt-1 text-xs text-[#92988E] line-through">
                              {money(product.originalPrice)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {Number(product.discountPercentage || 0) > 0 ? (
                            <span className="rounded-full bg-[#FCE9E5] px-3 py-1.5 text-xs font-bold text-[#A34435]">
                              {product.discountPercentage}% OFF
                            </span>
                          ) : (
                            <span className="text-sm text-[#899085]">
                              No discount
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              product.status === "active"
                                ? "bg-[#E3F1E3] text-[#246343]"
                                : "bg-[#F0EEE6] text-[#788178]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.status === "active"
                                  ? "bg-[#398352]"
                                  : "bg-[#92988E]"
                              }`}
                            />
                            {product.status || "inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(product)}
                              className="rounded-lg border border-[#DCE5D8] bg-[#EDF4E9] px-3 py-2 text-xs font-bold text-[#164D3D] transition hover:bg-[#DCE8D8]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              className="rounded-lg border border-[#F0D1C9] bg-[#FFF0EC] px-3 py-2 text-xs font-bold text-[#A34435] transition hover:bg-[#FCE0D9]"
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
        </div>

        <p className="mt-5 text-center text-xs text-[#92988E]">
          MODEZA · Product Management
        </p>
      </div>
    </div>
  );
}
