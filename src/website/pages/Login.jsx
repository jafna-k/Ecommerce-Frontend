
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../index.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const data = response.data;
      const token = data.token || data.accessToken;
      const user = data.user || data.customer;

      if (!token) {
        setError(
          "Login response-il token kittiyilla. Backend login response check cheyyuka."
        );
        return;
      }

      // Clear old login details
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Save new login details
      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Redirect based on role
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Login failed. Email and password check cheyyuka."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <p className="eyebrow">WELCOME BACK</p>

        <h1>Login</h1>

        <p className="login-description">
          Sign in to continue shopping at Dress Shop.
        </p>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <label htmlFor="email">Email address</label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <button
          className="login-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>

        <Link className="login-back" to="/products">
          Continue shopping
        </Link>
      </form>
    </main>
  );
}

export default Login;
