import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer>

      <div className="container">

        <div className="footer-top">

          <div className="footer-brand">

            <h2>MultiShop</h2>

            <p>
              The modern multi-vendor marketplace built with
              Next.js & Django.
            </p>

          </div>

          <div className="footer-links">

            <div>

              <h3>Shop</h3>

              <Link href="/">Products</Link>

              <Link href="/">Stores</Link>

              <Link href="/">Categories</Link>

              <Link href="/">Discounts</Link>

            </div>

            <div>

              <h3>Company</h3>

              <Link href="/">About</Link>

              <Link href="/">Blog</Link>

              <Link href="/">Careers</Link>

              <Link href="/">Terms</Link>

            </div>

            <div>

              <h3>Support</h3>

              <Link href="/">Contact</Link>

              <Link href="/">FAQ</Link>

              <Link href="/">Privacy</Link>

              <Link href="/">Help Center</Link>

            </div>

          </div>

        </div>

        <div className="footer-bottom">

          <p>© 2026 MultiShop. All rights reserved.</p>

        </div>

      </div>

    </footer>
  );
}