
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import "../index.css";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );
  const [maxPrice, setMaxPrice] = useState(10000);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, variantRes] =
          await Promise.all([
            api.get("/product"),
            api.get("/category"),
            api.get("/productvariant"),
          ]);

        const productData = productRes.data;
        const categoryData = categoryRes.data;
        const variantData = variantRes.data;

        setProducts(
          Array.isArray(productData)
            ? productData
            : productData.products || []
        );

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.categories || []
        );

        setVariants(
          Array.isArray(variantData)
            ? variantData
            : variantData.variants || []
        );
      } catch (err) {
        console.error(err);
        setError(
          "Products could not be loaded. Check your backend routes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        !category ||
        String(
          product.category?._id || product.category
        ) === String(category);

      const productVariants = variants.filter(
        (variant) =>
          String(
            variant.product?._id || variant.product
          ) === String(product._id)
      );

      const matchesPrice = productVariants.some(
        (variant) =>
          Number(variant.price) <= maxPrice &&
          Number(variant.stockQuantity) > 0
      );

      const matchesSize =
        !size ||
        productVariants.some(
          (variant) =>
            String(variant.size).toLowerCase() ===
              size.toLowerCase() &&
            Number(variant.stockQuantity) > 0
        );

      const matchesColor =
        !color ||
        productVariants.some(
          (variant) =>
            String(variant.color).toLowerCase() ===
              color.toLowerCase() &&
            Number(variant.stockQuantity) > 0
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesColor
      );
    });

    if (sort === "price-low") {
      result.sort((a, b) => {
        const priceA = Math.min(
          ...variants
            .filter(
              (v) =>
                String(v.product?._id || v.product) ===
                String(a._id)
            )
            .map((v) => Number(v.price))
            .filter(Number.isFinite),
          Infinity
        );

        const priceB = Math.min(
          ...variants
            .filter(
              (v) =>
                String(v.product?._id || v.product) ===
                String(b._id)
            )
            .map((v) => Number(v.price))
            .filter(Number.isFinite),
          Infinity
        );

        return priceA - priceB;
      });
    }

    if (sort === "price-high") {
      result.reverse();
    }

    if (sort === "name") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    }

    return result;
  }, [products, variants, search, category, maxPrice, size, color, sort]);

  const sizes = [...new Set(
    variants.map((v) => v.size).filter(Boolean)
  )];

  const colors = [...new Set(
    variants.map((v) => v.color).filter(Boolean)
  )];

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setMaxPrice(10000);
    setSize("");
    setColor("");
    setSort("latest");
    setSearchParams({});
  };

  return (
    <main className="products-page">
      <section className="products-heading">
        <p className="eyebrow">THE COLLECTION</p>
        <h1>Discover Your Style</h1>
        <p>Find the perfect dress for every occasion.</p>
      </section>

      <div className="shop-layout">
        <aside className="filters">
          <div className="filter-title">
            <h2>Filters</h2>
            <button onClick={resetFilters}>Reset</button>
          </div>

          <label>
            Search
            <input
              type="search"
              placeholder="Search dresses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSearchParams(
                  e.target.value
                    ? { category: e.target.value }
                    : {}
                );
              }}
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Maximum Price: ₹{maxPrice}
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(Number(e.target.value))
              }
            />
          </label>

          <label>
            Size
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">All Sizes</option>
              {sizes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Color
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">All Colors</option>
              {colors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <section className="product-results">
          <div className="results-toolbar">
            <p>{filteredProducts.length} products found</p>

            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredProducts.length ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="empty-products">
              <h2>No products found</h2>
              <p>Try changing your filters.</p>
              <button
                className="product-button"
                onClick={resetFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Products;
