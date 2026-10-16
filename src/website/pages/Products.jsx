
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/product");
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data?.products ?? data?.data ?? [];

        if (active) {
          setProducts(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("FETCH PRODUCTS ERROR:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load products. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  const getImage = (product) => {
    const image = product.image ||
      (Array.isArray(product.images) ? product.images[0] : "");

    if (!image) {
      return "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
  };

  const getVariants = (product) =>
    product.variants || product.productVariants || [];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (product.status === "inactive") return false;

      const productName = String(product.name || "").toLowerCase();
      const matchesSearch = productName.includes(
        search.trim().toLowerCase()
      );

      const matchesPrice =
        product.price == null ||
        (Number.isFinite(Number(product.price)) &&
          Number(product.price) <= maxPrice);

      const variants = getVariants(product);

      const matchesSize =
        size === "All" ||
        variants.some(
          (variant) =>
            String(variant.size || "").toLowerCase() ===
            size.toLowerCase()
        );

      const matchesColor =
        color === "All" ||
        variants.some(
          (variant) =>
            String(variant.color || "").toLowerCase() ===
            color.toLowerCase()
        );

      return (
        matchesSearch &&
        matchesPrice &&
        matchesSize &&
        matchesColor
      );
    });

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [products, search, maxPrice, size, color, sort]);

  const resetFilters = () => {
    setSearch("");
    setMaxPrice(10000);
    setSize("All");
    setColor("All");
    setSort("latest");
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-IN");

  const inputClass =
    "w-full rounded-xl border border-[#ded6ca] bg-[#fffdf9] px-4 py-3 text-sm text-[#24352e] outline-none transition focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10";

  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#24352e]">

      {/* Hero banner */}
      <section className="relative overflow-hidden border-b border-[#e8dfd2] bg-[#f0eee4] px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#d8d5c7] sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -right-8 -top-12 h-56 w-56 rounded-full border border-[#d8d5c7] sm:h-72 sm:w-72" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#557665]">
            The Dress Shop Collection
          </p>

          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-[#123f32] sm:text-6xl lg:text-7xl">
            Find Your
            <br />
            <span className="font-normal italic">Perfect Style</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-[#6b7169] sm:text-base">
            Timeless pieces, lovely details, and styles made for you.
            Discover something special for every occasion.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-[#81796d]">
            <Link to="/" className="transition hover:text-[#124536]">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#124536]">Shop</span>
          </div>
        </div>
      </section>

      {/* Collection */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#81796d]">
              Curated For You
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold text-[#123f32] sm:text-4xl">
              Our Collection
            </h2>

            <p className="mt-3 text-sm text-[#6b7169]">
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} products found`}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {/* Search */}
            <div className="relative sm:w-64">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#81796d]">
                ⌕
              </span>

              <input
                type="search"
                placeholder="Search dresses..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
                className={`${inputClass} pl-11`}
              />
            </div>

            {/* Sorting */}
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
              className={`${inputClass} sm:w-52`}
            >
              <option value="latest">Latest products</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[250px_1fr]">

          {/* Filters sidebar */}
          <aside className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <div className="flex items-center justify-between border-b border-[#e8dfd2] pb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#123f32]">
                  Filters
                </h3>
                <p className="mt-1 text-xs text-[#81796d]">
                  Refine your collection
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-[#124536] underline underline-offset-4 transition hover:text-[#0b3428]"
              >
                Reset
              </button>
            </div>

            {/* Price */}
            <div className="border-b border-[#e8dfd2] py-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[#24352e]">
                  Maximum Price
                </h4>
                <span className="text-sm font-bold text-[#124536]">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(Number(event.target.value))
                }
                aria-label="Maximum price"
                className="h-2 w-full cursor-pointer accent-[#124536]"
              />

              <div className="mt-3 flex justify-between text-xs text-[#81796d]">
                <span>₹0</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Size */}
            <div className="border-b border-[#e8dfd2] py-6">
              <h4 className="mb-4 text-sm font-bold text-[#24352e]">
                Select Size
              </h4>

              <div className="flex flex-wrap gap-2">
                {["All", "S", "M", "L", "XL", "XXL"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setSize(item)}
                    aria-pressed={size === item}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                      size === item
                        ? "border-[#124536] bg-[#124536] text-white"
                        : "border-[#ded6ca] bg-[#fffdf9] text-[#24352e] hover:border-[#124536] hover:text-[#124536]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="pt-6">
              <h4 className="mb-4 text-sm font-bold text-[#24352e]">
                Select Color
              </h4>

              <select
                value={color}
                onChange={(event) => setColor(event.target.value)}
                aria-label="Filter by color"
                className={inputClass}
              >
                <option value="All">All colors</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Pink">Pink</option>
                <option value="Red">Red</option>
              </select>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 w-full rounded-xl border border-[#124536] px-4 py-3 text-sm font-semibold text-[#124536] transition hover:bg-[#124536] hover:text-white"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Products */}
          <div className="min-w-0">
            {loading ? (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-[#e8dfd2] bg-[#fffdf9]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#124536]" />
                <p className="mt-4 text-sm text-[#81796d]">
                  Finding your favourite dresses...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-16 text-center">
                <div className="text-4xl text-[#124536]">!</div>

                <h3 className="mt-4 font-serif text-2xl font-bold text-[#123f32]">
                  Something went wrong
                </h3>

                <p className="mt-3 text-sm text-[#81796d]">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-xl bg-[#124536] px-6 py-3 font-semibold text-white transition hover:bg-[#0b3428]"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf0e9] text-3xl text-[#124536]">
                  ♡
                </div>

                <h3 className="mt-5 font-serif text-2xl font-bold text-[#123f32]">
                  No matching products
                </h3>

                <p className="mt-3 text-sm text-[#81796d]">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-xl bg-[#124536] px-6 py-3 font-semibold text-white transition hover:bg-[#0b3428]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Link
                    to={`/products/${product._id}`}
                    key={product._id}
                    className="group overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] transition duration-300 hover:-translate-y-1 hover:border-[#c9d5c9] hover:shadow-lg"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f0eee7]">
                      <img
                        src={getImage(product)}
                        alt={product.name || "Dress"}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80";
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-[#fffdf9]/95 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-[#124536]">
                        COLLECTION
                      </span>

                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#124536]/95 px-4 py-3 text-center text-sm font-semibold text-white transition duration-300 group-hover:translate-y-0">
                        View Product →
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#81796d]">
                        Dress Shop
                      </p>

                      <h3 className="mt-2 line-clamp-2 font-serif text-lg font-bold text-[#123f32] transition group-hover:text-[#557665]">
                        {product.name || "Unnamed Product"}
                      </h3>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eee7dc] pt-4">
                        <p className="text-base font-bold text-[#124536]">
                          {product.price != null &&
                          Number.isFinite(Number(product.price))
                            ? `₹${formatPrice(product.price)}`
                            : "Price unavailable"}
                        </p>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ded6ca] text-lg text-[#124536] transition group-hover:border-[#124536] group-hover:bg-[#124536] group-hover:text-white">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <p className="mt-8 text-center text-xs text-[#81796d]">
                Showing {filteredProducts.length} of {products.filter((p) => p.status !== "inactive").length} products
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Products;
