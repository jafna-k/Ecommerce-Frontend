

import { Link, useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const linkStyle =
    "transition-colors duration-300 hover:text-[#c6aa7b]";

  const handleCollectionsClick = (event) => {
    event.preventDefault();

    const targetUrl = "/products?section=collections";

    if (location.pathname === "/products") {
      navigate(targetUrl);

      setTimeout(() => {
        document.getElementById("collections")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } else {
      navigate(targetUrl);
    }
  };

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/",
    },
    {
      label: "Pinterest",
      href: "https://www.pinterest.com/",
    },
  ];

  return (
    <footer className="bg-[#123f32] text-[#faf7f0]">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-16">

        {/* Brand */}
        <div>
          <Link to="/" className="inline-block">
            <h2 className="font-serif text-3xl font-bold tracking-[0.18em]">
              MODEZA
            </h2>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c6aa7b]">
              Fashion House
            </p>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-[#d6dfd8]">
            Discover timeless fashion, elegant essentials, and styles
            designed to make every moment special.
          </p>

          {/* Social Links */}
          <div className="mt-5 flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-bold transition duration-300 hover:border-[#c6aa7b] hover:bg-[#c6aa7b] hover:text-[#123f32]"
              >
                {social.label.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 font-serif text-lg font-bold text-[#e1c79a]">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-[#d6dfd8]">
            <li>
              <Link to="/" className={linkStyle}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/products" className={linkStyle}>
                Shop
              </Link>
            </li>

            <li>
              <a
                href="/products?section=collections"
                onClick={handleCollectionsClick}
                className={linkStyle}
              >
                Collections
              </a>
            </li>

            <li>
              <Link to="/orders" className={linkStyle}>
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="mb-5 font-serif text-lg font-bold text-[#e1c79a]">
            Customer Care
          </h3>

          <ul className="space-y-3 text-sm text-[#d6dfd8]">
            <li>
              <Link to="/profile" className={linkStyle}>
                My Account
              </Link>
            </li>

            <li>
              <Link to="/cart" className={linkStyle}>
                Shopping Cart
              </Link>
            </li>

            <li>
              <Link to="/orders" className={linkStyle}>
                Track Orders
              </Link>
            </li>

            <li>
              <a
                href="mailto:support@modeza.com"
                className={linkStyle}
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Stay in Style */}
        <div>
          <h3 className="mb-5 font-serif text-lg font-bold text-[#e1c79a]">
            Stay in Style
          </h3>

          <p className="text-sm leading-6 text-[#d6dfd8]">
            Explore new arrivals and discover timeless fashion for every
            occasion.
          </p>

          <Link
            to="/products?section=new-arrivals"
            className="mt-5 inline-flex items-center gap-3 border-b border-[#c6aa7b] pb-2 text-sm font-semibold text-[#e1c79a] transition-all duration-300 hover:gap-5"
          >
            Explore Collection <span>→</span>
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left lg:px-8">
          <p className="text-xs text-[#d6dfd8]">
            © {new Date().getFullYear()} MODEZA Fashion House. All rights
            reserved.
          </p>

          <p className="text-xs tracking-wide text-[#c6aa7b]">
            Elegance in Every Thread
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
