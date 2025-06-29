import { Link } from "react-router";

export default function Navigation() {
  return (
    <header>
      <nav>
        <div className="logo">
          <img src="/asset/banjo_sandwich_logo_transparent.png" alt="Banjo Sandwich" className="logo-img" />
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/members">Members</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
