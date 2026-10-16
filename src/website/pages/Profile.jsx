
import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <main className="min-h-screen bg-[#faf7f0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#81796d]">
          <Link to="/" className="transition hover:text-[#124536]">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-[#124536]">
            My Profile
          </span>
        </nav>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-3xl border border-[#e8dfd2] bg-[#fffdf9] shadow-sm">

          {/* Header */}
          <div className="relative bg-[#124536] px-6 py-10 text-center sm:py-12">
            <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full border border-white/10" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full border border-white/10" />

            <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-[#d7e3d8]">
              DRESS SHOP
            </p>

            <h1 className="relative mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">
              My Profile
            </h1>

            <p className="relative mt-3 text-sm text-[#d7e3d8]">
              Your personal space, your style.
            </p>
          </div>

          {/* Avatar */}
          <div className="px-5 pb-8 sm:px-10">
            <div className="-mt-12 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#fffdf9] bg-[#e8eee5] shadow-md">
                <span className="font-serif text-4xl font-bold text-[#124536]">
                  {initial}
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="font-serif text-2xl font-bold text-[#123f32]">
                {user.name || "Welcome"}
              </h2>

              <p className="mt-1 text-sm text-[#81796d]">
                Manage your personal information
              </p>
            </div>

            {/* Profile Details */}
            <div className="mt-9 space-y-4">

              {/* Full Name */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#faf7f0] p-4 sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5ece3] text-xl text-[#124536]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#81796d]">
                    Full Name
                  </p>
                  <p className="mt-1 break-words text-base font-semibold text-[#24352e]">
                    {user.name || "Not available"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#faf7f0] p-4 sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5ece3] text-[#124536]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#81796d]">
                    Email Address
                  </p>
                  <p className="mt-1 break-all text-base font-semibold text-[#24352e]">
                    {user.email || "Not available"}
                  </p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#faf7f0] p-4 sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5ece3] text-[#124536]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#81796d]">
                    Account
                  </p>
                  <p className="mt-1 text-base font-semibold text-[#124536]">
                    {user.role
                      ? user.role.charAt(0).toUpperCase() +
                        user.role.slice(1)
                      : "Registered User"}
                  </p>
                </div>

                <span className="rounded-full bg-[#e5ece3] px-3 py-1 text-xs font-semibold text-[#124536]">
                  Active
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#124536] px-5 py-3.5 text-sm font-bold text-white transition duration-200 hover:bg-[#0b3428] focus:outline-none focus:ring-2 focus:ring-[#164d3d] focus:ring-offset-2"
              >
                <span>←</span>
                Back to Home
              </Link>

              <Link
                to="/orders"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#ded6ca] bg-white px-5 py-3.5 text-sm font-bold text-[#124536] transition duration-200 hover:border-[#124536] hover:bg-[#f4f1e9] focus:outline-none focus:ring-2 focus:ring-[#164d3d] focus:ring-offset-2"
              >
                My Orders
                <span>→</span>
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-[#81796d]">
              Thank you for being part of Dress Shop.
              <br />
              Discover styles that feel like you.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
