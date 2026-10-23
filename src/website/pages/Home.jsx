
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const API_ORIGIN = "http://localhost:5000";

const benefits = [
  {
    icon: "✧",
    title: "Quality You Can Trust",
    text: "Beautiful products, thoughtfully selected for you.",
  },
  {
    icon: "♡",
    title: "Customer Support",
    text: "We're here whenever you need us.",
  },
  {
    icon: "❋",
    title: "Styles You'll Love",
    text: "Find pieces that feel uniquely you.",
  },
  {
    icon: "♧",
    title: "Easy Shopping",
    text: "Discover your favourite looks with ease.",
  },
];

function getArray(responseData, key) {
  const data = responseData?.data ?? responseData;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];

  return [];
}

function getImageUrl(image, fallbackText = "MODEZA") {
  if (!image) {
    return `https://placehold.co/600x800/F0EEE7/123F32?text=${fallbackText}`;
  }

  if (/^https?:\/\//i.test(image)) return image;

  return `${API_ORIGIN}/${String(image).replace(/^\/+/, "")}`;
}

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        const response = await api.get("/product");
        const productList = getArray(response.data, "products");

        if (mounted) {
          setProducts(
            productList.filter(
              (product) =>
                String(product.status ?? "active").toLowerCase() === "active"
            )
          );
          setError("");
        }
      } catch (err) {
        console.error("Failed to load products:", err);

        if (mounted) {
          setError("Products could not be loaded. Please try again later.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchCategories() {
      try {
        const response = await api.get("/category");
        const categoryList = getArray(response.data, "categories");

        if (mounted) {
          setCategories(
            categoryList.filter(
              (category) =>
                String(category.status ?? "active").toLowerCase() === "active"
            )
          );
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    }

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const latestProducts = [...products].reverse().slice(0, 5);

  function handleSubscribe(event) {
    event.preventDefault();
    setSubscribed(true);
    setEmail("");
  }

  return (
    <main className="overflow-hidden bg-[#faf7f0] text-[#24352e]">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#faf7f0]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-9 px-5 py-10 sm:px-8 sm:py-14 lg:min-h-[650px] lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-16">

          {/* LEFT CONTENT */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#dce3d8] bg-[#fffdf9] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#758b72]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#557665] sm:text-xs">
                New Season Collection
              </span>
            </div>

            <h1 className="mt-6 font-serif text-[43px] font-medium leading-[1.12] tracking-tight text-[#123f32] sm:text-6xl lg:text-[66px]">
              Timeless Style
              <br />
              for <span className="italic text-[#758b72]">Every You.</span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-[#6b7169] sm:text-base sm:leading-8">
              Discover fashion for both men and women. From everyday
              essentials to special occasion favourites, find styles
              that make you feel confident in every moment.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="group inline-flex items-center gap-5 rounded-md bg-[#124536] px-7 py-4 text-sm font-semibold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#0b3428] hover:shadow-lg"
              >
                Shop Now
                <span className="text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

             
            </div>

            {/* HIGHLIGHTS */}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#e8dfd2] pt-6 sm:mt-12 sm:gap-5">
              <div>
                <span className="text-xl text-[#758b72]">✧</span>
                <h3 className="mt-2 text-xs font-bold text-[#123f32] sm:text-sm">
                  Timeless Style
                </h3>
                <p className="mt-1 text-[10px] leading-5 text-[#81796d] sm:text-xs">
                  Made for you
                </p>
              </div>

              <div>
                <span className="text-xl text-[#758b72]">♡</span>
                <h3 className="mt-2 text-xs font-bold text-[#123f32] sm:text-sm">
                  Quality First
                </h3>
                <p className="mt-1 text-[10px] leading-5 text-[#81796d] sm:text-xs">
                  Carefully selected
                </p>
              </div>

              <div>
                <span className="text-xl text-[#758b72]">↻</span>
                <h3 className="mt-2 text-xs font-bold text-[#123f32] sm:text-sm">
                  Easy Shopping
                </h3>
                <p className="mt-1 text-[10px] leading-5 text-[#81796d] sm:text-xs">
                  Shop with ease
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE - IMAGE STAYS INSIDE ARCH */}
          <div className="relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:max-w-none">

            {/* Background decoration */}
            <div className="absolute right-0 top-5 h-[88%] w-[88%] rounded-t-full bg-[#e9e5d7] sm:right-1 sm:top-7" />

            {/* Arch container */}
            <div className="relative z-10 mr-3 h-[390px] overflow-hidden rounded-t-full rounded-b-[150px] border-[6px] border-[#fffdf9] bg-[#e9e5d7] shadow-xl sm:mr-5 sm:h-[500px] sm:rounded-b-[190px] sm:border-[8px] lg:mr-7 lg:h-[570px]">

              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85"
                alt="MODEZA fashion collection for men and women"
                loading="eager"
                className="absolute inset-0 block h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    "https://placehold.co/700x1000/F0EEE7/123F32?text=MODEZA";
                }}
              />

              {/* Image overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#123f32]/70 via-transparent to-transparent" />

              {/* Text inside image */}
              <div className="pointer-events-none absolute bottom-8 left-5 right-5 z-10 text-white sm:bottom-10 sm:left-8 sm:right-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e8dfc9] sm:text-xs">
                  For Him & Her
                </p>

                <h2 className="mt-3 max-w-sm font-serif text-2xl font-medium leading-tight sm:text-3xl lg:text-4xl">
                  Wear What Feels Like You.
                </h2>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-3 -left-1 z-20 flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full border border-[#e8dfd2] bg-[#fffdf9] text-center shadow-lg sm:-bottom-4 sm:-left-3 sm:h-28 sm:w-28">
              <span className="font-serif text-xl italic text-[#124536] sm:text-2xl">
                Modeza
              </span>
              <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-[#81796d] sm:text-[9px]">
                Simply timeless
              </span>
            </div>

            {/* Small label */}
            <div className="absolute right-0 top-8 z-20 rounded-full border border-[#e8dfd2] bg-[#fffdf9] px-3 py-2 shadow-sm sm:right-1 sm:top-12 sm:px-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#557665] sm:text-[10px]">
                Style • Comfort • You
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="px-3 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] px-2 py-6 sm:px-8 sm:py-8">

          <div className="mb-7 flex items-center justify-between gap-2 px-2 sm:px-0">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#758b72] sm:text-xs">
                Find Your Style
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold tracking-tight text-[#123f32] sm:text-3xl">
                Shop by Category
              </h2>
            </div>

            {categories.length > 6 && !categoriesLoading && (
              <button
                type="button"
                onClick={() => setShowAllCategories((prev) => !prev)}
                className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#24352e] hover:text-[#758b72] sm:text-sm"
              >
                {showAllCategories ? "Show less" : "Browse all"}
                <span>{showAllCategories ? "↑" : "→"}</span>
              </button>
            )}
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 sm:gap-5">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex flex-col items-center">
                  <div className="aspect-square w-full max-w-[100px] animate-pulse rounded-full bg-[#e9e5d7]" />
                  <div className="mt-3 h-3 w-14 animate-pulse rounded bg-[#e9e5d7]" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#81796d]">
              No active categories available.
            </p>
          ) : (
            <div
              className={
                showAllCategories
                  ? "flex flex-wrap justify-center gap-x-4 gap-y-7 sm:gap-x-7"
                  : "grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-6 sm:gap-x-5"
              }
            >
              {(showAllCategories
                ? categories
                : categories.slice(0, 6)
              ).map((category) => {
                const categoryId = String(category._id ?? category.id);

                const itemCount = products.filter((product) => {
                  const productCategory =
                    product.category?._id ?? product.category;

                  return (
                    productCategory != null &&
                    String(productCategory) === categoryId
                  );
                }).length;

                return (
                  <Link
                    key={categoryId}
                    to={`/products?category=${encodeURIComponent(categoryId)}`}
                    className={
                      showAllCategories
                        ? "group flex w-[100px] flex-col items-center text-center sm:w-[130px]"
                        : "group flex min-w-0 flex-col items-center text-center"
                    }
                  >
                    <div className="mx-auto aspect-square w-full max-w-[90px] overflow-hidden rounded-full bg-[#f0eee7] ring-1 ring-[#e8dfd2] transition duration-300 group-hover:ring-2 group-hover:ring-[#758b72] sm:max-w-[110px] lg:max-w-[125px]">
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.name || "Fashion category"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://placehold.co/400x400/F0EEE7/123F32?text=MODEZA";
                        }}
                      />
                    </div>

                    <h3 className="mt-3 w-full break-words text-xs font-semibold leading-tight text-[#24352e] transition group-hover:text-[#758b72] sm:text-sm">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-[10px] text-[#81796d] sm:text-xs">
                      {itemCount} items
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SEASONAL COLLECTION */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid overflow-hidden rounded-3xl bg-[#e9e5d7] md:grid-cols-2">

          <div className="flex flex-col items-start justify-center px-7 py-12 sm:px-12 sm:py-16 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#557665]">
              ✧ The MODEZA Edit
            </p>

            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#123f32] sm:text-5xl">
              A Little Something Special
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#59695e] sm:text-base">
              Discover your next favourite look with our carefully
              selected collection for men and women, from everyday
              essentials to occasion wear.
            </p>

            <Link
              to="/products"
              className="group mt-8 inline-flex items-center gap-4 border-b-2 border-[#124536] pb-2 text-sm font-bold text-[#124536] transition hover:gap-6"
            >
              Explore Collection <span>→</span>
            </Link>
          </div>

          <div className="relative min-h-[300px] overflow-hidden md:min-h-[440px]">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
              alt="MODEZA seasonal fashion collection"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://placehold.co/900x700/F0EEE7/123F32?text=MODEZA";
              }}
            />
            <div className="absolute inset-0 bg-[#123f32]/10" />

            <div className="absolute right-5 top-5 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full bg-[#fffdf9] text-[#124536] shadow-lg sm:right-8 sm:top-8 sm:h-28 sm:w-28">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Discover
              </span>
              <span className="font-serif text-2xl font-bold">Style</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Today
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="border-y border-[#e8dfd2] bg-[#fffdf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#758b72]">
                Fresh Finds
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold text-[#123f32] sm:text-4xl">
                New Arrivals
              </h2>

              <p className="mt-3 text-sm text-[#81796d]">
                Explore styles picked just for you.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#124536] transition hover:gap-4 sm:self-auto"
            >
              View All <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-[#124536]">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#124536]" />
              <p className="text-sm font-medium">
                Loading beautiful styles...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#e8dfd2] bg-[#faf7f0] px-5 py-12 text-center">
              <p className="text-sm text-[#8b453e]">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-[#124536] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3428]"
              >
                Try Again
              </button>
            </div>
          ) : latestProducts.length === 0 ? (
            <div className="rounded-2xl border border-[#e8dfd2] bg-[#faf7f0] px-5 py-14 text-center">
              <h3 className="font-serif text-2xl font-bold text-[#123f32]">
                Our Collection Is Coming Soon!
              </h3>

              <p className="mt-3 text-sm text-[#81796d]">
                Please check back for new arrivals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
              {latestProducts.map((product) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden bg-[#f0eee7]">
                    <img
                      src={getImageUrl(
                        product.images?.[0] || product.image
                      )}
                      alt={product.name || "Fashion product"}
                      loading="lazy"
                      className="h-48 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-72"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/500x650/F0EEE7/123F32?text=MODEZA";
                      }}
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-[#124536] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      Just In
                    </span>

                    <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-[#124536]/95 py-3 text-center text-sm font-semibold text-white transition duration-300 group-hover:translate-y-0 sm:block">
                      View Product →
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="line-clamp-1 font-serif text-base font-bold text-[#123f32] sm:text-lg">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-[#124536] sm:text-base">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-3 rounded-lg border border-[#124536] px-7 py-3.5 text-sm font-bold text-[#124536] transition hover:bg-[#124536] hover:text-white"
            >
              Discover All Products <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 rounded-3xl bg-[#123f32] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl text-[#e3d5b8]">
              ✉
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                Join the MODEZA Circle
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-7 text-white/75">
                Be the first to discover new arrivals and exclusive offers.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:max-w-md">
            {subscribed ? (
              <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-sm text-white">
                Thank you for your interest!
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  required
                  className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/60 focus:border-[#d9c9a8] focus:ring-2 focus:ring-[#d9c9a8]/30"
                />

                <button
                  type="submit"
                  className="rounded-lg bg-[#e8dfc9] px-6 py-3.5 text-sm font-bold text-[#123f32] transition hover:bg-white"
                >
                  Subscribe
                </button>
              </div>
            )}

            <p className="mt-3 text-xs text-white/60">
              Newsletter demo only — email addresses are not saved or sent.
            </p>
          </form>
        </div>
      </section>

      {/* STORE BENEFITS */}
      <section className="border-t border-[#e8dfd2] bg-[#fffdf9] px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf0e9] font-serif text-2xl text-[#124536]">
                {benefit.icon}
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#123f32]">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#81796d]">
                  {benefit.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;



