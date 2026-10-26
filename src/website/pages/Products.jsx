
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";

const API_ORIGIN = "http://localhost:5000";

function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
}

function getProductPrice(product) {
  if (product.price !== undefined && product.price !== null) {
    return Number(product.price) || 0;
  }

  const originalPrice = Number(product.originalPrice) || 0;
  const discount = Number(product.discountPercentage) || 0;

  return originalPrice * (1 - discount / 100);
}

function getDiscount(product) {
  const originalPrice = Number(product.originalPrice) || 0;
  const price = getProductPrice(product);
  const percentage = Number(product.discountPercentage) || 0;

  if (percentage > 0) return percentage;

  if (originalPrice > price && originalPrice > 0) {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  return 0;
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const section = searchParams.get("section") || "shop";
  const categoryId = searchParams.get("category") || "";
  const urlSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(urlSearch);
  const [sortBy, setSortBy] = useState("default");

  // Wishlist states
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistMessage, setWishlistMessage] = useState("");

  // Keep the search input synchronized with Navbar URL searches
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Fetch products
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/product");
        const data = response.data;

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];

        if (isMounted) {
          setProducts(productList);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load products. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch logged-in customer's wishlist
  useEffect(() => {
    let isMounted = true;

    async function fetchWishlist() {
      const token = localStorage.getItem("token");

      if (!token) {
        setWishlistIds([]);
        return;
      }

      try {
        const response = await api.get("/wishlist");
        const data = response.data;

        const wishlistProducts = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.wishlist?.products)
              ? data.wishlist.products
              : Array.isArray(data.wishlist)
                ? data.wishlist
                : [];

        if (isMounted) {
          setWishlistIds(
            wishlistProducts
              .map((item) => {
                if (typeof item === "string") return item;

                return (
                  item?._id ||
                  item?.product?._id ||
                  item?.product ||
                  ""
                );
              })
              .filter(Boolean)
              .map(String)
          );
        }
      } catch {
        if (isMounted) {
          setWishlistIds([]);
        }
      }
    }

    fetchWishlist();

    return () => {
      isMounted = false;
    };
  }, []);

  // Add or remove product from wishlist
  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const id = String(productId);
    const isWishlisted = wishlistIds.includes(id);

    setWishlistLoading((prev) => ({
      ...prev,
      [id]: true,
    }));

    setWishlistMessage("");

    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);

        setWishlistIds((prev) =>
          prev.filter((item) => item !== id)
        );

        setWishlistMessage("Removed from your wishlist.");
      } else {
        await api.post(`/wishlist/${id}`);

        setWishlistIds((prev) =>
          prev.includes(id) ? prev : [...prev, id]
        );

        setWishlistMessage("Added to your wishlist.");
      }
    } catch (err) {
      setWishlistMessage(
        err.response?.data?.message ||
          "Unable to update wishlist. Please try again."
      );
    } finally {
      setWishlistLoading((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  // Search form submit: update URL and keep existing filters
  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams(searchParams);
    const searchText = search.trim();

    if (searchText) {
      nextParams.set("search", searchText);
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams);
  };

  const clearSearch = () => {
    setSearch("");

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    setSearchParams(nextParams);
  };

  const pageInfo = {
    shop: {
      eyebrow: "DISCOVER MODEZA",
      title: "Explore Our Collection",
      description:
        "Discover thoughtfully selected styles for every occasion.",
    },
    collections: {
      eyebrow: "CURATED FOR YOU",
      title: "Our Collections",
      description:
        "Explore our fashion collection and find a style that feels like you.",
    },
    "new-arrivals": {
      eyebrow: "JUST ARRIVED",
      title: "New Arrivals",
      description:
        "Discover the latest additions to our fashion collection.",
    },
    deals: {
      eyebrow: "SPECIAL OFFERS",
      title: "Exclusive Deals",
      description:
        "Explore styles with special discounts while they are available.",
    },
  };

  const currentPage = pageInfo[section] || pageInfo.shop;

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let result = [...products];

    // Active products only
    result = result.filter(
      (product) =>
        !product.status ||
        String(product.status).toLowerCase() === "active"
    );

    // Filter by category ID
    if (categoryId) {
      result = result.filter((product) => {
        const productCategory =
          typeof product.category === "object"
            ? product.category?._id
            : product.category;

        return String(productCategory || "") === String(categoryId);
      });
    }

    // New arrivals: newest products first
    if (section === "new-arrivals") {
      result.sort((a, b) => {
        const dateA = new Date(
          a.createdAt || a.updatedAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || b.updatedAt || 0
        ).getTime();

        return dateB - dateA;
      });
    }

    // Discounted products
    if (section === "deals") {
      result = result.filter(
        (product) => getDiscount(product) > 0
      );
    }

    // Search from Navbar URL or page search input
    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const description = String(
          product.description || ""
        ).toLowerCase();

        const categoryName =
          typeof product.category === "object"
            ? String(product.category?.name || "").toLowerCase()
            : "";

        return (
          name.includes(searchText) ||
          description.includes(searchText) ||
          categoryName.includes(searchText)
        );
      });
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort(
        (a, b) => getProductPrice(a) - getProductPrice(b)
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) => getProductPrice(b) - getProductPrice(a)
      );
    } else if (sortBy === "discount") {
      result.sort(
        (a, b) => getDiscount(b) - getDiscount(a)
      );
    }

    return result;
  }, [products, section, categoryId, search, sortBy]);

  // Scroll to collection section
  useEffect(() => {
    if (section !== "collections") return;

    const timer = setTimeout(() => {
      document.getElementById("collections")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [section]);

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      {/* Page heading */}
      <section className="border-b border-[#E8DFD2] bg-[#FFFDF9] px-4 py-12 text-center sm:px-6 sm:py-16">
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#9A815A]">
          {currentPage.eyebrow}
        </p>

        <h1 className="font-serif text-3xl font-semibold text-[#123F32] sm:text-4xl lg:text-5xl">
          {currentPage.title}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#68766C] sm:text-base">
          {currentPage.description}
        </p>

        <div className="mx-auto mt-6 h-[2px] w-16 bg-[#D8C49A]" />
      </section>

      {/* Products section */}
      <section
        id="collections"
        className="mx-auto max-w-[1440px] scroll-mt-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-10"
      >
        {/* Search and sorting */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#68766C]">
            {loading
              ? "Loading products..."
              : `${displayedProducts.length} products`}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full gap-2 sm:w-auto"
            >
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="min-w-0 flex-1 rounded-lg border border-[#E0D8CA] bg-[#FFFDF9] px-4 py-3 text-sm text-[#123F32] outline-none transition focus:border-[#123F32] sm:w-64"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="rounded-lg border border-[#E0D8CA] px-3 text-sm text-[#123F32] hover:bg-[#F1EDE4]"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                className="rounded-lg bg-[#123F32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245B46]"
              >
                Search
              </button>
            </form>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-lg border border-[#E0D8CA] bg-[#FFFDF9] px-4 py-3 text-sm text-[#123F32] outline-none focus:border-[#123F32]"
              aria-label="Sort products"
            >
              <option value="default">Default order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Active search information */}
        {urlSearch && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E8DFD2] bg-[#FFFDF9] px-4 py-3">
            <p className="text-sm text-[#68766C]">
              Search results for{" "}
              <span className="font-semibold text-[#123F32]">
                “{urlSearch}”
              </span>
            </p>

            <button
              type="button"
              onClick={clearSearch}
              className="text-sm font-semibold text-[#123F32] underline underline-offset-4 hover:text-[#9A815A]"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Wishlist message */}
        {wishlistMessage && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-[#E0D8CA] bg-[#FFFDF9] px-4 py-3 text-sm text-[#123F32]"
          >
            {wishlistMessage}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#D8C49A] border-t-[#123F32]" />

            <p className="mt-4 text-sm text-[#68766C]">
              Loading our collection...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#123F32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#245B46]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Product cards */}
        {!loading && !error && displayedProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProducts.map((product) => {
              const price = getProductPrice(product);
              const discount = getDiscount(product);
              const originalPrice =
                Number(product.originalPrice) || 0;
              const imageUrl = getImageUrl(product.image);
              const isWishlisted = wishlistIds.includes(
                String(product._id)
              );
              const isWishlistLoading = Boolean(
                wishlistLoading[product._id]
              );

              return (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-xl border border-[#E8DFD2] bg-[#FFFDF9] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(18,63,50,0.09)]"
                >
                  {/* Product image */}
                  <div className="relative overflow-hidden bg-[#F1EDE4]">
                    <Link
                      to={`/products/${product._id}`}
                      className="block"
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name || "Fashion product"}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-[#68766C]">
                            No image available
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Wishlist heart */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product._id)}
                      disabled={isWishlistLoading}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      aria-pressed={isWishlisted}
                      title={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DFD2] bg-[#FFFDF9] shadow-sm transition duration-200 hover:scale-110 hover:shadow-md disabled:cursor-wait disabled:opacity-60"
                    >
                      <span
                        className={`text-2xl leading-none ${
                          isWishlisted
                            ? "text-red-600"
                            : "text-[#123F32]"
                        }`}
                      >
                        {isWishlistLoading
                          ? "…"
                          : isWishlisted
                            ? "♥"
                            : "♡"}
                      </span>
                    </button>

                    {/* Discount badge */}
                    {discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-md bg-[#123F32] px-3 py-1.5 text-xs font-semibold text-white">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product information */}
                  <div className="p-4 sm:p-5">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A815A]">
                      MODEZA COLLECTION
                    </p>

                    <Link
                      to={`/products/${product._id}`}
                      className="line-clamp-1 font-serif text-lg font-semibold text-[#123F32] transition hover:text-[#9A815A]"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#68766C]">
                      {product.description ||
                        "Discover your new favourite style."}
                    </p>

                    {/* Price */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-[#123F32]">
                        ₹
                        {price.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>

                      {discount > 0 && originalPrice > price && (
                        <span className="text-sm text-[#9A9B91] line-through">
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* View details */}
                    <Link
                      to={`/products/${product._id}`}
                      className="mt-5 flex w-full items-center justify-center rounded-lg border border-[#123F32] px-4 py-3 text-sm font-semibold text-[#123F32] transition duration-300 hover:bg-[#123F32] hover:text-[#FFFDF9]"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && displayedProducts.length === 0 && (
          <div className="rounded-xl border border-[#E8DFD2] bg-[#FFFDF9] px-5 py-16 text-center">
            <div className="text-4xl text-[#D8C49A]">✿</div>

            <h2 className="mt-4 font-serif text-2xl font-semibold text-[#123F32]">
              {urlSearch
                ? "No Matching Products"
                : section === "deals"
                  ? "No Deals Available"
                  : section === "new-arrivals"
                    ? "No New Arrivals Yet"
                    : "No Products Found"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#68766C]">
              {urlSearch
                ? `We couldn't find products matching "${urlSearch}". Try a different product name or keyword.`
                : section === "deals"
                  ? "There are no discounted products available right now. Please check back later."
                  : section === "new-arrivals"
                    ? "New styles will appear here when products are added to the store."
                    : "Try another search or explore our full collection."}
            </p>

            {urlSearch ? (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-6 rounded-lg bg-[#123F32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245B46]"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/products"
                className="mt-6 inline-flex rounded-lg bg-[#123F32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245B46]"
              >
                Explore All Products
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;
