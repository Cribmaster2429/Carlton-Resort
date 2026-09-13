import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "../authModal/AuthModal";
import "./navbar.css";

const links = [
  { label: "Stay", href: "/#stay" },
  { label: "Dine", href: "/#dine" },
  { label: "Experiences", href: "/#experiences" },
  { label: "Spa", href: "/#spa" },
  { label: "Events", href: "/#events" },
];

// overlay: transparent over the hero, turns solid once the page scrolls.
const Navbar = ({ overlay = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const className = ["navbar", overlay ? "navbarOverlay" : "navbarSolid", scrolled && "navbarScrolled"].filter(Boolean).join(" ");

  return (
    <>
      <header className={className}>
        <div className="wrap navInner">
          <Link to="/" className="navBrand">Carlton Resort</Link>
          <nav className="navLinks">
            {links.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className="navActions">
            <button className="btn btnGhost" onClick={() => setIsModalOpen(true)}>Login</button>
            <Link to="/hotels" className="btn btnGold">Reserve</Link>
          </div>
        </div>
      </header>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
