

// import { useCallback, useEffect, useState } from "react";
// import api from "../../services/api";

// const initialForm = {
//   name: "",
//   description: "",
//   status: "active",
// };

// // Normalize category status
// function getStatus(category) {
//   const status = String(category?.status ?? "active")
//     .trim()
//     .toLowerCase();

//   return status === "inactive" ? "inactive" : "active";
// }

// // Handle API response data formats
// function getCategoryArray(data) {
//   const result = data?.data ?? data;

//   if (Array.isArray(result)) return result;
//   if (Array.isArray(result?.categories)) return result.categories;

//   return [];
// }

// // SUCCESS / ERROR TOAST
// function Toast({ toast, onClose }) {
//   useEffect(() => {
//     if (!toast.show) return;

//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [toast, onClose]);

//   if (!toast.show) return null;

//   const success = toast.type === "success";

//   return (
//     <div className="fixed right-5 top-5 z-[100000] w-[calc(100%-40px)] max-w-sm">
//       <div
//         role="status"
//         aria-live="polite"
//         className={`overflow-hidden rounded-2xl border bg-[#FFFCF8] shadow-2xl ${
//           success ? "border-[#D8E8D9]" : "border-red-200"
//         }`}
//       >
//         <div className="flex items-start gap-3 p-4">
//           <div
//             className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
//               success
//                 ? "bg-[#E3F1E3] text-[#246343]"
//                 : "bg-red-50 text-red-600"
//             }`}
//           >
//             {success ? "✓" : "!"}
//           </div>

//           <div className="min-w-0 flex-1">
//             <p
//               className={`font-bold ${
//                 success ? "text-[#123F32]" : "text-red-700"
//               }`}
//             >
//               {success ? "Success!" : "Something went wrong"}
//             </p>
//             <p className="mt-1 break-words text-sm text-[#788178]">
//               {toast.text}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close notification"
//             className="text-xl text-[#829083] hover:text-[#123F32]"
//           >
//             ×
//           </button>
//         </div>

//         <div className="h-1 bg-[#E8EEE6]">
//           <div
//             key={toast.key}
//             className={`h-full animate-[shrink_3s_linear_forwards] ${
//               success ? "bg-[#164D3D]" : "bg-red-500"
//             }`}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // CONFIRMATION MODAL
// function CategoryConfirmModal({
//   action,
//   category,
//   busy,
//   onCancel,
//   onConfirm,
// }) {
//   if (!action || !category) return null;

//   const isDelete = action === "delete";
//   const isActivate = action === "activate";

//   const heading = isDelete
//     ? "Delete Category?"
//     : isActivate
//       ? "Activate Category?"
//       : "Deactivate Category?";

//   const description = isDelete
//     ? "This category will be removed from your catalogue. This action cannot be undone."
//     : isActivate
//       ? "This category will become active and available for use in your store."
//       : "This category will become inactive and unavailable for new product selections.";

//   const buttonStyle = isDelete
//     ? "bg-[#A34435] hover:bg-[#87372B]"
//     : isActivate
//       ? "bg-[#164D3D] hover:bg-[#123F32]"
//       : "bg-[#9A7028] hover:bg-[#7F5B20]";

//   return (
//     <div
//       className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#123F32]/60 p-4 backdrop-blur-sm"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget && !busy) {
//           onCancel();
//         }
//       }}
//     >
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="category-confirm-title"
//         className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5E0D5] bg-[#FFFCF8] shadow-2xl"
//       >
//         <div
//           className={`h-2 ${
//             isDelete
//               ? "bg-[#A34435]"
//               : isActivate
//                 ? "bg-[#164D3D]"
//                 : "bg-[#B58A3A]"
//           }`}
//         />

//         <div className="px-6 pb-7 pt-7 sm:px-8">
//           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8EEE6] text-3xl font-bold text-[#164D3D]">
//             {isDelete ? "⌫" : isActivate ? "✓" : "!"}
//           </div>

//           <div className="mt-5 text-center">
//             <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#829083]">
//               MODEZA / ADMIN
//             </p>

//             <h2
//               id="category-confirm-title"
//               className="mt-3 text-2xl font-bold text-[#123F32]"
//             >
//               {heading}
//             </h2>

//             <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#788178]">
//               {description}
//             </p>

//             <div className="mt-5 rounded-xl border border-[#E8E2D6] bg-[#F7F4EC] px-4 py-3">
//               <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#92988E]">
//                 Selected Category
//               </p>
//               <p className="mt-1 break-words font-bold text-[#123F32]">
//                 {category.name}
//               </p>
//             </div>
//           </div>

//           <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
//             <button
//               type="button"
//               onClick={onCancel}
//               disabled={busy}
//               className="flex-1 rounded-xl border border-[#DCDDD2] bg-white px-5 py-3 text-sm font-semibold text-[#526257] hover:bg-[#F4F0E7] disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               onClick={onConfirm}
//               disabled={busy}
//               className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 ${buttonStyle}`}
//             >
//               {busy ? "Please wait..." : isDelete ? "Yes, Delete" : isActivate ? "Yes, Activate" : "Yes, Deactivate"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AdminCategories() {
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState({ ...initialForm });
//   const [editingId, setEditingId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [toast, setToast] = useState({
//     show: false,
//     text: "",
//     type: "success",
//     key: 0,
//   });

//   const [confirmAction, setConfirmAction] = useState(null);
//   const [actionBusy, setActionBusy] = useState(false);

//   const showToast = useCallback((text, type = "success") => {
//     setToast((previous) => ({
//       show: true,
//       text,
//       type,
//       key: previous.key + 1,
//     }));
//   }, []);

//   const closeToast = useCallback(() => {
//     setToast((previous) => ({ ...previous, show: false }));
//   }, []);

//   const fetchCategories = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await api.get("/category");
//       const data = getCategoryArray(response.data);

//       setCategories(data);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Unable to load categories. Check the backend API."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   function openAddForm() {
//     setForm({ ...initialForm });
//     setEditingId(null);
//     setError("");
//     setShowForm(true);
//   }

//   function closeForm() {
//     setShowForm(false);
//     setForm({ ...initialForm });
//     setEditingId(null);
//     setError("");
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setError("");

//     const name = form.name.trim();

//     if (!name) {
//       setError("Category name is required.");
//       return;
//     }

//     const payload = {
//       name,
//       description: form.description.trim(),
//       status: form.status,
//     };

//     try {
//       setSaving(true);

//       if (editingId) {
//         await api.put(`/category/${editingId}`, payload);
//         showToast("Category updated successfully.");
//       } else {
//         await api.post("/category", payload);
//         showToast("Category added successfully.");
//       }

//       closeForm();
//       await fetchCategories();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Unable to save category. Please check your API routes."
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   function handleEdit(category) {
//     setForm({
//       name: category.name || "",
//       description: category.description || "",
//       status: getStatus(category),
//     });

//     setEditingId(category._id);
//     setError("");
//     setShowForm(true);

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   function handleToggle(category) {
//     const status = getStatus(category);

//     setError("");
//     setConfirmAction({
//       type: status === "active" ? "deactivate" : "activate",
//       category,
//     });
//   }

//   function handleDelete(category) {
//     setError("");
//     setConfirmAction({ type: "delete", category });
//   }

//   async function confirmCategoryAction() {
//     if (!confirmAction || actionBusy) return;

//     const { type, category } = confirmAction;

//     try {
//       setActionBusy(true);
//       setError("");

//       if (type === "delete") {
//         await api.delete(`/category/${category._id}`);

//         if (editingId === category._id) {
//           closeForm();
//         }

//         setConfirmAction(null);
//         showToast("Category deleted successfully.");
//       } else {
//         // Backend must implement PATCH /category/:id/status
//         await api.patch(`/category/${category._id}/status`);

//         setConfirmAction(null);
//         showToast(
//           type === "activate"
//             ? "Category activated successfully."
//             : "Category deactivated successfully."
//         );
//       }

//       await fetchCategories();
//     } catch (err) {
//       setConfirmAction(null);

//       showToast(
//         err.response?.data?.message ||
//           (type === "delete"
//             ? "Unable to delete category. Check the delete API route."
//             : "Unable to change status. Check PATCH /category/:id/status in the backend."),
//         "error"
//       );
//     } finally {
//       setActionBusy(false);
//     }
//   }

//   const filtered = categories.filter((category) => {
//     const term = search.trim().toLowerCase();

//     return (
//       String(category.name || "").toLowerCase().includes(term) ||
//       String(category.description || "").toLowerCase().includes(term)
//     );
//   });

//   const activeCount = categories.filter(
//     (category) => getStatus(category) === "active"
//   ).length;

//   const inactiveCount = categories.filter(
//     (category) => getStatus(category) === "inactive"
//   ).length;

//   const inputStyle =
//     "w-full rounded-xl border border-[#DEDfd3] bg-white px-4 py-3 text-sm text-[#174638] outline-none transition focus:border-[#174638] focus:ring-2 focus:ring-[#174638]/10";

//   return (
//     <div className="min-h-screen bg-[#FAF7F0] p-4 text-[#174638] sm:p-6 lg:p-8">
//       <Toast toast={toast} onClose={closeToast} />

//       <CategoryConfirmModal
//         action={confirmAction?.type}
//         category={confirmAction?.category}
//         busy={actionBusy}
//         onCancel={() => {
//           if (!actionBusy) setConfirmAction(null);
//         }}
//         onConfirm={confirmCategoryAction}
//       />

//       <div className="mx-auto max-w-7xl space-y-6">
//         {/* PAGE HEADER */}
//         <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A785C]">
//               MODEZA / ADMIN
//             </p>
//             <h1 className="mt-2 text-3xl font-bold tracking-tight">
//               Categories
//             </h1>
//             <p className="mt-2 text-sm text-[#827969]">
//               Manage your collections and category status.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={openAddForm}
//             className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123F32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B3529]"
//           >
//             <span className="text-lg">+</span>
//             Add Category
//           </button>
//         </div>

//         {/* PAGE ERROR */}
//         {error && !showForm && (
//           <div
//             role="alert"
//             className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//           >
//             <span>{error}</span>
//             <button
//               type="button"
//               onClick={() => setError("")}
//               aria-label="Close error"
//               className="text-lg font-bold"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* STATISTICS */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           {[
//             { label: "Total Categories", value: categories.length, icon: "▤" },
//             { label: "Active Categories", value: activeCount, icon: "✓" },
//             { label: "Inactive Categories", value: inactiveCount, icon: "◷" },
//           ].map((item) => (
//             <div
//               key={item.label}
//               className="rounded-2xl border border-[#E9DFCF] bg-[#FFFCF8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//             >
//               <div className="flex items-center justify-between">
//                 <p className="text-sm text-[#827969]">{item.label}</p>
//                 <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EEE6] text-lg text-[#174638]">
//                   {item.icon}
//                 </span>
//               </div>
//               <p className="mt-3 text-3xl font-bold">{item.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* ADD / EDIT FORM */}
//         {showForm && (
//           <section className="rounded-2xl border border-[#E2DFD2] bg-[#FFFCF8] p-5 shadow-md sm:p-7">
//             <div className="mb-6 flex items-start justify-between gap-4">
//               <div>
//                 <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8562]">
//                   CATEGORY DETAILS
//                 </p>
//                 <h2 className="mt-2 text-xl font-bold">
//                   {editingId ? "Edit Category" : "Add New Category"}
//                 </h2>
//                 <p className="mt-1 text-sm text-[#827969]">
//                   Enter the category information below.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeForm}
//                 aria-label="Close form"
//                 className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E4D8C5] text-xl text-[#655C4E] hover:bg-[#FAF7F0]"
//               >
//                 ×
//               </button>
//             </div>

//             {error && (
//               <div
//                 role="alert"
//                 className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
//               >
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 <div>
//                   <label className="mb-2 block text-sm font-semibold">
//                     Category Name *
//                   </label>
//                   <input
//                     name="name"
//                     value={form.name}
//                     onChange={(event) =>
//                       setForm((previous) => ({
//                         ...previous,
//                         name: event.target.value,
//                       }))
//                     }
//                     placeholder="e.g. Cotton Dresses"
//                     className={inputStyle}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={form.status}
//                     onChange={(event) =>
//                       setForm((previous) => ({
//                         ...previous,
//                         status: event.target.value,
//                       }))
//                     }
//                     className={inputStyle}
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-semibold">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={form.description}
//                   onChange={(event) =>
//                     setForm((previous) => ({
//                       ...previous,
//                       description: event.target.value,
//                     }))
//                   }
//                   placeholder="Describe this category..."
//                   rows={3}
//                   className={inputStyle}
//                 />
//               </div>

//               <div className="flex flex-wrap gap-3 border-t border-[#EEE8DD] pt-5">
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="rounded-xl bg-[#123F32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0B3529] disabled:opacity-60"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editingId
//                       ? "Update Category"
//                       : "Save Category"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   disabled={saving}
//                   className="rounded-xl border border-[#DED8C9] px-6 py-3 text-sm font-semibold text-[#655C4E] hover:bg-[#FAF7F0] disabled:opacity-60"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </section>
//         )}

//         {/* CATEGORY LIST */}
//         <section className="overflow-hidden rounded-2xl border border-[#E9DFCF] bg-[#FFFCF8] shadow-sm">
//           <div className="flex flex-col gap-4 border-b border-[#EEE5D8] p-5 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8562]">
//                 COLLECTIONS
//               </p>
//               <h2 className="mt-2 text-xl font-bold">Category List</h2>
//               <p className="mt-1 text-sm text-[#827969]">
//                 Showing {filtered.length} of {categories.length} categories
//               </p>
//             </div>

//             <div className="flex gap-2">
//               <input
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search categories..."
//                 className={`${inputStyle} sm:max-w-xs`}
//               />
//               <button
//                 type="button"
//                 onClick={fetchCategories}
//                 title="Refresh categories"
//                 disabled={loading}
//                 className="shrink-0 rounded-xl border border-[#DED8C9] px-4 py-3 text-sm font-semibold hover:bg-[#FAF7F0] disabled:opacity-50"
//               >
//                 ↻
//               </button>
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex min-h-48 items-center justify-center gap-3 p-12 text-sm text-[#827969]">
//               <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#DCE5D8] border-t-[#164D3D]" />
//               Loading categories...
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EEE6] text-2xl text-[#174638]">
//                 ▤
//               </div>
//               <p className="mt-4 font-semibold">No categories found</p>
//               <p className="mt-2 text-sm text-[#827969]">
//                 {search
//                   ? "Try a different search term."
//                   : "Add your first category to get started."}
//               </p>
//               {!search && (
//                 <button
//                   type="button"
//                   onClick={openAddForm}
//                   className="mt-4 rounded-xl bg-[#123F32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B3529]"
//                 >
//                   + Add Category
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[760px] text-left">
//                 <thead className="bg-[#F5F0E6]">
//                   <tr className="text-[10px] uppercase tracking-[0.15em] text-[#716958]">
//                     <th className="px-5 py-4 font-bold">Category</th>
//                     <th className="px-5 py-4 font-bold">Description</th>
//                     <th className="px-5 py-4 font-bold">Status</th>
//                     <th className="px-5 py-4 text-right font-bold">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-[#F0E8DC]">
//                   {filtered.map((category) => {
//                     const status = getStatus(category);
//                     const isActive = status === "active";

//                     return (
//                       <tr
//                         key={category._id}
//                         className="transition hover:bg-[#FCFAF5]"
//                       >
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-[#123F32]">
//                             {category.name}
//                           </p>
//                           <p className="mt-1 max-w-[200px] truncate text-xs text-[#A09686]">
//                             ID: {category._id}
//                           </p>
//                         </td>

//                         <td className="max-w-xs px-5 py-4 text-sm text-[#827969]">
//                           {category.description || "No description"}
//                         </td>

//                         <td className="px-5 py-4">
//                           <span
//                             className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
//                               isActive
//                                 ? "bg-[#E5EEE5] text-[#245A3E]"
//                                 : "bg-[#F5EAD5] text-[#8A6426]"
//                             }`}
//                           >
//                             <span
//                               className={`h-1.5 w-1.5 rounded-full ${
//                                 isActive ? "bg-[#398352]" : "bg-[#B58A3A]"
//                               }`}
//                             />
//                             {status}
//                           </span>
//                         </td>

//                         <td className="px-5 py-4">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               type="button"
//                               onClick={() => handleEdit(category)}
//                               className="rounded-lg border border-[#D8C9AE] px-3 py-2 text-xs font-semibold text-[#174638] hover:bg-[#F5F0E6]"
//                             >
//                               Edit
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() => handleToggle(category)}
//                               className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
//                                 isActive
//                                   ? "border-[#E6D4A9] text-[#8A6426] hover:bg-[#FBF3E2]"
//                                   : "border-[#CFE1CE] text-[#245A3E] hover:bg-[#EAF3E8]"
//                               }`}
//                             >
//                               {isActive ? "Deactivate" : "Activate"}
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() => handleDelete(category)}
//                               className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <div className="flex flex-col gap-2 border-t border-[#EEE5D8] bg-[#FCFAF5] px-5 py-3 text-[10px] tracking-wide text-[#827969] sm:flex-row sm:justify-between">
//             <span>MODEZA · CATEGORY MANAGEMENT</span>
//             <span>© 2026 MODEZA</span>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }





import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  status: "active",
  image: null,
};

const API_ORIGIN = "http://localhost:5000";

function getStatus(category) {
  return String(category?.status ?? "active").trim().toLowerCase() ===
    "inactive"
    ? "inactive"
    : "active";
}

function getCategoryArray(data) {
  const result = data?.data ?? data;

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.categories)) return result.categories;

  return [];
}

function getImageUrl(image) {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${API_ORIGIN}/${String(image).replace(/^\/+/, "")}`;
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast.show) return undefined;

    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast.show) return null;

  const success = toast.type === "success";

  return (
    <div className="fixed right-5 top-5 z-[100000] w-[calc(100%-40px)] max-w-sm">
      <div
        role="status"
        aria-live="polite"
        className={`overflow-hidden rounded-2xl border bg-[#FFFCF8] shadow-2xl ${
          success ? "border-[#D8E8D9]" : "border-red-200"
        }`}
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
              success
                ? "bg-[#E3F1E3] text-[#246343]"
                : "bg-red-50 text-red-600"
            }`}
          >
            {success ? "✓" : "!"}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`font-bold ${
                success ? "text-[#123F32]" : "text-red-700"
              }`}
            >
              {success ? "Success!" : "Something went wrong"}
            </p>
            <p className="mt-1 break-words text-sm text-[#788178]">
              {toast.text}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="text-xl text-[#829083] hover:text-[#123F32]"
          >
            ×
          </button>
        </div>

        <div className="h-1 bg-[#E8EEE6]">
          <div
            key={toast.key}
            className={`h-full ${
              success ? "bg-[#164D3D]" : "bg-red-500"
            }`}
            style={{
              animation: "category-toast-shrink 3s linear forwards",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes category-toast-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

function CategoryConfirmModal({
  action,
  category,
  busy,
  onCancel,
  onConfirm,
}) {
  if (!action || !category) return null;

  const isDelete = action === "delete";
  const isActivate = action === "activate";

  const heading = isDelete
    ? "Delete Category?"
    : isActivate
      ? "Activate Category?"
      : "Deactivate Category?";

  const description = isDelete
    ? "This category will be removed from your catalogue. This action cannot be undone."
    : isActivate
      ? "This category will become active and available for use in your store."
      : "This category will become inactive and unavailable for new product selections.";

  const buttonStyle = isDelete
    ? "bg-[#A34435] hover:bg-[#87372B]"
    : isActivate
      ? "bg-[#164D3D] hover:bg-[#123F32]"
      : "bg-[#9A7028] hover:bg-[#7F5B20]";

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#123F32]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-confirm-title"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5E0D5] bg-[#FFFCF8] shadow-2xl"
      >
        <div
          className={`h-2 ${
            isDelete
              ? "bg-[#A34435]"
              : isActivate
                ? "bg-[#164D3D]"
                : "bg-[#B58A3A]"
          }`}
        />

        <div className="px-6 pb-7 pt-7 sm:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8EEE6] text-3xl font-bold text-[#164D3D]">
            {isDelete ? "⌫" : isActivate ? "✓" : "!"}
          </div>

          <div className="mt-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#829083]">
              MODEZA / ADMIN
            </p>

            <h2
              id="category-confirm-title"
              className="mt-3 text-2xl font-bold text-[#123F32]"
            >
              {heading}
            </h2>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#788178]">
              {description}
            </p>

            <div className="mt-5 rounded-xl border border-[#E8E2D6] bg-[#F7F4EC] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#92988E]">
                Selected Category
              </p>
              <p className="mt-1 break-words font-bold text-[#123F32]">
                {category.name}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="flex-1 rounded-xl border border-[#DCDDD2] bg-white px-5 py-3 text-sm font-semibold text-[#526257] hover:bg-[#F4F0E7] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 ${buttonStyle}`}
            >
              {busy
                ? "Please wait..."
                : isDelete
                  ? "Yes, Delete"
                  : isActivate
                    ? "Yes, Activate"
                    : "Yes, Deactivate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ ...initialForm });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [toast, setToast] = useState({
    show: false,
    text: "",
    type: "success",
    key: 0,
  });

  const [confirmAction, setConfirmAction] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);

  const showToast = useCallback((text, type = "success") => {
    setToast((previous) => ({
      show: true,
      text,
      type,
      key: previous.key + 1,
    }));
  }, []);

  const closeToast = useCallback(() => {
    setToast((previous) => ({ ...previous, show: false }));
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/category");
      setCategories(getCategoryArray(response.data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load categories. Check the backend API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function resetForm() {
    setForm({ ...initialForm });
    setEditingId(null);
    setImagePreview("");
    setError("");
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");

    setForm((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError("Category name is required.");
      return;
    }

    if (!description) {
      setError("Category description is required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("description", description);
    payload.append("status", form.status);

    if (form.image instanceof File) {
      payload.append("image", form.image);
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/category/${editingId}`, payload);
        showToast("Category updated successfully.");
      } else {
        await api.post("/category", payload);
        showToast("Category added successfully.");
      }

      setShowForm(false);
      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save category. Please check the backend API."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category) {
    setForm({
      name: category.name || "",
      description: category.description || "",
      status: getStatus(category),
      image: null,
    });

    setImagePreview(getImageUrl(category.image));
    setEditingId(category._id);
    setError("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleToggle(category) {
    setError("");

    setConfirmAction({
      type: getStatus(category) === "active" ? "deactivate" : "activate",
      category,
    });
  }

  function handleDelete(category) {
    setError("");
    setConfirmAction({ type: "delete", category });
  }

  async function confirmCategoryAction() {
    if (!confirmAction || actionBusy) return;

    const { type, category } = confirmAction;

    try {
      setActionBusy(true);
      setError("");

      if (type === "delete") {
        await api.delete(`/category/${category._id}`);

        if (editingId === category._id) {
          setShowForm(false);
          resetForm();
        }

        showToast("Category deleted successfully.");
      } else {
        await api.patch(`/category/${category._id}/status`);

        showToast(
          type === "activate"
            ? "Category activated successfully."
            : "Category deactivated successfully."
        );
      }

      setConfirmAction(null);
      await fetchCategories();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          (type === "delete"
            ? "Unable to delete category. Check the delete API route."
            : "Unable to change status. Check PATCH /category/:id/status."),
        "error"
      );
      setConfirmAction(null);
    } finally {
      setActionBusy(false);
    }
  }

  const filtered = categories.filter((category) => {
    const term = search.trim().toLowerCase();

    return (
      String(category.name || "").toLowerCase().includes(term) ||
      String(category.description || "").toLowerCase().includes(term)
    );
  });

  const activeCount = categories.filter(
    (category) => getStatus(category) === "active"
  ).length;

  const inactiveCount = categories.length - activeCount;

  const inputStyle =
    "w-full rounded-xl border border-[#DEDFD3] bg-white px-4 py-3 text-sm text-[#174638] outline-none transition focus:border-[#174638] focus:ring-2 focus:ring-[#174638]/10";

  return (
    <div className="min-h-screen bg-[#FAF7F0] p-4 text-[#174638] sm:p-6 lg:p-8">
      <Toast toast={toast} onClose={closeToast} />

      <CategoryConfirmModal
        action={confirmAction?.type}
        category={confirmAction?.category}
        busy={actionBusy}
        onCancel={() => {
          if (!actionBusy) setConfirmAction(null);
        }}
        onConfirm={confirmCategoryAction}
      />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A785C]">
              MODEZA / ADMIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Categories
            </h1>
            <p className="mt-2 text-sm text-[#827969]">
              Manage your collections, images and category status.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123F32] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B3529]"
          >
            <span className="text-lg">+</span>
            Add Category
          </button>
        </div>

        {error && !showForm && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
              className="text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Categories", value: categories.length, icon: "▤" },
            { label: "Active Categories", value: activeCount, icon: "✓" },
            { label: "Inactive Categories", value: inactiveCount, icon: "◷" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E9DFCF] bg-[#FFFCF8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#827969]">{item.label}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EEE6] text-lg text-[#174638]">
                  {item.icon}
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {showForm && (
          <section className="rounded-2xl border border-[#E2DFD2] bg-[#FFFCF8] p-5 shadow-md sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8562]">
                  CATEGORY DETAILS
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {editingId ? "Edit Category" : "Add New Category"}
                </h2>
                <p className="mt-1 text-sm text-[#827969]">
                  Add category details and choose an image.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E4D8C5] text-xl text-[#655C4E] hover:bg-[#FAF7F0]"
              >
                ×
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Cotton Dresses"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        status: event.target.value,
                      }))
                    }
                    className={inputStyle}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe this category..."
                  rows={3}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category Image
                </label>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-44 w-full max-w-52 items-center justify-center overflow-hidden rounded-2xl border border-[#DED8C9] bg-[#F5F0E6]">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="px-4 text-center text-sm text-[#827969]">
                        No image selected
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      key={editingId || (showForm ? "new-category" : "closed")}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full rounded-xl border border-[#DED8C9] bg-white p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#E8EEE6] file:px-3 file:py-2 file:font-semibold file:text-[#123F32]"
                    />

                    <p className="mt-2 text-xs leading-5 text-[#827969]">
                      Choose an image for this collection. Maximum file size:
                      5 MB.
                    </p>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setForm((previous) => ({
                            ...previous,
                            image: null,
                          }));
                        }}
                        className="mt-3 text-sm font-semibold text-red-700 hover:underline"
                      >
                        Clear image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-[#EEE8DD] pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#123F32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0B3529] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Category"
                      : "Save Category"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#DED8C9] px-6 py-3 text-sm font-semibold text-[#655C4E] hover:bg-[#FAF7F0] disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#E9DFCF] bg-[#FFFCF8] shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#EEE5D8] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8562]">
                COLLECTIONS
              </p>
              <h2 className="mt-2 text-xl font-bold">Category List</h2>
              <p className="mt-1 text-sm text-[#827969]">
                Showing {filtered.length} of {categories.length} categories
              </p>
            </div>

            <div className="flex gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                className={`${inputStyle} sm:max-w-xs`}
              />
              <button
                type="button"
                onClick={fetchCategories}
                title="Refresh categories"
                disabled={loading}
                className="shrink-0 rounded-xl border border-[#DED8C9] px-4 py-3 text-sm font-semibold hover:bg-[#FAF7F0] disabled:opacity-50"
              >
                ↻
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 p-12 text-sm text-[#827969]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#DCE5D8] border-t-[#164D3D]" />
              Loading categories...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EEE6] text-2xl text-[#174638]">
                ▤
              </div>
              <p className="mt-4 font-semibold">No categories found</p>
              <p className="mt-2 text-sm text-[#827969]">
                {search
                  ? "Try a different search term."
                  : "Add your first category to get started."}
              </p>
              {!search && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-4 rounded-xl bg-[#123F32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B3529]"
                >
                  + Add Category
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#F5F0E6]">
                  <tr className="text-[10px] uppercase tracking-[0.15em] text-[#716958]">
                    <th className="px-5 py-4 font-bold">Image</th>
                    <th className="px-5 py-4 font-bold">Category</th>
                    <th className="px-5 py-4 font-bold">Description</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0E8DC]">
                  {filtered.map((category) => {
                    const status = getStatus(category);
                    const isActive = status === "active";
                    const imageUrl = getImageUrl(category.image);

                    return (
                      <tr
                        key={category._id}
                        className="transition hover:bg-[#FCFAF5]"
                      >
                        <td className="px-5 py-4">
                          <div className="h-16 w-14 overflow-hidden rounded-lg border border-[#E9DFCF] bg-[#F5F0E6]">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={category.name}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-[#827969]">
                                No image
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#123F32]">
                            {category.name}
                          </p>
                          <p className="mt-1 max-w-[200px] truncate text-xs text-[#A09686]">
                            ID: {category._id}
                          </p>
                        </td>

                        <td className="max-w-xs px-5 py-4 text-sm text-[#827969]">
                          {category.description || "No description"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              isActive
                                ? "bg-[#E5EEE5] text-[#245A3E]"
                                : "bg-[#F5EAD5] text-[#8A6426]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? "bg-[#398352]" : "bg-[#B58A3A]"
                              }`}
                            />
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(category)}
                              className="rounded-lg border border-[#D8C9AE] px-3 py-2 text-xs font-semibold text-[#174638] hover:bg-[#F5F0E6]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggle(category)}
                              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                                isActive
                                  ? "border-[#E6D4A9] text-[#8A6426] hover:bg-[#FBF3E2]"
                                  : "border-[#CFE1CE] text-[#245A3E] hover:bg-[#EAF3E8]"
                              }`}
                            >
                              {isActive ? "Deactivate" : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(category)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
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

          <div className="flex flex-col gap-2 border-t border-[#EEE5D8] bg-[#FCFAF5] px-5 py-3 text-[10px] tracking-wide text-[#827969] sm:flex-row sm:justify-between">
            <span>MODEZA · CATEGORY MANAGEMENT</span>
            <span>© 2026 MODEZA</span>
          </div>
        </section>
      </div>
    </div>
  );
}

