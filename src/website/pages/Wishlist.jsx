
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const API_ORIGIN = "http://localhost:5000";

function getImageUrl(image) {
  if (!image || typeof image !== "string") return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
}

export default function Wishlist() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    let active = true;

    api
      .get("/wishlist")
      .then((response) => {
        if (active) {
          setProducts(response.data.products || []);
        }
      })
      .catch((error) => {
        if (!active) return;

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          navigate("/login");
        } else {
          setMessage("Unable to load your wishlist. Please try again.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const removeProduct = async (productId) => {
    if (removing[productId]) return;

    setRemoving((previous) => ({
      ...previous,
      [productId]: true,
    }));

    try {
      await api.delete(`/wishlist/${productId}`);

      setProducts((previous) =>
        previous.filter((product) => product._id !== productId)
      );

      setMessage("Product removed from wishlist.");
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/login");
      } else {
        setMessage("Unable to remove product. Please try again.");
      }
    } finally {
      setRemoving((previous) => ({
        ...previous,
        [productId]: false,
      }));
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>YOUR PERSONAL COLLECTION</p>
        <h1 style={styles.title}>My Wishlist <span>♥</span></h1>
        <p style={styles.subtitle}>
          The pieces you love, all in one place.
        </p>
      </header>

      {message && (
        <p role="status" style={styles.message}>
          {message}
        </p>
      )}

      {products.length === 0 ? (
        <section style={styles.empty}>
          <div style={styles.emptyHeart}>♡</div>
          <h2>Your wishlist is waiting</h2>
          <p>
            Save your favourite styles and find them here whenever
            you need them.
          </p>
          <Link to="/products" style={styles.shopButton}>
            Explore Products
          </Link>
        </section>
      ) : (
        <>
          <p style={styles.count}>
            {products.length} saved {products.length === 1 ? "item" : "items"}
          </p>

          <div style={styles.grid}>
            {products.map((product) => (
              <article key={product._id} style={styles.card}>
                <Link
                  to={`/products/${product._id}`}
                  style={styles.imageLink}
                >
                  {product.image ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.noImage}>No image available</div>
                  )}
                </Link>

                <div style={styles.cardBody}>
                  <h3 style={styles.productName}>{product.name}</h3>

                  <p style={styles.price}>
                    ₹{Number(product.price ?? product.originalPrice ?? 0).toLocaleString("en-IN")}
                  </p>

                  <Link
                    to={`/products/${product._id}`}
                    style={styles.detailsButton}
                  >
                    View Product
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeProduct(product._id)}
                    disabled={Boolean(removing[product._id])}
                    style={styles.removeButton}
                  >
                    {removing[product._id]
                      ? "Removing..."
                      : "♥  Remove from Wishlist"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "70vh",
    background: "#FAF7F0",
    color: "#123F32",
    padding: "45px 5% 70px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "3px",
    color: "#77776B",
  },
  title: {
    fontSize: "clamp(30px, 4vw, 44px)",
    margin: "12px 0",
    fontWeight: 600,
  },
  subtitle: {
    color: "#77776B",
    fontSize: "15px",
  },
  message: {
    background: "#F3F0E7",
    padding: "12px 16px",
    borderRadius: "8px",
  },
  count: {
    color: "#77776B",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#FFFDF9",
    border: "1px solid #E7E1D5",
    borderRadius: "12px",
    overflow: "hidden",
  },
  imageLink: {
    display: "block",
    height: "280px",
    background: "#F3F0E7",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  noImage: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#77776B",
  },
  cardBody: {
    padding: "16px",
  },
  productName: {
    fontSize: "16px",
    fontWeight: 500,
    margin: "0 0 8px",
  },
  price: {
    fontWeight: 600,
    marginBottom: "16px",
  },
  detailsButton: {
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    background: "#164D3D",
    color: "#FFFDF9",
    padding: "11px",
    borderRadius: "7px",
    marginBottom: "9px",
  },
  removeButton: {
    width: "100%",
    padding: "10px",
    border: "1px solid #E7E1D5",
    borderRadius: "7px",
    background: "#FFFDF9",
    color: "#8C4141",
    cursor: "pointer",
  },
  empty: {
    maxWidth: "480px",
    margin: "50px auto",
    textAlign: "center",
    padding: "35px 20px",
    background: "#FFFDF9",
    border: "1px solid #E7E1D5",
    borderRadius: "14px",
  },
  emptyHeart: {
    fontSize: "55px",
    color: "#164D3D",
  },
  shopButton: {
    display: "inline-block",
    marginTop: "16px",
    padding: "12px 24px",
    borderRadius: "7px",
    background: "#164D3D",
    color: "#FFFDF9",
    textDecoration: "none",
  },
};
