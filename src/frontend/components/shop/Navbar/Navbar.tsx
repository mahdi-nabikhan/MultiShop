import Link from "next/link";
import "@/components/shop/Navbar/Navbar.css";

export default function Navbar() {
  return (
    <nav>
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <Link href="/">MultiShop</Link>
        </div>

        {/* Navigation */}
        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/stores">Stores</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

        {/* Search */}
        <form className="search-box">
          <input type="text" placeholder="Search products..." />
          <button type="submit">Search</button>
        </form>

        {/* Authentication */}
        <div className="auth-buttons">
          <button>Login</button>
          <button>Register</button>
        </div>
      </div>
    </nav>
  );
}