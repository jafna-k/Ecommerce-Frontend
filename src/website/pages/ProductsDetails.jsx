
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setMessage("");
      setProduct(null);
      setVariants([]);
      setSelectedVariant(null);
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);

      try {
        const productRes = await api.get(`/product/${id}`);
        const productData =
          productRes.data.product || productRes.data;

        let productVariants = [];

        try {
          const variantRes = await api.get("/productvariant");
          const data = variantRes.data;

          const allVariants = Array.isArray(data)
            ? data
            : data.variants ||
              data.productVariants ||
              data.data ||
              [];

          productVariants = allVariants.filter((variant) => {
            const variantProduct =
              variant.product?._id || variant.product;

            return String(variantProduct) === String(id);
          });
        } catch (variantError) {
          console.error(
            "Variant API error:",
            variantError.response?.data || variantError.message
          );
        }

        if (active) {
          setProduct(productData);
          setVariants(productVariants);
        }
      } catch (err) {
        console.error(
          "Product API error:",
          err.response?.data || err.message
        );

        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load product."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const availableVariants = variants.filter(
    (variant) => Number(variant.stock) > 0
  );

  const sizes = [
    ...new Set(
      availableVariants.map((variant) => variant.size).filter(Boolean)
    ),
  ];

  const colors = [
    ...new Set(
      availableVariants.map((variant) => variant.color).filter(Boolean)
    ),
  ];

  function chooseSize(size) {
    setSelectedSize(size);
    setSelectedVariant(null);
    setQuantity(1);
    setMessage("");

    const matches = availableVariants.filter(
      (variant) =>
        variant.size === size &&
        (!selectedColor || variant.color === selectedColor)
    );

    if (matches.length > 0) {
      const match =
        matches.find((variant) => variant.color === selectedColor) ||
        matches[0];

      setSelectedColor(match.color);
      setSelectedVariant(match);
    } else {
      setMessage("This size and color combination is out of stock.");
    }
  }

  function chooseColor(color) {
    setSelectedColor(color);
    setSelectedVariant(null);
    setQuantity(1);
    setMessage("");

    const matches = availableVariants.filter(
      (variant) =>
        variant.color === color &&
        (!selectedSize || variant.size === selectedSize)
    );

    if (matches.length > 0) {
      const match =
        matches.find((variant) => variant.size === selectedSize) ||
        matches[0];

      setSelectedSize(match.size);
      setSelectedVariant(match);
    } else {
      setMessage("This color and size combination is out of stock.");
    }
  }

  const variantPrices = variants
    .map((variant) => Number(variant.price ?? product?.price))
    .filter((price) => Number.isFinite(price));

  const displayPrice = selectedVariant
    ? selectedVariant.price ?? product?.price
    : variantPrices.length > 0
      ? Math.min(...variantPrices)
      : product?.price;

  const image = product?.images?.[0] || product?.image || "";

  const imageUrl = image
    ? image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `http://localhost:5000/${image.replace(/^\/+/, "")}`
    : "https://placehold.co/600x700?text=Dress";

  async function addToCart() {
    setMessage("");

    if (!localStorage.getItem("token")) {
      setMessage("Please login before adding products to cart.");
      return;
    }

    if (!selectedVariant) {
      setMessage("Please select an available size and color.");
      return;
    }

    if (
      quantity < 1 ||
      quantity > Number(selectedVariant.stock)
    ) {
      setMessage("Requested quantity is not available in stock.");
      return;
    }

    try {
      setAdding(true);

      await api.post("/cart", {
        productVariant: selectedVariant._id,
        quantity,
      });

      setMessage("Product added to cart successfully!");
    } catch (err) {
      console.error(
        "Add to cart error:",
        err.response?.data || err.message
      );

      setMessage(
        err.response?.data?.message ||
          "Could not add product to cart."
      );
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#faf7f0] text-[#124536]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8dfd2] border-t-[#124536]" />
        <p className="text-sm font-medium">
          Loading product details...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f0] px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf0e9] text-3xl text-[#124536]">
            !
          </div>

          <h2 className="mt-5 font-serif text-2xl font-bold text-[#123f32]">
            {error || "Product not found."}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#81796d]">
            Sorry, we couldn't load this product.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-[#124536] px-6 py-3 font-semibold text-white transition hover:bg-[#0b3428]"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-8 text-[#24352e] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#81796d]">
          <Link to="/" className="transition hover:text-[#124536]">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="transition hover:text-[#124536]"
          >
            Shop
          </Link>
          <span>/</span>
          <span className="font-medium text-[#124536]">
            {product.name}
          </span>
        </nav>

        {/* Product details */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14">

          {/* Product image */}
          <section className="min-w-0">
            <div className="group relative overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#f0eee7]">
              <img
                src={imageUrl}
                alt={product.name || "Dress"}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    "https://placehold.co/600x700?text=Dress";
                }}
                className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:aspect-[5/5]"
              />

              <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-[#fffdf9]/95 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-[#124536]">
                DRESS SHOP COLLECTION
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#e8dfd2] bg-[#fffdf9] p-3 text-center">
                <span className="text-lg text-[#124536]">✧</span>
                <p className="mt-1 text-xs font-medium text-[#6b7169]">
                  Curated Styles
                </p>
              </div>

              <div className="rounded-xl border border-[#e8dfd2] bg-[#fffdf9] p-3 text-center">
                <span className="text-lg text-[#124536]">♡</span>
                <p className="mt-1 text-xs font-medium text-[#6b7169]">
                  Made for You
                </p>
              </div>

              <div className="rounded-xl border border-[#e8dfd2] bg-[#fffdf9] p-3 text-center">
                <span className="text-lg text-[#124536]">✓</span>
                <p className="mt-1 text-xs font-medium text-[#6b7169]">
                  Stock Checked
                </p>
              </div>
            </div>
          </section>

          {/* Product information */}
          <section className="rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 shadow-sm sm:p-8 lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#81796d]">
              The Dress Shop Collection
            </p>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#123f32] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-sm leading-7 text-[#6b7169] sm:text-base">
              {product.description || "Discover a beautiful style from our collection."}
            </p>

            {/* Price */}
            <div className="mt-7 border-y border-[#e8dfd2] py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#81796d]">
                Price
              </p>

              <p className="mt-2 font-serif text-3xl font-bold text-[#124536]">
                {displayPrice != null &&
                Number.isFinite(Number(displayPrice))
                  ? `₹${Number(displayPrice).toLocaleString("en-IN")}`
                  : "Price unavailable"}
              </p>

              {selectedVariant && (
                <p className="mt-2 text-xs text-[#557665]">
                  Price for your selected variant
                </p>
              )}
            </div>

            {/* Size selection */}
            {sizes.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-[#24352e]">
                    Choose Size
                  </h3>

                  {selectedSize && (
                    <span className="text-xs text-[#81796d]">
                      Selected: {selectedSize}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((item) => (
                    <button
                      type="button"
                      key={item}
                      aria-pressed={selectedSize === item}
                      onClick={() => chooseSize(item)}
                      className={`flex h-12 min-w-12 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition ${
                        selectedSize === item
                          ? "border-[#124536] bg-[#124536] text-white shadow-sm"
                          : "border-[#ded6ca] bg-[#fffdf9] text-[#24352e] hover:border-[#124536] hover:text-[#124536]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selection */}
            {colors.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-[#24352e]">
                    Choose Color
                  </h3>

                  {selectedColor && (
                    <span className="text-xs text-[#81796d]">
                      Selected: {selectedColor}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {colors.map((item) => (
                    <button
                      type="button"
                      key={item}
                      aria-pressed={selectedColor === item}
                      onClick={() => chooseColor(item)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                        selectedColor === item
                          ? "border-[#124536] bg-[#eaf0e9] text-[#124536] ring-1 ring-[#124536]"
                          : "border-[#ded6ca] bg-[#fffdf9] text-[#24352e] hover:border-[#124536]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No stock */}
            {availableVariants.length === 0 && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                No available sizes or colors. Please check back later.
              </div>
            )}

            {/* Selected variant stock */}
            {selectedVariant && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#d5dfd2] bg-[#eaf0e9] p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#124536]">
                  ✓
                </span>

                <div>
                  <p className="text-sm font-bold text-[#124536]">
                    In Stock
                  </p>
                  <p className="mt-1 text-xs text-[#557665]">
                    {selectedVariant.stock} item(s) available
                  </p>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-7">
              <h3 className="mb-3 text-sm font-bold text-[#24352e]">
                Quantity
              </h3>

              <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#ded6ca] bg-[#fffdf9]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={!selectedVariant || quantity <= 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="flex h-12 w-12 items-center justify-center text-xl text-[#124536] transition hover:bg-[#eaf0e9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <span className="flex h-12 min-w-12 items-center justify-center border-x border-[#ded6ca] px-3 text-sm font-bold text-[#123f32]">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={
                    !selectedVariant ||
                    quantity >= Number(selectedVariant.stock)
                  }
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-12 w-12 items-center justify-center text-xl text-[#124536] transition hover:bg-[#eaf0e9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {selectedVariant && (
                <p className="mt-2 text-xs text-[#81796d]">
                  Maximum {selectedVariant.stock} item(s) for this variant
                </p>
              )}
            </div>

            {/* Add to cart */}
            <button
              type="button"
              disabled={!selectedVariant || adding}
              onClick={addToCart}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#124536] px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b3428] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>♡</span>
              {adding ? "Adding to Cart..." : "Add to Cart"}
            </button>

            {/* Feedback message */}
            {message && (
              <div
                role="status"
                className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${
                  message.includes("successfully")
                    ? "border-[#d5dfd2] bg-[#eaf0e9] text-[#124536]"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                {message}

                {message.includes("Please login") && (
                  <>
                    {" "}
                    <Link
                      to="/login"
                      className="font-bold underline underline-offset-2"
                    >
                      Login here
                    </Link>
                  </>
                )}

                {message.includes("successfully") && (
                  <>
                    {" "}
                    <Link
                      to="/cart"
                      className="font-bold underline underline-offset-2"
                    >
                      View Cart
                    </Link>
                  </>
                )}
              </div>
            )}

            <div className="mt-6 border-t border-[#e8dfd2] pt-5">
              <p className="text-xs leading-6 text-[#81796d]">
                Size and color availability depends on the stock for each
                variant. Please select your preferred options before
                adding the product to your cart.
              </p>

              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#124536] transition hover:text-[#0b3428] hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
