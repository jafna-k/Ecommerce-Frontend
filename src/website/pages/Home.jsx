
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const categories = [
  {
    name: "Women",
    description: "Beautiful styles for every day",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Men",
    description: "Modern everyday essentials",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Accessories",
    description: "The perfect finishing touches",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Home & Living",
    description: "Thoughtful pieces for your home",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
  },
];

const benefits = [
  {
    icon: "♧",
    title: "Quality You Can Trust",
    text: "Beautiful products, made with care.",
  },
  {
    icon: "♡",
    title: "Customer Support",
    text: "We're here whenever you need us.",
  },
  {
    icon: "✧",
    title: "Loved by Customers",
    text: "Find styles you'll love to wear.",
  },
  {
    icon: "♧",
    title: "Thoughtful Choices",
    text: "Shop your favourite styles.",
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product");
        const data = response.data;

        const productList = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        setProducts(
          productList.filter(
            (product) => product.status !== "inactive"
          )
        );
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(
          "Products could not be loaded. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const latestProducts = [...products].reverse().slice(0, 5);

  const getImage = (product) => {
    const image = product.images?.[0] || product.image;

    if (!image) {
      return "https://placehold.co/500x650?text=Dress+Shop";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <main className="overflow-hidden bg-[#faf7f0] text-[#24352e]">

      {/* Hero banner */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#557665]">
            <span className="h-px w-8 bg-[#557665]" />
            New Season Collection
          </span>

          <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.12] tracking-tight text-[#123f32] sm:text-6xl lg:text-7xl">
            Live Beautifully.
            <br />
            <span className="font-normal italic text-[#758b72]">
              Shop Effortlessly.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-[#6b7169] sm:text-lg">
            Discover beautiful styles and quality you love,
            delivered right to your door.
          </p>

          <Link
            to="/products"
            className="group mt-8 inline-flex items-center gap-5 rounded-lg bg-[#124536] px-7 py-4 text-sm font-semibold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#0b3428] hover:shadow-lg"
          >
            Shop Now
            <span className="text-xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <div className="mt-12 grid grid-cols-1 gap-5 border-t border-[#e8dfd2] pt-7 sm:grid-cols-3">
            <div>
              <span className="text-xl text-[#557665]">♧</span>
              <h3 className="mt-2 text-sm font-bold text-[#123f32]">
                Free Shipping
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#81796d]">
                On orders over ₹1000
              </p>
            </div>

            <div>
              <span className="text-xl text-[#557665]">♙</span>
              <h3 className="mt-2 text-sm font-bold text-[#123f32]">
                Secure Shopping
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#81796d]">
                Shop with confidence
              </p>
            </div>

            <div>
              <span className="text-xl text-[#557665]">↻</span>
              <h3 className="mt-2 text-sm font-bold text-[#123f32]">
                Easy Returns
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#81796d]">
                Simple return process
              </p>
            </div>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-xl lg:order-2 lg:max-w-none">
          <div className="absolute -right-5 top-5 h-3/4 w-3/4 rounded-t-full bg-[#e9e5d7] sm:-right-8 sm:top-8" />

          <div className="relative h-[380px] overflow-hidden rounded-t-full rounded-b-[180px] border-[8px] border-[#fffdf9] shadow-xl sm:h-[500px] lg:h-[590px]">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85"
              alt="Elegant seasonal fashion collection"
              className="h-full w-full object-cover object-top transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#123f32]/65 via-transparent to-transparent" />

            <div className="absolute bottom-8 left-6 right-6 text-white sm:bottom-10 sm:left-9">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e8dfc9]">
                The New Collection
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                Made for your moments.
              </h2>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-3 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[#e8dfd2] bg-[#fffdf9] text-center shadow-lg sm:-left-6 sm:h-28 sm:w-28">
            <span className="font-serif text-2xl italic text-[#124536]">
              Style
            </span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#81796d]">
              Every day
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-[#e8dfd2] bg-[#fffdf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#758b72]">
                Find Your Style
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#123f32] sm:text-4xl">
                Shop by Category
              </h2>
              <p className="mt-3 text-sm text-[#81796d]">
                Explore collections for every mood and moment.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#124536] transition hover:gap-4 sm:self-auto"
            >
              Browse all <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#f0eee7]">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-80"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f32]/70 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                      {category.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Explore <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sale banner */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid overflow-hidden rounded-3xl bg-[#e9e5d7] md:grid-cols-2">
          <div className="flex flex-col items-start justify-center px-7 py-12 sm:px-12 sm:py-16 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#557665]">
              ✧ Limited Time Offer
            </p>

            <h2 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#123f32] sm:text-5xl">
              A Little Something Special
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#59695e] sm:text-base">
              Discover your next favourite look with our selected
              seasonal styles.
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
              alt="Seasonal fashion collection"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-[#123f32]/10" />

            <div className="absolute right-5 top-5 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full bg-[#fffdf9] text-[#124536] shadow-lg sm:right-8 sm:top-8 sm:h-28 sm:w-28">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Discover
              </span>
              <span className="font-serif text-2xl font-bold">
                Style
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Today
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="border-y border-[#e8dfd2] bg-[#fffdf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
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
              View all <span>→</span>
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
                Our collection is coming soon!
              </h3>
              <p className="mt-3 text-sm text-[#81796d]">
                Please check back for new arrivals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {latestProducts.map((product) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden bg-[#f0eee7]">
                    <img
                      src={getImage(product)}
                      alt={product.name || "Dress"}
                      loading="lazy"
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-80"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-[#124536] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      Just In
                    </span>

                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#124536]/95 py-3 text-center text-sm font-semibold text-white transition duration-300 group-hover:translate-y-0">
                      View Product →
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-1 font-serif text-lg font-bold text-[#123f32]">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-base font-bold text-[#124536]">
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

      {/* Newsletter */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 rounded-3xl bg-[#123f32] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl text-[#e3d5b8]">
              ✉
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                Join the Dress Shop Circle
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/75">
                Be the first to discover new arrivals and exclusive offers.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full lg:max-w-md"
          >
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

      {/* Store benefits */}
      <section className="border-t border-[#e8dfd2] bg-[#fffdf9] px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start gap-4"
            >
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
