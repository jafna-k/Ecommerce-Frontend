
// import { Link } from "react-router-dom";

// function Profile() {
//   let user = {};

//   try {
//     user = JSON.parse(localStorage.getItem("user") || "{}") || {};
//   } catch {
//     user = {};
//   }

//   const initial = user.name?.trim()
//     ? user.name.trim().charAt(0).toUpperCase()
//     : "U";

//   const displayRole = user.role
//     ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
//     : "Registered User";

//   return (
//     <main className="min-h-screen bg-[#f7f5ef] px-4 py-8 sm:px-6 sm:py-12">
//       <div className="mx-auto max-w-4xl">

//         {/* Breadcrumb */}
//         <nav className="mb-7 flex items-center gap-2 text-xs text-[#898579] sm:text-sm">
//           <Link to="/" className="transition hover:text-[#245541]">
//             Home
//           </Link>
//           <span className="text-[#c0b8a9]">/</span>
//           <span className="font-semibold text-[#245541]">
//             My Profile
//           </span>
//         </nav>

//         {/* Main profile card */}
//         <section className="overflow-hidden rounded-[28px] border border-[#e8e3d8] bg-white shadow-[0_20px_60px_rgba(30,55,42,0.09)]">

//           {/* Brand header */}
//           <div className="relative overflow-hidden bg-[#173d30] px-6 py-10 text-center sm:px-10 sm:py-14">
//             <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
//             <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/10" />
//             <div className="absolute right-1/4 top-8 h-32 w-32 rounded-full bg-[#d9c6a1]/10 blur-3xl" />

//             <Link
//               to="/"
//               className="relative z-10 inline-block text-2xl font-bold tracking-[0.18em] text-white sm:text-3xl"
//             >
//               MODEZA
//             </Link>

//             <p className="relative z-10 mt-2 text-[9px] tracking-[0.42em] text-[#d9c6a1] sm:text-[10px]">
//               STYLE YOUR STORY
//             </p>

//             <div className="relative z-10 mt-7">
//               <span className="inline-block rounded-full border border-white/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#e2d2b4]">
//                 Your Personal Space
//               </span>

//               <h1 className="mt-4 font-serif text-3xl font-medium text-white sm:text-4xl">
//                 My Profile
//               </h1>

//               <p className="mt-3 text-sm text-[#d7e0d9]">
//                 Your account, your style, your story.
//               </p>
//             </div>
//           </div>

//           {/* Profile content */}
//           <div className="px-5 pb-8 sm:px-10 sm:pb-10">

//             {/* Avatar */}
//             <div className="-mt-12 flex justify-center">
//               <div className="flex h-24 w-24 items-center justify-center rounded-full border-[5px] border-white bg-[#e8ede5] shadow-md sm:h-28 sm:w-28">
//                 <span className="font-serif text-4xl font-bold text-[#245541] sm:text-5xl">
//                   {initial}
//                 </span>
//               </div>
//             </div>

//             {/* Name and role */}
//             <div className="mt-4 text-center">
//               <h2 className="break-words font-serif text-2xl font-semibold text-[#173d30] sm:text-3xl">
//                 {user.name || "Welcome"}
//               </h2>

//               <p className="mt-2 break-all text-sm text-[#898579]">
//                 {user.email || "Email not available"}
//               </p>

//               <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#dce7dc] bg-[#f0f5ee] px-4 py-1.5 text-xs font-semibold text-[#245541]">
//                 <span className="h-1.5 w-1.5 rounded-full bg-[#548260]" />
//                 {displayRole}
//               </span>
//             </div>

//             {/* Divider */}
//             <div className="my-8 flex items-center gap-4">
//               <div className="h-px flex-1 bg-[#e9e5dc]" />
//               <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a28e6c]">
//                 Account Information
//               </span>
//               <div className="h-px flex-1 bg-[#e9e5dc]" />
//             </div>

//             {/* Details */}
//             <div className="grid gap-4 sm:grid-cols-2">

//               {/* Full name */}
//               <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e3d8] bg-[#fcfbf8] p-4 transition duration-200 hover:border-[#c9d5c8] sm:p-5">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8ede5] text-[#245541]">
//                   <svg
//                     viewBox="0 0 24 24"
//                     width="22"
//                     height="22"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.6"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     aria-hidden="true"
//                   >
//                     <circle cx="12" cy="8" r="4" />
//                     <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
//                   </svg>
//                 </div>

//                 <div className="min-w-0">
//                   <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#898579]">
//                     Full Name
//                   </p>
//                   <p className="mt-1 break-words text-sm font-semibold text-[#293b31] sm:text-base">
//                     {user.name || "Not available"}
//                   </p>
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e3d8] bg-[#fcfbf8] p-4 transition duration-200 hover:border-[#c9d5c8] sm:p-5">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8ede5] text-[#245541]">
//                   <svg
//                     viewBox="0 0 24 24"
//                     width="22"
//                     height="22"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.6"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     aria-hidden="true"
//                   >
//                     <rect x="3" y="5" width="18" height="14" rx="2" />
//                     <path d="m3 7 9 6 9-6" />
//                   </svg>
//                 </div>

//                 <div className="min-w-0">
//                   <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#898579]">
//                     Email Address
//                   </p>
//                   <p className="mt-1 break-all text-sm font-semibold text-[#293b31] sm:text-base">
//                     {user.email || "Not available"}
//                   </p>
//                 </div>
//               </div>

//               {/* Account role */}
//               <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e3d8] bg-[#fcfbf8] p-4 transition duration-200 hover:border-[#c9d5c8] sm:p-5">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0e9db] text-[#92764b]">
//                   <svg
//                     viewBox="0 0 24 24"
//                     width="22"
//                     height="22"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.6"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     aria-hidden="true"
//                   >
//                     <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
//                     <path d="m9 12 2 2 4-4" />
//                   </svg>
//                 </div>

//                 <div className="min-w-0">
//                   <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#898579]">
//                     Account Type
//                   </p>
//                   <p className="mt-1 text-sm font-semibold text-[#293b31] sm:text-base">
//                     {displayRole}
//                   </p>
//                 </div>
//               </div>

//               {/* Membership */}
//               <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e3d8] bg-[#fcfbf8] p-4 transition duration-200 hover:border-[#c9d5c8] sm:p-5">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0e9db] text-[#92764b]">
//                   <svg
//                     viewBox="0 0 24 24"
//                     width="22"
//                     height="22"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.6"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     aria-hidden="true"
//                   >
//                     <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
//                   </svg>
//                 </div>

//                 <div className="min-w-0">
//                   <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#898579]">
//                     Membership
//                   </p>
//                   <p className="mt-1 text-sm font-semibold text-[#293b31] sm:text-base">
//                     Modeza Member
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="mt-8 grid gap-3 sm:grid-cols-2">
//               <Link
//                 to="/products"
//                 className="group flex items-center justify-center gap-3 rounded-xl bg-[#173d30] px-5 py-4 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#245541] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#315a47]/20"
//               >
//                 Explore Collection
//                 <span className="transition-transform duration-300 group-hover:translate-x-1">
//                   →
//                 </span>
//               </Link>

//               <Link
//                 to="/orders"
//                 className="group flex items-center justify-center gap-3 rounded-xl border border-[#ded8cb] bg-white px-5 py-4 text-sm font-semibold text-[#245541] transition duration-300 hover:border-[#315a47] hover:bg-[#f5f4ed] focus:outline-none focus:ring-4 focus:ring-[#315a47]/10"
//               >
//                 My Orders
//                 <span className="transition-transform duration-300 group-hover:translate-x-1">
//                   →
//                 </span>
//               </Link>
//             </div>

//             <p className="mt-8 text-center font-serif text-lg italic text-[#8d846f]">
//               "Style is a way to say who you are."
//             </p>

//             <p className="mt-3 text-center text-[10px] tracking-[0.16em] text-[#aaa69d]">
//               © 2026 MODEZA. STYLE YOUR STORY.
//             </p>
//           </div>
//         </section>

//         {/* Back to home */}
//         <div className="mt-6 text-center">
//           <Link
//             to="/"
//             className="text-sm font-medium text-[#898579] transition hover:text-[#245541]"
//           >
//             ← Back to Home
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default Profile;



import { Link } from "react-router-dom";

function Profile() {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}") || {};
  } catch {
    user = {};
  }

  const initial = user.name?.trim()
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  const displayRole = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Registered User";

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">

        {/* Breadcrumb */}
        <nav className="mb-7 flex items-center gap-2 text-xs text-[#898579] sm:text-sm">
          <Link to="/" className="transition hover:text-[#245541]">
            Home
          </Link>
          <span className="text-[#c0b8a9]">/</span>
          <span className="font-semibold text-[#245541]">
            My Profile
          </span>
        </nav>

        {/* Profile Card */}
        <section className="overflow-visible rounded-[28px] border border-[#e8e3d8] bg-white shadow-[0_20px_60px_rgba(30,55,42,0.09)]">

          {/* Header */}
          <div className="relative z-0 overflow-hidden rounded-t-[27px] bg-[#173d30] px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute right-1/4 top-8 h-32 w-32 rounded-full bg-[#d9c6a1]/10 blur-3xl" />

            <Link
              to="/"
              className="relative z-10 inline-block text-2xl font-bold tracking-[0.18em] text-white sm:text-3xl"
            >
              MODEZA
            </Link>

            <p className="relative z-10 mt-2 text-[9px] tracking-[0.42em] text-[#d9c6a1] sm:text-[10px]">
              STYLE YOUR STORY
            </p>

            <div className="relative z-10 mt-7">
              <span className="inline-block rounded-full border border-white/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#e2d2b4]">
                Your Personal Space
              </span>

              <h1 className="mt-4 font-serif text-3xl font-medium text-white sm:text-4xl">
                My Profile
              </h1>

              <p className="mt-3 text-sm text-[#d7e0d9]">
                Your account, your style, your story.
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative overflow-visible px-5 pb-8 sm:px-10 sm:pb-10">

            {/* Avatar - Full Circle Fix */}
            <div className="relative z-10 -mt-12 flex w-full justify-center overflow-visible">
              <div className="box-border flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[5px] border-white bg-[#e8ede5] shadow-lg sm:h-28 sm:w-28">
                <span className="select-none font-serif text-4xl font-bold leading-none text-[#245541] sm:text-5xl">
                  {initial}
                </span>
              </div>
            </div>

            {/* Name and Email */}
            <div className="mt-4 text-center">
              <h2 className="break-words font-serif text-2xl font-semibold text-[#173d30] sm:text-3xl">
                {user.name || "Welcome"}
              </h2>

              <p className="mt-2 break-all text-sm text-[#898579]">
                {user.email || "Email not available"}
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#dce7dc] bg-[#f0f5ee] px-4 py-1.5 text-xs font-semibold text-[#245541]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#548260]" />
                {displayRole}
              </span>
            </div>

            {/* Section Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e9e5dc]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a28e6c]">
                Account Information
              </span>
              <div className="h-px flex-1 bg-[#e9e5dc]" />
            </div>

            {/* Information Cards */}
            <div className="grid gap-4 sm:grid-cols-2">

              {/* Full Name */}
              <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e3d8] bg-[#fcfbf8] p-4 transition duration-200 hover:border-[#c9d5c8] sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8ede5] text-[#245541]">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#898579]">
                    Full Name
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#293b31] sm:text-base">
                    {user.name || "Not available"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e3d8] bg-[#fcfbf8] p-4 transition duration-200 hover:border-[#c9d5c8] sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8ede5] text-[#245541]">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#898579]">
                    Email Address
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-[#293b31] sm:text-base">
                    {user.email || "Not available"}
                  </p>
                </div>
              </div>

              {/* Account Type */}
              <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e3d8] bg-[#fcfbf8] p-4 transition duration-200 hover:border-[#c9d5c8] sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0e9db] text-[#92764b]">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#898579]">
                    Account Type
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#293b31] sm:text-base">
                    {displayRole}
                  </p>
                </div>
              </div>

              {/* Membership */}
              <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#e8e3d8] bg-[#fcfbf8] p-4 transition duration-200 hover:border-[#c9d5c8] sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0e9db] text-[#92764b]">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#898579]">
                    Membership
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#293b31] sm:text-base">
                    Modeza Member
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                to="/products"
                className="group flex items-center justify-center gap-3 rounded-xl bg-[#173d30] px-5 py-4 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#245541] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#315a47]/20"
              >
                Explore Collection
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/orders"
                className="group flex items-center justify-center gap-3 rounded-xl border border-[#ded8cb] bg-white px-5 py-4 text-sm font-semibold text-[#245541] transition duration-300 hover:border-[#315a47] hover:bg-[#f5f4ed] focus:outline-none focus:ring-4 focus:ring-[#315a47]/10"
              >
                My Orders
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center font-serif text-lg italic text-[#8d846f]">
              "Style is a way to say who you are."
            </p>

            <p className="mt-3 text-center text-[10px] tracking-[0.16em] text-[#aaa69d]">
              © 2026 MODEZA. STYLE YOUR STORY.
            </p>
          </div>
        </section>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-[#898579] transition hover:text-[#245541]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Profile;
