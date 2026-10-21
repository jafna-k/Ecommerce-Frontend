import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  product: "",
  size: "",
  color: "",
  price: "",
  stock: "0",
  sku: "",
  image: "",
};

export default function AdminProductVariants() {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [variantResponse, productResponse] = await Promise.all([
        api.get("/productvariant"),
        api.get("/product"),
      ]);

      const variantData = variantResponse.data;
      const productResponseData = productResponse.data;

      const productData = Array.isArray(productResponseData)
        ? productResponseData
        : productResponseData?.data ??
          productResponseData?.products ??
          [];

      setVariants(Array.isArray(variantData) ? variantData : []);
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Products or variants load cheyyan kazhinjilla."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.product) {
      setError("Oru product select cheyyuka.");
      return;
    }

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      setError("Price-um stock-um negative aakaruthu.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        product: form.product,
        size: form.size.trim(),
        color: form.color.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        sku: form.sku.trim(),
        image: form.image.trim() || null,
      };

      if (editingId) {
        await api.put(`/productvariant/${editingId}`, payload);
        setSuccess("Product variant successfully updated!");
      } else {
        await api.post("/productvariant", payload);
        setSuccess("Product variant successfully added!");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Variant save cheyyan kazhinjilla. Details check cheyyuka."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(variant) {
    setEditingId(variant._id);

    setForm({
      product: variant.product?._id || variant.product || "",
      size: variant.size || "",
      color: variant.color || "",
      price: String(variant.price ?? ""),
      stock: String(variant.stock ?? 0),
      sku: variant.sku || "",
      image: variant.image || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(variantId) {
    const confirmed = window.confirm(
      "Ee product variant delete cheyyano?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await api.delete(`/productvariant/${variantId}`);

      if (editingId === variantId) {
        resetForm();
      }

      setSuccess("Product variant successfully deleted!");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Variant delete cheyyan kazhinjilla."
      );
    }
  }

  const filteredVariants = variants.filter((variant) => {
    const productName = variant.product?.name || "";
    const searchText = [
      productName,
      variant.size,
      variant.color,
      variant.sku,
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const lowStockCount = variants.filter(
    (variant) => Number(variant.stock) <= 5
  ).length;

  return (
    <div className="min-h-screen bg-[#faf7f0] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668477]">
              DRESS SHOP / ADMIN PANEL
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#123f32] sm:text-4xl">
              Product Variants
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage sizes, colors, pricing and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="rounded-xl border border-[#123f32] px-5 py-3 font-semibold text-[#123f32] transition hover:bg-[#e9efe9]"
          >
            Refresh Data
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {success}
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e8e2d5] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Variants</p>
            <p className="mt-2 text-3xl font-bold text-[#123f32]">
              {variants.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8e2d5] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Products</p>
            <p className="mt-2 text-3xl font-bold text-[#123f32]">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8e2d5] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Low Stock (5 or less)</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {lowStockCount}
            </p>
          </div>
        </div>

        {/* Add / edit form */}
        <section className="mb-8 rounded-2xl border border-[#e8e2d5] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#123f32]">
              {editingId ? "Edit Product Variant" : "Add New Variant"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Variant details update cheyyuka."
                : "Product-inte size, color, price, stock details enter cheyyuka."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Product */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product *
              </label>

              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 outline-none focus:border-[#123f32] focus:ring-2 focus:ring-[#123f32]/10"
              >
                <option value="">Select product</option>

                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>

              {products.length === 0 && !loading && (
                <p className="mt-2 text-xs text-red-600">
                  Products load aayittilla. Product API check cheyyuka.
                </p>
              )}
            </div>

            {/* Size */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Size *
              </label>

              <select
                name="size"
                value={form.size}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 outline-none focus:border-[#123f32] focus:ring-2 focus:ring-[#123f32]/10"
              >
                <option value="">Select size</option>
                {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map(
                  (size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Color *
              </label>

              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="e.g. Dark Green"
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#123f32] focus:ring-2 focus:ring-[#123f32]/10"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Price (₹) *
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="1499"
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#123f32] focus:ring-2 focus:ring-[#123f32]/10"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Stock Quantity *
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                step="1"
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#123f32] focus:ring-2 focus:ring-[#123f32]/10"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                SKU *
              </label>

              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="DRESS-M-GREEN-001"
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#123f32] focus:ring-2 focus:ring-[#123f32]/10"
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Variant Image URL (optional)
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="/uploads/variant-image.jpg"
                className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#123f32] focus:ring-2 focus:ring-[#123f32]/10"
              />

              <p className="mt-1 text-xs text-gray-500">
                Ithu image URL/path field aanu; file upload ivide implement cheythittilla.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="rounded-xl bg-[#123f32] px-6 py-3 font-semibold text-white transition hover:bg-[#1b5845] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Variant"
                  : "Add Variant"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Variants table */}
        <section className="overflow-hidden rounded-2xl border border-[#e8e2d5] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#123f32]">
                All Product Variants
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Existing variants search, edit, delete cheyyam.
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, size, SKU..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#123f32] sm:max-w-xs"
            />
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading variants...
            </div>
          ) : filteredVariants.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-gray-700">
                {search ? "Matching variants kandethiyilla." : "Variants illa."}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Search text maatti nokkuka."
                  : "Mugalil ninnu first product variant add cheyyuka."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#f7f5ef] text-xs uppercase tracking-wide text-gray-600">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Size</th>
                    <th className="px-5 py-4">Color</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">SKU</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredVariants.map((variant) => (
                    <tr
                      key={variant._id}
                      className="transition hover:bg-[#fcfbf8]"
                    >
                      <td className="px-5 py-4 font-semibold text-[#123f32]">
                        {variant.product?.name || "Product"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-gray-100 px-3 py-1 font-semibold">
                          {variant.size}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full border border-gray-300" />
                          {variant.color}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ₹{Number(variant.price).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            Number(variant.stock) <= 5
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {variant.stock} units
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {variant.sku}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(variant)}
                            className="rounded-lg border border-[#123f32] px-3 py-2 font-semibold text-[#123f32] transition hover:bg-[#e9efe9]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(variant._id)}
                            className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
