

// import { useEffect, useMemo, useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import api from "../../services/api";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("latest");

//   const [searchParams] = useSearchParams();
//   const selectedCategoryId = searchParams.get("category");

//   // Fetch products
//   useEffect(() => {
//     let active = true;

//     async function loadProducts() {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await api.get("/product");
//         const data = response.data;

//         const list = Array.isArray(data)
//           ? data
//           : data?.products ?? data?.data ?? [];

//         if (active) {
//           setProducts(Array.isArray(list) ? list : []);
//         }
//       } catch (err) {
//         console.error("Products loading error:", err);

//         if (active) {
//           setError(
//             err.response?.data?.message ||
//               "Unable to load products. Please try again."
//           );
//         }
//       } finally {
//         if (active) setLoading(false);
//       }
//     }

//     loadProducts();

//     return () => {
//       active = false;
//     };
//   }, []);

//   // Get category ID from populated object or ID string
//   const getCategoryId = (product) => {
//     const category = product.category;

//     if (category && typeof category === "object") {
//       return category._id ?? category.id ?? "";
//     }

//     return category ?? "";
//   };

//   // Filter by selected category, search and sort
//   const displayedProducts = useMemo(() => {
//     let result = products.filter((product) => {
//       // Hide inactive products
//       if (
//         String(product.status || "active").toLowerCase() === "inactive"
//       ) {
//         return false;
//       }

//       // Selected category filter
//       if (selectedCategoryId) {
//         const productCategoryId = getCategoryId(product);

//         if (
//           String(productCategoryId).toLowerCase() !==
//           String(selectedCategoryId).toLowerCase()
//         ) {
//           return false;
//         }
//       }

//       // Search by product name
//       if (
//         !String(product.name || "")
//           .toLowerCase()
//           .includes(search.trim().toLowerCase())
//       ) {
//         return false;
//       }

//       return true;
//     });

//     // Sort products
//     if (sort === "price-low") {
//       result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
//     } else if (sort === "price-high") {
//       result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
//     } else if (sort === "name") {
//       result.sort((a, b) =>
//         String(a.name || "").localeCompare(String(b.name || ""))
//       );
//     } else {
//       result.sort(
//         (a, b) =>
//           new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
//       );
//     }

//     return result;
//   }, [products, selectedCategoryId, search, sort]);

//   const getImage = (product) => {
//     const image =
//       product.image ||
//       (Array.isArray(product.images) ? product.images[0] : "");

//     if (!image) return FALLBACK_IMAGE;

//     if (image.startsWith("http://") || image.startsWith("https://")) {
//       return image;
//     }

//     return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
//   };

//   const formatPrice = (price) =>
//     Number(price).toLocaleString("en-IN");

//   return (
//     <main className="min-h-screen bg-[#faf7f0] text-[#24352e]">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden border-b border-[#e8dfd2] bg-[#f0eee4] px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
//         <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#d8d5c7] sm:h-96 sm:w-96" />
//         <div className="pointer-events-none absolute -right-5 -top-5 h-56 w-56 rounded-full border border-[#d8d5c7] sm:h-72 sm:w-72" />

//         <div className="relative mx-auto max-w-7xl">
//           <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#557665]">
//             The Modeza Collection
//           </p>

//           <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#123f32] sm:text-6xl lg:text-7xl">
//             Find Your
//             <br />
//             <span className="font-normal italic">Perfect Style</span>
//           </h1>

//           <p className="mt-5 max-w-lg text-sm leading-7 text-[#6b7169] sm:text-base">
//             Timeless pieces, beautiful details, and styles made for you.
//             Discover something special for every occasion.
//           </p>

//           <div className="mt-7 flex items-center gap-3 text-sm text-[#81796d]">
//             <Link to="/" className="hover:text-[#124536]">
//               Home
//             </Link>
//             <span>/</span>
//             <span className="font-semibold text-[#124536]">Shop</span>
//           </div>
//         </div>
//       </section>

//       {/* Products Section - No Sidebar */}
//       <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
//         {/* Heading and Search */}
//         <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#81796d]">
//               Curated For You
//             </p>

//             <h2 className="mt-2 font-serif text-3xl font-bold text-[#123f32] sm:text-4xl">
//               Our Collection
//             </h2>

//             <p className="mt-3 text-sm text-[#6b7169]">
//               {loading
//                 ? "Loading products..."
//                 : `${displayedProducts.length} products found`}
//             </p>
//           </div>

//           <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
//             <input
//               type="search"
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               placeholder="Search products..."
//               aria-label="Search products"
//               className="w-full rounded-xl border border-[#ded6ca] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#164d3d] sm:w-64"
//             />

//             <select
//               value={sort}
//               onChange={(event) => setSort(event.target.value)}
//               aria-label="Sort products"
//               className="w-full rounded-xl border border-[#ded6ca] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#164d3d] sm:w-52"
//             >
//               <option value="latest">Latest products</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="name">Name: A to Z</option>
//             </select>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="flex min-h-80 flex-col items-center justify-center">
//             <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#124536]" />
//             <p className="mt-4 text-sm text-[#81796d]">
//               Loading your favourite styles...
//             </p>
//           </div>
//         )}

//         {/* Error */}
//         {!loading && error && (
//           <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-16 text-center">
//             <h3 className="font-serif text-2xl font-bold text-[#123f32]">
//               Something went wrong
//             </h3>
//             <p className="mt-3 text-sm text-[#81796d]">{error}</p>
//             <button
//               type="button"
//               onClick={() => window.location.reload()}
//               className="mt-6 rounded-xl bg-[#124536] px-6 py-3 font-semibold text-white hover:bg-[#0b3428]"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && !error && displayedProducts.length === 0 && (
//           <div className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] px-6 py-16 text-center">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf0e9] text-3xl text-[#124536]">
//               ♡
//             </div>

//             <h3 className="mt-5 font-serif text-2xl font-bold text-[#123f32]">
//               No Products Found
//             </h3>

//             <p className="mt-3 text-sm text-[#81796d]">
//               Try another search or explore our complete collection.
//             </p>

//             <div className="mt-6 flex flex-wrap justify-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => setSearch("")}
//                 className="rounded-xl border border-[#124536] px-5 py-3 text-sm font-semibold text-[#124536] hover:bg-[#124536] hover:text-white"
//               >
//                 Clear Search
//               </button>

//               <Link
//                 to="/products"
//                 className="rounded-xl bg-[#124536] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b3428]"
//               >
//                 View All Products
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Product Grid */}
//         {!loading && !error && displayedProducts.length > 0 && (
//           <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
//             {displayedProducts.map((product) => (
//               <Link
//                 to={`/products/${product._id}`}
//                 key={product._id}
//                 className="group overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] transition duration-300 hover:-translate-y-1 hover:border-[#c9d5c9] hover:shadow-lg"
//               >
//                 {/* Product Image */}
//                 <div className="relative aspect-[3/4] overflow-hidden bg-[#f0eee7]">
//                   <img
//                     src={getImage(product)}
//                     alt={product.name || "Product"}
//                     loading="lazy"
//                     onError={(event) => {
//                       event.currentTarget.onerror = null;
//                       event.currentTarget.src = FALLBACK_IMAGE;
//                     }}
//                     className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//                   />

//                   <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-[#fffdf9]/95 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-[#124536]">
//                     MODEZA
//                   </span>

//                   <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#124536]/95 px-4 py-3 text-center text-sm font-semibold text-white transition duration-300 group-hover:translate-y-0">
//                     View Product →
//                   </div>
//                 </div>

//                 {/* Product Details */}
//                 <div className="p-5">
//                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#81796d]">
//                     Fashion House
//                   </p>

//                   <h3 className="mt-2 line-clamp-2 font-serif text-xl font-bold text-[#123f32] transition group-hover:text-[#557665]">
//                     {product.name || "Unnamed Product"}
//                   </h3>

//                   <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#eee7dc] pt-5">
//                     <p className="text-lg font-bold text-[#124536]">
//                       {product.price != null &&
//                       Number.isFinite(Number(product.price))
//                         ? `₹${formatPrice(product.price)}`
//                         : "Price unavailable"}
//                     </p>

//                     <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ded6ca] text-lg text-[#124536] transition group-hover:border-[#124536] group-hover:bg-[#124536] group-hover:text-white">
//                       →
//                     </span>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}

//         {!loading && !error && displayedProducts.length > 0 && (
//           <p className="mt-8 text-center text-xs text-[#81796d]">
//             Showing {displayedProducts.length} products
//           </p>
//         )}
//       </section>
//     </main>
//   );
// }



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
  const [searchParams] = useSearchParams();

  const section = searchParams.get("section") || "shop";
  const categoryId = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

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
              "Products load cheyyan kazhinjilla. Please try again."
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

  const displayedProducts = useMemo(() => {
    let result = [...products];

    // Show active products only when status is provided.
    result = result.filter(
      (product) =>
        !product.status ||
        product.status.toLowerCase() === "active"
    );

    // Preserve category selection when the URL contains a category ID.
    if (categoryId) {
      result = result.filter((product) => {
        const productCategory =
          typeof product.category === "object"
            ? product.category?._id
            : product.category;

        return String(productCategory || "") === String(categoryId);
      });
    }

    // New Arrivals: newest products first.
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

    // Deals: products that have a discount.
    if (section === "deals") {
      result = result.filter(
        (product) => getDiscount(product) > 0
      );
    }

    // Search products.
    const searchText = search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((product) => {
        const name = (product.name || "").toLowerCase();
        const description = (
          product.description || ""
        ).toLowerCase();

        return (
          name.includes(searchText) ||
          description.includes(searchText)
        );
      });
    }

    // Sort products.
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

      {/* Product section */}
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        {/* Search and sorting */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#68766C]">
            {loading
              ? "Loading products..."
              : `${displayedProducts.length} products`}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-[#E0D8CA] bg-[#FFFDF9] px-4 py-3 text-sm text-[#123F32] outline-none transition focus:border-[#123F32] sm:w-64"
            />

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
              const originalPrice = Number(product.originalPrice) || 0;
              const imageUrl = getImageUrl(product.image);

              return (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-xl border border-[#E8DFD2] bg-[#FFFDF9] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(18,63,50,0.09)]"
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="relative block overflow-hidden bg-[#F1EDE4]"
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

                    {discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-md bg-[#123F32] px-3 py-1.5 text-xs font-semibold text-white">
                        {discount}% OFF
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 right-3 translate-y-3 rounded-lg bg-[#FFFDF9]/95 py-3 text-center text-xs font-semibold tracking-wide text-[#123F32] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      VIEW PRODUCT
                    </span>
                  </Link>

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
                      {product.description || "Discover your new favourite style."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-[#123F32]">
                        ₹{price.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>

                      {discount > 0 && originalPrice > price && (
                        <span className="text-sm text-[#9A9B91] line-through">
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

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
              {section === "deals"
                ? "No Deals Available"
                : section === "new-arrivals"
                  ? "No New Arrivals Yet"
                  : "No Products Found"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#68766C]">
              {section === "deals"
                ? "There are no discounted products available right now. Please check back later."
                : section === "new-arrivals"
                  ? "New styles will appear here when products are added to the store."
                  : "Try another search or explore our full collection."}
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-lg bg-[#123F32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245B46]"
            >
              Explore All Products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;
