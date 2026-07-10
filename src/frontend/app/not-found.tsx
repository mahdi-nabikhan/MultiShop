import Link from "next/link";
import { Home, Store } from "lucide-react";

import "./not-found.css";

export default function NotFound() {
  return (
    <section className="not-found">

      <div className="not-found-content">

        <span className="code">
          404
        </span>

        <h1>
          Oops! Page Not Found
        </h1>

        <p>
          The page you are looking for doesn't exist or may have been moved.
          Explore our marketplace and discover amazing products from trusted stores.
        </p>

        <div className="buttons">

          <Link
            href="/"
            className="primary-btn"
          >
            <Home size={18} />
            Back Home
          </Link>

          <Link
            href="/stores"
            className="secondary-btn"
          >
            <Store size={18} />
            Browse Stores
          </Link>

        </div>

      </div>

    </section>
  );
}