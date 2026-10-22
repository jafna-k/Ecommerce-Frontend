
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
    <div className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e8e3d8] bg-white shadow-[0_25px_70px_rgba(30,55,42,0.12)] md:grid-cols-2">

        {/* Left brand section */}
        <div className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-[#173d30] p-10 text-white md:flex lg:p-14">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full border border-white/10" />

          <div className="absolute right-12 top-28 h-32 w-32 rounded-full bg-[#d9c6a1]/10 blur-2xl" />

          <Link to="/" className="relative z-10 inline-block">
            <span className="text-3xl font-bold tracking-[0.16em]">
              MODEZA
            </span>
            <span className="mt-2 block text-[10px] tracking-[0.42em] text-[#d9c6a1]">
              STYLE YOUR STORY
            </span>
          </Link>

          <div className="relative z-10 py-10">
            <span className="mb-5 inline-block rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#e2d2b4]">
              The Art of Dressing
            </span>

            <h1 className="font-serif text-5xl leading-[1.2] lg:text-6xl">
              Wear Your
              <br />
              <span className="italic text-[#d9c6a1]">Confidence.</span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#d7e0d9]">
              Discover timeless essentials and contemporary styles
              designed to make every moment feel special.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <div className="h-px w-12 bg-[#d9c6a1]" />
              <span className="text-xs tracking-[0.2em] text-[#e4d7bd]">
                ELEVATE YOUR EVERYDAY
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs tracking-wide text-[#c2d0c7]">
            Thoughtful style. Effortless elegance.
          </p>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-14">
          <div className="w-full max-w-md">

            <Link
              to="/"
              className="mb-8 inline-block text-sm font-medium text-[#315a47] transition hover:text-[#173d30] md:hidden"
            >
              ← Back to Home
            </Link>

            {/* Mobile brand */}
            <Link to="/" className="mb-8 inline-block md:hidden">
              <span className="text-2xl font-bold tracking-[0.15em] text-[#173d30]">
                MODEZA
              </span>
              <span className="mt-1 block text-[9px] tracking-[0.35em] text-[#9b8969]">
                STYLE YOUR STORY
              </span>
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#a28e6c]">
                Welcome Back
              </p>

              <h2 className="font-serif text-4xl font-medium text-[#173d30] sm:text-[42px]">
                Sign In
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#777c74]">
                Welcome to Modeza. Sign in to explore your style.
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
                  className="mb-2 block text-sm font-semibold text-[#293b31]"
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
                  className="w-full rounded-xl border border-[#e3e0d7] bg-[#fcfbf8] px-4 py-3.5 text-sm text-[#26382e] outline-none transition placeholder:text-[#aaa69d] focus:border-[#315a47] focus:ring-4 focus:ring-[#315a47]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#293b31]"
                >
                  Password
                </label>

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
                    className="w-full rounded-xl border border-[#e3e0d7] bg-[#fcfbf8] px-4 py-3.5 pr-16 text-sm text-[#26382e] outline-none transition placeholder:text-[#aaa69d] focus:border-[#315a47] focus:ring-4 focus:ring-[#315a47]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#315a47] transition hover:text-[#173d30]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#173d30] px-5 py-4 text-sm font-semibold tracking-wide text-white shadow-md transition duration-300 hover:bg-[#245541] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#315a47]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && (
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e9e5dc]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#a29c90]">
                New to Modeza?
              </span>
              <div className="h-px flex-1 bg-[#e9e5dc]" />
            </div>

            <p className="text-center text-sm text-[#777c74]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#245541] underline-offset-4 transition hover:text-[#173d30] hover:underline"
              >
                Create Account
              </Link>
            </p>

            <Link
              to="/products"
              className="mt-7 block text-center text-xs font-medium tracking-wide text-[#898579] transition hover:text-[#245541]"
            >
              Continue shopping →
            </Link>

            <p className="mt-10 text-center text-[10px] tracking-wide text-[#aaa69d]">
              © 2026 MODEZA. STYLE YOUR STORY.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
