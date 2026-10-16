
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/user/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess(
        response.data.message ||
          "Account created successfully! Please log in."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const eyeIcon = (visible) =>
    visible ? (
      <svg
        viewBox="0 0 24 24"
        width="21"
        height="21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
        <path d="M9.9 5.2A11 11 0 0112 5c5 0 9 5 10 7a13 13 0 01-3.1 3.8" />
        <path d="M6.2 6.2C3.8 7.6 2.5 10 2 12c1 2 5 7 10 7 1.1 0 2.1-.2 3-.6" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        width="21"
        height="21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#ded6ca] bg-white px-4 py-3.5 text-sm text-[#24352e] outline-none transition placeholder:text-[#a49a8c] focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10";

  const passwordInputClass =
    "mt-2 w-full rounded-xl border border-[#ded6ca] bg-white py-3.5 pl-4 pr-12 text-sm text-[#24352e] outline-none transition placeholder:text-[#a49a8c] focus:border-[#164d3d] focus:ring-2 focus:ring-[#164d3d]/10";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f0] px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex flex-col items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#124536] font-serif text-3xl text-white shadow-md">
              ✿
            </span>

            <span className="mt-3 font-serif text-xl font-bold tracking-[0.18em] text-[#123f32]">
              DRESS SHOP
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <section className="rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] p-6 shadow-[0_15px_50px_rgba(18,63,50,0.07)] sm:p-9">

          <div className="mb-7 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#81796d]">
              Welcome to Dress Shop
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold text-[#123f32] sm:text-4xl">
              Create Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6b7169]">
              Join us and discover your perfect style.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span className="font-bold">!</span>
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              role="status"
              className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              <span className="font-bold">✓</span>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="text-sm font-semibold text-[#24352e]"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                className={inputClass}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-[#24352e]"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className={inputClass}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-[#24352e]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  className={passwordInputClass}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg p-1.5 text-[#81796d] transition hover:bg-[#f4f1e9] hover:text-[#124536] focus:outline-none focus:ring-2 focus:ring-[#164d3d]/30"
                >
                  {eyeIcon(showPassword)}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-[#24352e]"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={passwordInputClass}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg p-1.5 text-[#81796d] transition hover:bg-[#f4f1e9] hover:text-[#124536] focus:outline-none focus:ring-2 focus:ring-[#164d3d]/30"
                >
                  {eyeIcon(showConfirmPassword)}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#124536] px-5 py-4 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-[#0b3428] focus:outline-none focus:ring-2 focus:ring-[#164d3d] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-[#6b7169]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#124536] underline-offset-4 transition hover:text-[#0b3428] hover:underline"
            >
              Login
            </Link>
          </p>
        </section>

        {/* Footer */}
        <p className="mt-6 text-center text-xs leading-6 text-[#81796d]">
          By creating an account, you can explore styles
          <br className="hidden sm:block" /> and manage your orders with ease.
        </p>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-[#6b7169] transition hover:text-[#124536]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Register;
