
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  image: "",
  status: "active",
};

const inputClass =
  "w-full rounded-xl border border-[#ded6ca] bg-white px-4 py-3 text-sm text-[#24352e] outline-none transition placeholder:text-[#a19a8e] focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#124536] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3428] disabled:cursor-not-allowed disabled:opacity-60";

function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/product");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.products)
        ? data.data.products
        : [];

      setProducts(list);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/category");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.categories)
        ? data.categories
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.categories)
        ? data.data.categories
        : [];

      setCategories(list);
    } catch (err) {
      console.error("Unable to load categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Form input handler
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Open add form
  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // Open edit form
  function openEditForm(product) {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      category:
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "",
      price: product.price ?? "",
      image: product.image || product.images?.[0] || "",
      status: product.status || "active",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // Close form
  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  // Add or update product
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    if (!["active", "inactive"].includes(form.status)) {
      setError("Please select a valid product status.");
      return;
    }

    const wasEditing = Boolean(editingId);
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category || undefined,
        price: Number(form.price),
        image: form.image.trim() || null,
        status: form.status,
      };

      if (wasEditing) {
        await api.put(`/product/${editingId}`, payload);
      } else {
        await api.post("/product", payload);
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      await fetchProducts();

      setSuccess(
        wasEditing
          ? "Product updated successfully."
          : "Product added successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save product. Check the backend API."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete product
  async function deleteProduct(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await api.delete(`/product/${id}`);

      setProducts((previous) =>
        previous.filter((product) => product._id !== id)
      );

      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = (product.name || "").toLowerCase();

      const categoryName =
        typeof product.category === "object"
          ? product.category?.name || ""
          : categories.find(
              (category) => category._id === product.category
            )?.name || "";

      return (
        name.includes(searchText) ||
        categoryName.toLowerCase().includes(searchText)
      );
    });
  }, [products, search, categories]);

  const activeCount = products.filter(
    (product) => product.status !== "inactive"
  ).length;

  const inactiveCount = products.filter(
    (product) => product.status === "inactive"
  ).length;

  function getImageUrl(product) {
    const image = product.image || product.images?.[0];

    if (!image) {
      return "https://placehold.co/100x120/f2eee6/164d3d?text=Dress";
    }

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-6 text-[#24352e] sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#81796d]">
              Your Catalog
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#123f32] sm:text-4xl">
              Product Management
            </h1>

            <p className="mt-2 text-sm text-[#6b7169] sm:text-base">
              Manage your dress collection, prices and availability.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className={`${primaryButton} self-start sm:self-auto`}
          >
            <span className="text-lg">+</span>
            Add Product
          </button>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#6b7169]">
                  Total Products
                </p>
                <h2 className="mt-3 text-3xl font-bold text-[#123f32]">
                  {loading ? "—" : products.length}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f0e9] text-2xl text-[#164d3d]">
                ▤
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#6b7169]">
                  Active Products
                </p>
                <h2 className="mt-3 text-3xl font-bold text-emerald-700">
                  {loading ? "—" : activeCount}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-700">
                ✓
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#6b7169]">
                  Inactive Products
                </p>
                <h2 className="mt-3 text-3xl font-bold text-amber-700">
                  {loading ? "—" : inactiveCount}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl text-amber-700">
                ◷
              </div>
            </div>
          </article>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => {
                fetchProducts();
                fetchCategories();
              }}
              className="self-start font-semibold underline underline-offset-4 sm:self-auto"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
          >
            <p>{success}</p>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-xl"
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-[#eee7dc] p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#81796d]">
                  Product Details
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#123f32] sm:text-2xl">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-[#6b7169]">
                  Enter the details of your dress.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e8dfd2] text-2xl text-[#6b7169] transition hover:bg-[#f2eee6] disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="product-name"
                    className="mb-2 block text-sm font-semibold text-[#24352e]"
                  >
                    Product Name *
                  </label>

                  <input
                    id="product-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Example: Floral Maxi Dress"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-price"
                    className="mb-2 block text-sm font-semibold text-[#24352e]"
                  >
                    Price (₹) *
                  </label>

                  <input
                    id="product-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="1499"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-category"
                    className="mb-2 block text-sm font-semibold text-[#24352e]"
                  >
                    Category
                  </label>

                  <select
                    id="product-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
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

                <div>
                  <label
                    htmlFor="product-status"
                    className="mb-2 block text-sm font-semibold text-[#24352e]"
                  >
                    Status
                  </label>

                  <select
                    id="product-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="product-image"
                    className="mb-2 block text-sm font-semibold text-[#24352e]"
                  >
                    Product Image URL
                  </label>

                  <input
                    id="product-image"
                    name="image"
                    type="text"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/dress.jpg"
                    className={inputClass}
                  />

                  {form.image.trim() && (
                    <div className="mt-4 flex items-center gap-4 rounded-xl border border-[#e8dfd2] bg-[#faf7f0] p-3">
                      <img
                        src={
                          /^https?:\/\//i.test(form.image)
                            ? form.image
                            : `http://localhost:5000/${form.image.replace(/^\/+/, "")}`
                        }
                        alt="Product preview"
                        className="h-24 w-20 rounded-lg object-cover"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                        onLoad={(event) => {
                          event.currentTarget.style.visibility = "visible";
                        }}
                      />

                      <p className="break-all text-xs text-[#81796d]">
                        Image preview
                      </p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="product-description"
                    className="mb-2 block text-sm font-semibold text-[#24352e]"
                  >
                    Description
                  </label>

                  <textarea
                    id="product-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the dress, material, style and fit..."
                    rows={4}
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#eee7dc] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#ded6ca] px-5 py-3 text-sm font-semibold text-[#625b50] transition hover:bg-[#f2eee6] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={primaryButton}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Save Product"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Product List */}
        <section className="overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-[#eee7dc] p-5 sm:p-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#123f32]">
                All Products
              </h2>

              <p className="mt-1 text-sm text-[#81796d]">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#81796d]">
                ⌕
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or categories..."
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#dce6dd] border-t-[#164d3d]" />
              <p className="text-sm text-[#6b7169]">
                Loading products...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#f7f3eb]">
                    {["Product", "Price", "Status", "Actions"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#716d63]"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee7dc]">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-[#faf8f2]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getImageUrl(product)}
                            alt={product.name || "Dress"}
                            className="h-16 w-14 shrink-0 rounded-lg border border-[#eee7dc] bg-[#f2eee6] object-cover"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "https://placehold.co/100x120/f2eee6/164d3d?text=Dress";
                            }}
                          />

                          <div className="min-w-0">
                            <p className="font-semibold text-[#123f32]">
                              {product.name || "Unnamed Product"}
                            </p>

                            <p className="mt-1 text-xs text-[#81796d]">
                              {typeof product.category === "object"
                                ? product.category?.name || "Dress"
                                : categories.find(
                                    (category) =>
                                      category._id === product.category
                                  )?.name || "Dress"}
                            </p>

                            <p className="mt-1 text-xs text-[#a19a8e]">
                              ID: {String(product._id || "")
                                .slice(-6)
                                .toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#123f32]">
                        ₹{formatPrice(product.price)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                            product.status === "inactive"
                              ? "bg-amber-50 text-amber-700 ring-amber-200"
                              : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          }`}
                        >
                          <span className="mr-1.5">●</span>
                          {product.status || "active"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="rounded-lg border border-[#cbdacf] px-3 py-2 text-xs font-semibold text-[#164d3d] transition hover:bg-[#e8f0e9]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product._id)}
                            disabled={deletingId === product._id}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2eee6] text-2xl text-[#81796d]">
                          ▤
                        </div>

                        <h3 className="mt-4 font-semibold text-[#123f32]">
                          {search
                            ? "No matching products"
                            : "No products found"}
                        </h3>

                        <p className="mt-1 text-sm text-[#81796d]">
                          {search
                            ? "Try another product name or category."
                            : "Add your first product to get started."}
                        </p>

                        {search ? (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="mt-4 text-sm font-semibold text-[#164d3d] underline underline-offset-4"
                          >
                            Clear Search
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={openAddForm}
                            className={`${primaryButton} mt-4`}
                          >
                            + Add Product
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="border-t border-[#eee7dc] bg-[#fdfbf6] px-5 py-4">
              <p className="text-xs text-[#81796d]">
                Displaying {filteredProducts.length} matching products out of{" "}
                {products.length} total products.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminProduct;
