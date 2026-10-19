
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchCategories() {
    try {
      setLoading(true);
      const res = await api.get("/category");
      const data = res.data;
      setCategories(
        Array.isArray(data) ? data : data.data || data.categories || []
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function resetForm() {
    setForm({ name: "", description: "", status: "active" });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
      };

      if (editingId) {
        await api.put(`/category/${editingId}`, payload);
        setMessage("Category updated successfully.");
      } else {
        await api.post("/category", payload);
        setMessage("Category added successfully.");
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category) {
    setEditingId(category._id);
    setForm({
      name: category.name || "",
      description: category.description || "",
      status: category.status || "active",
    });
    setError("");
    setMessage("");
    document.getElementById("category-form")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  async function handleToggle(category) {
    const action = category.status === "active" ? "deactivate" : "activate";
    if (!window.confirm(`${action} "${category.name}"?`)) return;

    try {
      setError("");
      setMessage("");
      await api.patch(`/category/${category._id}/status`);
      setMessage(`Category ${action}d successfully.`);
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change status.");
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Delete "${category.name}"?`)) return;

    try {
      setError("");
      setMessage("");
      await api.delete(`/category/${category._id}`);
      if (editingId === category._id) resetForm();
      setMessage("Category deleted successfully.");
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete category.");
    }
  }

  const filtered = categories.filter((category) => {
    const term = search.toLowerCase();
    return (
      (category.name || "").toLowerCase().includes(term) ||
      (category.description || "").toLowerCase().includes(term)
    );
  });

  const activeCount = categories.filter(
    (category) => category.status === "active"
  ).length;

  const inputStyle =
    "w-full rounded-lg border border-[#e4d8c5] bg-white px-4 py-3 text-sm text-[#174638] outline-none transition focus:border-[#174638] focus:ring-2 focus:ring-[#174638]/10";

  return (
    <div className="min-h-screen bg-[#faf7f0] p-4 text-[#174638] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a785c]">
              DRESS SHOP / ADMIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Categories
            </h1>
            <p className="mt-2 text-sm text-[#827969]">
              Manage your dress collections and category status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setError("");
              setMessage("");
              document.getElementById("category-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="rounded-xl bg-[#124536] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b3529]"
          >
            + Add Category
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Categories",
              value: categories.length,
              icon: "▤",
            },
            {
              label: "Active Categories",
              value: activeCount,
              icon: "✓",
            },
            {
              label: "Inactive Categories",
              value: categories.length - activeCount,
              icon: "◷",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#e9dfcf] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#827969]">{item.label}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8eee6] text-lg text-[#174638]">
                  {item.icon}
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        <section
          id="category-form"
          className="rounded-2xl border border-[#e9dfcf] bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a8562]">
                CATEGORY DETAILS
              </p>
              <h2 className="mt-2 text-xl font-bold">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-semibold text-[#827969] hover:text-[#174638]"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Casual Dresses"
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
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
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
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe this category..."
                rows={3}
                className={inputStyle}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#124536] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3529] disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Save Category"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setError("");
                  setMessage("");
                }}
                className="rounded-xl border border-[#e4d8c5] px-6 py-3 text-sm font-semibold text-[#655c4e] transition hover:bg-[#faf7f0]"
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {/* Categories Table */}
        <section className="overflow-hidden rounded-2xl border border-[#e9dfcf] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#eee5d8] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a8562]">
                COLLECTIONS
              </p>
              <h2 className="mt-2 text-xl font-bold">Category List</h2>
              <p className="mt-1 text-sm text-[#827969]">
                Showing {filtered.length} of {categories.length} categories
              </p>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className={`${inputStyle} sm:max-w-xs`}
            />
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#827969]">
              Loading categories...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold">No categories found</p>
              <p className="mt-2 text-sm text-[#827969]">
                Add a category or try a different search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#f5f0e6]">
                  <tr className="text-[10px] uppercase tracking-[0.15em] text-[#716958]">
                    <th className="px-5 py-4 font-bold">Category</th>
                    <th className="px-5 py-4 font-bold">Description</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0e8dc]">
                  {filtered.map((category) => (
                    <tr
                      key={category._id}
                      className="transition hover:bg-[#fcfaf5]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{category.name}</p>
                        <p className="mt-1 text-xs text-[#a09686]">
                          ID: {category._id}
                        </p>
                      </td>

                      <td className="max-w-xs px-5 py-4 text-sm text-[#827969]">
                        {category.description || "No description"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            category.status === "active"
                              ? "bg-[#e5eee5] text-[#245a3e]"
                              : "bg-[#f5ead5] text-[#8a6426]"
                          }`}
                        >
                          {category.status || "active"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            className="rounded-lg border border-[#d8c9ae] px-3 py-2 text-xs font-semibold text-[#174638] transition hover:bg-[#f5f0e6]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggle(category)}
                            className="rounded-lg border border-[#d8c9ae] px-3 py-2 text-xs font-semibold text-[#655c4e] transition hover:bg-[#f5f0e6]"
                          >
                            {category.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(category)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
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

          <div className="flex flex-col gap-2 border-t border-[#eee5d8] bg-[#fcfaf5] px-5 py-3 text-[10px] tracking-wide text-[#827969] sm:flex-row sm:justify-between">
            <span>DRESS SHOP · CATEGORY MANAGEMENT</span>
            <span>© 2026 DRESS SHOP</span>
          </div>
        </section>
      </div>
    </div>
  );
}
