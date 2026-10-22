
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
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        width="17"
        height="17"
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
        width="17"
        height="17"
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
    "mt-2.5 w-full rounded-xl border border-[#e3e0d7] bg-[#fcfbf8] px-4 py-3.5 text-sm text-[#26382e] outline-none transition duration-200 placeholder:text-[#aaa69d] focus:border-[#315a47] focus:ring-4 focus:ring-[#315a47]/10";

  const passwordInputClass =
    "mt-2.5 w-full rounded-xl border border-[#e3e0d7] bg-[#fcfbf8] py-3.5 pl-4 pr-12 text-sm text-[#26382e] outline-none transition duration-200 placeholder:text-[#aaa69d] focus:border-[#315a47] focus:ring-4 focus:ring-[#315a47]/10";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e8e3d8] bg-white shadow-[0_25px_70px_rgba(30,55,42,0.12)] md:grid-cols-2">

        {/* Left brand section */}
        <div className="relative hidden min-h-[700px] flex-col justify-between overflow-hidden bg-[#173d30] p-10 text-white md:flex lg:p-14">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute right-10 top-40 h-40 w-40 rounded-full bg-[#d9c6a1]/10 blur-3xl" />

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
              Discover Your Style
            </span>

            <h1 className="font-serif text-5xl leading-[1.2] lg:text-6xl">
              A New
              <br />
              <span className="italic text-[#d9c6a1]">
                Chapter
              </span>
              <br />
              in Style.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#d7e0d9]">
              Create your Modeza account and explore timeless
              essentials, modern collections, and styles that
              feel uniquely you.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <div className="h-px w-12 bg-[#d9c6a1]" />
              <span className="text-xs tracking-[0.2em] text-[#e4d7bd]">
                YOUR STYLE JOURNEY STARTS HERE
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs tracking-wide text-[#c2d0c7]">
            Thoughtful style. Effortless elegance.
          </p>
        </div>

        {/* Register form */}
        <div className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-10 md:px-10 lg:px-14">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <Link to="/" className="mb-7 inline-flex flex-col md:hidden">
              <span className="text-2xl font-bold tracking-[0.15em] text-[#173d30]">
                MODEZA
              </span>
              <span className="mt-1 text-[9px] tracking-[0.35em] text-[#9b8969]">
                STYLE YOUR STORY
              </span>
            </Link>

            <div className="mb-7">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#a28e6c]">
                Join the Collection
              </p>

              <h2 className="font-serif text-4xl font-medium text-[#173d30] sm:text-[42px]">
                Create Account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#777c74]">
                Become a part of Modeza and discover your
                signature style.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <span className="font-bold">!</span>
                <p>{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              >
                <span className="font-bold">✓</span>
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[#293b31]"
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
                  className="block text-sm font-semibold text-[#293b31]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
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
                  className="block text-sm font-semibold text-[#293b31]"
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg p-2 text-[#81796d] transition hover:bg-[#f0eee7] hover:text-[#173d30] focus:outline-none focus:ring-2 focus:ring-[#315a47]/30"
                  >
                    {eyeIcon(showPassword)}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#293b31]"
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
                    minLength={6}
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
                    className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg p-2 text-[#81796d] transition hover:bg-[#f0eee7] hover:text-[#173d30] focus:outline-none focus:ring-2 focus:ring-[#315a47]/30"
                  >
                    {eyeIcon(showConfirmPassword)}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-[#173d30] px-5 py-4 text-sm font-semibold tracking-wide text-white shadow-md transition duration-300 hover:bg-[#245541] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#315a47]/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e9e5dc]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#a29c90]">
                Already a member?
              </span>
              <div className="h-px flex-1 bg-[#e9e5dc]" />
            </div>

            <p className="text-center text-sm text-[#777c74]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#245541] underline-offset-4 transition hover:text-[#173d30] hover:underline"
              >
                Sign In
              </Link>
            </p>

            <Link
              to="/"
              className="mt-6 block text-center text-xs font-medium tracking-wide text-[#898579] transition hover:text-[#245541]"
            >
              ← Back to Home
            </Link>

            <p className="mt-8 text-center text-[10px] tracking-wide text-[#aaa69d]">
              © 2026 MODEZA. STYLE YOUR STORY.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
