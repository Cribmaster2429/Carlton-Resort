import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import ReserveModal from "../../components/reserveModal/ReserveModal";
import { findStay } from "../../components/stay/Stay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

// Gallery shown for every stay until each has its own set. Thumbnails are the 480px copies in images/thumbs.
const photos = [
  "/images/property/rooms.jpg",
  "/images/suites/ocean-breeze-suite.jpg",
  "/images/suites/marina-suite.jpg",
  "/images/suites/coral-garden-villa.jpg",
  "/images/suites/sunrise-beach-suite.jpg",
  "/images/property/villas.jpg",
];
const thumb = (src) => `/images/thumbs/${src.split("/").pop()}`;

const Hotel = () => {
  const { id } = useParams();
  const stay = findStay(id);
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  if (!stay) return <Navigate to="/hotels" replace />;

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    setSlideNumber((slideNumber + (direction === "l" ? -1 : 1) + photos.length) % photos.length);
  };

  return (
    <div>
      <Navbar />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon icon={faCircleXmark} className="close" onClick={() => setOpen(false)} />
            <FontAwesomeIcon icon={faCircleArrowLeft} className="arrow" onClick={() => handleMove("l")} />
            <div className="sliderWrapper">
              <img src={photos[slideNumber]} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon icon={faCircleArrowRight} className="arrow" onClick={() => handleMove("r")} />
          </div>
        )}

        <div className="hotelWrapper">
          <button className="bookNow" onClick={() => setReserveOpen(true)}>Reserve or book now</button>
          <h1 className="hotelTitle">{stay.title}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>North Shore, Solmera Cay</span>
          </div>
          <span className="hotelDistance">{stay.blurb}</span>
          <span className="hotelPriceHighlight">Stays of three nights or more include the airport transfer</span>
          <div className="hotelImages">
            {photos.map((src, i) => (
              <div className="hotelImgWrapper" key={src}>
                <img onClick={() => handleOpen(i)} src={thumb(src)} alt="" className="hotelImg" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>

          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">{stay.features}</h1>
              <p className="hotelDesc">
                Every room faces the water. The only decision is how much of it you want to yourself.
                {" "}{stay.blurb}. Breakfast until whenever you wake up, and the beach is at the door.
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>From ${stay.price} a night</h1>
              <span>Guests rate this stay {stay.rating}, {stay.label.toLowerCase()}.</span>
              <h2>
                <b>${stay.price * 3}</b> for three nights
              </h2>
              <button onClick={() => setReserveOpen(true)}>Reserve or book now</button>
            </div>
          </div>
        </div>
        <ReserveModal isOpen={reserveOpen} onClose={() => setReserveOpen(false)} stay={stay} />
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
