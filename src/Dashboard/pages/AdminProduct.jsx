
import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  category: "",
  originalPrice: "",
  discountPercentage: "0",
  status: "active",
};

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function getImageUrl(imagePath) {
  if (typeof imagePath !== "string" || !imagePath.trim()) {
    return "";
  }

  const path = imagePath.trim();

  // Already a complete URL
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Support stored paths such as:
  // /uploads/products/dress.png
  // uploads/products/dress.png
  const cleanPath = path.replace(/^\/+/, "");

  if (cleanPath.startsWith("uploads/")) {
    return `${API_BASE_URL}/${cleanPath}`;
  }

  // Support filenames saved without the uploads folder
  if (!cleanPath.includes("/")) {
    return `${API_BASE_URL}/uploads/products/${cleanPath}`;
  }

  return `${API_BASE_URL}/${cleanPath}`;
}

function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const originalPrice = Number(form.originalPrice) || 0;
  const discount = Number(form.discountPercentage) || 0;

  const sellingPrice = Number(
    (originalPrice * (1 - discount / 100)).toFixed(2)
  );

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await api.get("/product");
      const data = response.data?.data ?? response.data;

      setProducts(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Products loading error:", err);
      setError(
        err.response?.data?.message ||
          "Products load cheyyan kazhinjilla."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const response = await api.get("/category");
      const data = response.data?.data ?? response.data;

      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Categories loading error:", err);
    }
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Release temporary preview URLs when replaced or unmounted.
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

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

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setForm(initialForm);
    setImage(null);
    setPreview("");
    setEditingId(null);

    const fileInput = document.getElementById("product-image");

    if (fileInput) {
      fileInput.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
      setError("Please enter a valid original price.");
      return;
    }

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > 100
    ) {
      setError("Discount must be between 0 and 100.");
      return;
    }

    if (!editingId && !(image instanceof File)) {
      setError("Please select a product image.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("originalPrice", String(originalPrice));
      formData.append("discountPercentage", String(discount));
      formData.append("price", String(sellingPrice));
      formData.append("status", form.status);

      if (image instanceof File) {
        formData.append("image", image);
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

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Product save error:", err);

      setError(
        err.response?.data?.message ||
          "Could not save product. Check your login and backend."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      category:
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "",
      originalPrice: String(
        product.originalPrice ?? product.price ?? ""
      ),
      discountPercentage: String(
        product.discountPercentage ?? 0
      ),
      status: product.status || "active",
    });

    setImage(null);
    setPreview(getImageUrl(product.image));
    setError("");
    setSuccess("");

    const fileInput = document.getElementById("product-image");

    if (fileInput) {
      fileInput.value = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(`/product/${id}`);

      setProducts((previous) =>
        previous.filter((product) => product._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Product deleted successfully!");
    } catch (err) {
      console.error("Product delete error:", err);

      setError(
        err.response?.data?.message || "Could not delete product."
      );
    }
  }

  const activeCount = products.filter(
    (product) => product.status === "active"
  ).length;

  const inactiveCount = products.length - activeCount;

  const inputClass =
    "w-full rounded-xl border border-[#E7DCCD] bg-white px-4 py-3 text-sm text-[#173F34] outline-none focus:border-[#104638] focus:ring-2 focus:ring-[#104638]/10";

  const labelClass =
    "mb-2 block text-sm font-medium text-[#173F34]";

  return (
    <div className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#173F34] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px] text-[#8B806D]">
              Your Catalog
            </p>

            <h1 className="text-3xl font-bold text-[#123F34]">
              Product Management
            </h1>

            <p className="mt-2 text-sm text-[#7B7B70]">
              Manage your dress collection, prices and availability.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setError("");
              setSuccess("");

              document
                .getElementById("product-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-xl bg-[#104638] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B372C]"
          >
            + Add Product
          </button>
        </div>

        {success && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between rounded-xl border border-[#B5E8D0] bg-[#E9FBF2] px-4 py-3 text-sm text-[#176747]"
          >
            <span>✓ {success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="px-2 text-lg"
              aria-label="Close success message"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-[#FFF1F0] px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 font-semibold"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total Products"
            count={products.length}
            color="text-[#123F34]"
          />
          <SummaryCard
            title="Active Products"
            count={activeCount}
            color="text-emerald-700"
          />
          <SummaryCard
            title="Inactive Products"
            count={inactiveCount}
            color="text-amber-700"
          />
        </div>

        <section
          id="product-form"
          className="mb-8 overflow-hidden rounded-2xl border border-[#E8DED0] bg-[#FFFCF8] shadow-sm"
        >
          <div className="flex items-start justify-between border-b border-[#EEE4D7] px-5 py-5 sm:px-7">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[2px] text-[#8B806D]">
                Product Details
              </p>

              <h2 className="text-xl font-bold text-[#123F34]">
                {editingId ? "Update Product" : "Add New Product"}
              </h2>

              <p className="mt-1 text-sm text-[#858176]">
                Enter the details of your dress.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-[#E8DED0] px-3 py-1.5 text-lg hover:bg-[#F8F5EE]"
              aria-label="Clear form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="product-name" className={labelClass}>
                  Product Name *
                </label>
                <input
                  id="product-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="original-price" className={labelClass}>
                  Original Price (₹) *
                </label>
                <input
                  id="original-price"
                  name="originalPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={handleChange}
                  placeholder="3000"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="discount" className={labelClass}>
                  Discount Percentage (%)
                </label>
                <input
                  id="discount"
                  name="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.discountPercentage}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#A7EBCB] bg-[#EAFBF3] px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-[#176747]">
                    Final Selling Price
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#075E46]">
                    {money(sellingPrice)}
                  </p>
                  <p className="mt-1 text-xs text-[#27805D]">
                    You save {money((originalPrice * discount) / 100)}
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#176747]">
                  {discount}% OFF
                </span>
              </div>

              <div>
                <label htmlFor="product-category" className={labelClass}>
                  Category *
                </label>
                <select
                  id="product-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="product-status" className={labelClass}>
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

              <div>
                <label htmlFor="product-image" className={labelClass}>
                  Product Image {!editingId && "*"}
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full rounded-xl border border-[#E7DCCD] bg-white p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#E7EFE9] file:px-4 file:py-2 file:font-semibold file:text-[#104638] hover:file:bg-[#D8E7DD]"
                />

                <p className="mt-2 text-xs text-[#858176]">
                  Choose an image from your computer. Maximum 5 MB.
                </p>
              </div>

              {preview && (
                <div>
                  <p className={labelClass}>Image Preview</p>
                  <img
                    src={preview}
                    alt="Product preview"
                    className="h-36 w-28 rounded-xl border border-[#E8DED0] bg-white object-cover"
                    onError={(event) => {
                      console.error("Preview image failed:", preview);
                      event.currentTarget.alt = "Image could not be loaded";
                    }}
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label htmlFor="product-description" className={labelClass}>
                  Description *
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  required
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 border-t border-[#EEE4D7] pt-5">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#104638] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0B372C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "+ Add Product"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[#E2D8CA] bg-white px-6 py-3 text-sm font-semibold text-[#365347] hover:bg-[#F8F5EE]"
              >
                Clear Form
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#E8DED0] bg-[#FFFCF8] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEE4D7] px-5 py-5 sm:px-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#8B806D]">
                Inventory
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#123F34]">
                All Products
              </h2>
            </div>

            <button
              type="button"
              onClick={loadProducts}
              className="rounded-lg border border-[#E2D8CA] px-4 py-2 text-sm font-semibold text-[#365347] hover:bg-[#F8F5EE]"
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#858176]">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold text-[#365347]">
                No products found
              </p>
              <p className="mt-1 text-sm text-[#858176]">
                Add your first dress using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#F5F0E7] text-[#6E6A5F]">
                  <tr>
                    {[
                      "Image",
                      "Product",
                      "Category",
                      "Original Price",
                      "Discount",
                      "Selling Price",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-4 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEE4D7]">
                  {products.map((product) => {
                    const categoryName =
                      typeof product.category === "object"
                        ? product.category?.name || "—"
                        : categories.find(
                            (category) =>
                              category._id === product.category
                          )?.name || "—";

                    const imageUrl = getImageUrl(product.image);

                    return (
                      <tr
                        key={product._id}
                        className="transition hover:bg-[#FAF7F1]"
                      >
                        <td className="px-5 py-4">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name || "Product"}
                              loading="lazy"
                              className="h-16 w-14 rounded-lg border border-[#E8DED0] bg-white object-cover"
                              onError={(event) => {
                                console.error(
                                  "Product image failed to load:",
                                  {
                                    storedPath: product.image,
                                    attemptedUrl: imageUrl,
                                  }
                                );
                                event.currentTarget.alt = "Image unavailable";
                              }}
                            />
                          ) : (
                            <div className="flex h-16 w-14 items-center justify-center rounded-lg bg-[#F0EBE2] text-center text-[10px] text-[#858176]">
                              No Image
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#173F34]">
                            {product.name}
                          </p>
                          <p className="mt-1 max-w-48 truncate text-xs text-[#858176]">
                            {product.description || "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-[#6E6A5F]">
                          {categoryName}
                        </td>

                        <td className="px-5 py-4 text-[#6E6A5F]">
                          {money(product.originalPrice ?? product.price)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#E9F5EC] px-2.5 py-1 text-xs font-bold text-[#176747]">
                            {Number(product.discountPercentage || 0)}%
                          </span>
                        </td>

                        <td className="px-5 py-4 font-bold text-[#104638]">
                          {money(product.price)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              product.status === "inactive"
                                ? "bg-[#F2E7D5] text-[#94611B]"
                                : "bg-[#E9F5EC] text-[#176747]"
                            }`}
                          >
                            {product.status || "active"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="rounded-lg border border-[#D5E2D7] px-3 py-2 text-xs font-semibold text-[#104638] hover:bg-[#E9F1E9]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
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
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ title, count, color }) {
  return (
    <div className="rounded-2xl border border-[#E8DED0] bg-[#FFFCF8] p-5 shadow-sm">
      <p className="text-sm text-[#777469]">{title}</p>
      <p className={`mt-3 text-3xl font-bold ${color}`}>{count}</p>
    </div>
  );
}

export default AdminProduct;