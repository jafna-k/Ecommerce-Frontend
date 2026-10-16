

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const data = response.data;

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      const user =
        data.user ||
        data.customer ||
        data.data?.user ||
        data.data?.customer;

      if (!token) {
        setError(data.message || "Login token not received.");
        return;
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      const role = user?.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f0] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] shadow-[0_20px_60px_rgba(18,63,50,0.10)]">

        {/* Left design section */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-[#123f32] p-10 text-[#fffdf9]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/10" />

          <Link
            to="/"
            className="relative text-2xl font-bold tracking-[0.2em]"
          >
            DRESS <span className="text-[#d9c9a8]">SHOP</span>
          </Link>

          <div className="relative z-10 py-12">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#d9c9a8]">
              Welcome to Dress Shop
            </p>

            <h1 className="font-serif text-5xl leading-tight">
              Elegance in
              <br />
              Every Detail.
            </h1>

            <p className="mt-6 max-w-sm leading-7 text-[#e4e8e2]">
              Discover styles that reflect your personality.
              Your perfect dress is just a step away.
            </p>

            <div className="mt-8 h-1 w-20 rounded-full bg-[#d9c9a8]" />
          </div>

          <p className="relative text-sm text-[#d4dfd8]">
            Timeless style. Everyday elegance.
          </p>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12">
          <div className="w-full max-w-md">

            <Link
              to="/"
              className="mb-8 inline-block text-sm font-semibold text-[#124536] hover:text-[#0b3428] md:hidden"
            >
              ← Back to Home
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#8a806f]">
                Your account
              </p>

              <h2 className="font-serif text-4xl font-bold text-[#123f32]">
                Welcome Back
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6b7169]">
                Sign in to continue shopping with us.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#24352e]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-[#ded6ca] bg-[#fffdf9] px-4 py-3.5 text-[#24352e] outline-none transition placeholder:text-[#aaa397] focus:border-[#164d3d] focus:ring-4 focus:ring-[#164d3d]/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#24352e]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-[#ded6ca] bg-[#fffdf9] px-4 py-3.5 pr-20 text-[#24352e] outline-none transition placeholder:text-[#aaa397] focus:border-[#164d3d] focus:ring-4 focus:ring-[#164d3d]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#124536] hover:text-[#0b3428]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#124536] px-5 py-3.5 font-semibold text-white shadow-md transition duration-200 hover:bg-[#0b3428] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#124536]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e8dfd2]" />
              <span className="text-xs uppercase tracking-wider text-[#968d80]">
                New to Dress Shop?
              </span>
              <div className="h-px flex-1 bg-[#e8dfd2]" />
            </div>

            <p className="text-center text-sm text-[#6b7169]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#124536] underline-offset-4 hover:text-[#0b3428] hover:underline"
              >
                Create Account
              </Link>
            </p>

            <Link
              to="/products"
              className="mt-6 block text-center text-sm font-medium text-[#81796d] transition hover:text-[#124536]"
            >
              Continue shopping →
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
