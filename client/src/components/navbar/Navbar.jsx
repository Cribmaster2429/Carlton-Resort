import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "../authModal/AuthModal";
import "./navbar.css";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="navbar">
        <div className="navContainer">
          <Link to="/" className="logo">Carlton Resort</Link>
          <div className="navItems">
            <button
              className="navButton navButtonOutline"
              onClick={() => setIsModalOpen(true)}
            >
              Login
            </button>
            <Link to="/hotels" className="navButton navButtonBook">Book Now</Link>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default Navbar;
