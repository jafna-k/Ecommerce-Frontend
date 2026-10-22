
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const API_ORIGIN = "http://localhost:5000";

function getImageUrl(image) {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) return image;

  return `${API_ORIGIN}/${String(image).replace(/^\/+/, "")}`;
}

function Collections() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/category");
        const data = response.data?.data ?? response.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.categories)
            ? data.categories
            : [];

        if (mounted) {
          setCategories(
            list.filter(
              (category) =>
                String(category.status ?? "active").toLowerCase() ===
                "active"
            )
          );
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load collections. Please try again."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      {/* Header */}
      <section className="border-b border-[#E8DFD2] bg-[#FFFDF9] px-4 py-14 text-center sm:py-20">
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#9A815A]">
          CURATED FOR YOU
        </p>

        <h1 className="font-serif text-3xl font-semibold text-[#123F32] sm:text-4xl lg:text-5xl">
          Our Collections
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#68766C] sm:text-base">
          Explore thoughtfully selected collections and discover styles
          that suit every occasion.
        </p>

        <div className="mx-auto mt-6 h-[2px] w-16 bg-[#D8C49A]" />
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#123F32]">
              Explore by Category
            </h2>
            <p className="mt-2 text-sm text-[#68766C]">
              Find your favourite styles in one place.
            </p>
          </div>

          <Link
            to="/products"
            className="shrink-0 text-sm font-semibold text-[#123F32] underline decoration-[#D8C49A] underline-offset-4 hover:text-[#9A815A]"
          >
            Shop All
          </Link>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#D8C49A] border-t-[#123F32]" />
            <p className="mt-4 text-sm text-[#68766C]">
              Loading collections...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-[#FFFDF9] p-8 text-center">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#123F32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#245B46]"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const imageUrl = getImageUrl(category.image);

              return (
                <Link
                  key={category._id}
                  to={`/products?category=${encodeURIComponent(category._id)}`}
                  className="group overflow-hidden rounded-2xl border border-[#E8DFD2] bg-[#FFFDF9] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(18,63,50,0.10)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE8DD]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-serif text-xl text-[#68766C]">
                        MODEZA
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#123F32]/75 via-transparent to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5">
                      <span className="text-[10px] font-semibold tracking-[0.2em] text-[#E9D7AF]">
                        DISCOVER MODEZA
                      </span>

                      <h3 className="mt-2 font-serif text-2xl font-semibold text-white sm:text-3xl">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[#68766C]">
                      {category.description ||
                        `Discover our ${category.name} collection and find a style for every occasion.`}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[#E8DFD2] pt-4">
                      <span className="text-xs font-bold tracking-[0.12em] text-[#123F32]">
                        EXPLORE COLLECTION
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8C49A] text-lg text-[#123F32] transition group-hover:bg-[#123F32] group-hover:text-white">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="rounded-2xl border border-[#E8DFD2] bg-[#FFFDF9] px-5 py-16 text-center">
            <div className="text-4xl text-[#D8C49A]">✿</div>

            <h2 className="mt-4 font-serif text-2xl font-semibold text-[#123F32]">
              Collections Coming Soon
            </h2>

            <p className="mt-3 text-sm text-[#68766C]">
              Add active categories from your admin dashboard to display
              them here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-lg bg-[#123F32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245B46]"
            >
              Shop All Products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default Collections;
