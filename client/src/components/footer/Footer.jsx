import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { stays } from "../stay/Stay";
import "./footer.css";

const explore = [
  { label: "Dining", href: "/#dine" },
  { label: "Experiences", href: "/#experiences" },
  { label: "Spa and wellness", href: "/#spa" },
  { label: "Events", href: "/#events" },
];

const Footer = () => (
  <footer className="footer">
    <div className="wrap footerInner">
      <div>
        <Link to="/" className="footerBrand">Carlton Resort</Link>
        <p className="footerTagline">White sand, warm water and the royal treatment, all year round.</p>
      </div>

      <div className="footerCol">
        <h4>Explore</h4>
        {explore.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </div>

      <div className="footerCol">
        <h4>Stay</h4>
        {stays.map((stay) => (
          <Link key={stay.title} to="/hotels" state={{ type: stay.title }}>{stay.title}</Link>
        ))}
        <Link to="/hotels">All stays</Link>
      </div>

      <div className="footerCol">
        <h4>Contact</h4>
        <span><FontAwesomeIcon icon={faLocationDot} /> North Shore, Solmera Cay</span>
        <a href="tel:+15550100100"><FontAwesomeIcon icon={faPhone} /> +1 (555) 010 0100</a>
        <a href="mailto:reservations@solmeracay.com"><FontAwesomeIcon icon={faEnvelope} /> reservations@solmeracay.com</a>
      </div>
    </div>

    <div className="footerBottom">
      <div className="wrap">© {new Date().getFullYear()} Carlton Resort. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer;
