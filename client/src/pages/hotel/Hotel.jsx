import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Hotel = () => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const photos = [
    {
      src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/b8/41/da/southern-palms-beach.jpg?w=1200&h=-1&s=1",
    },
    {
      src: "https://s7d2.scene7.com/is/image/ritzcarlton/RCDORAD_00109_conversion?$XlargeViewport100pct$",
    },
    {
      src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/6f/9e/60/southern-palms-beach.jpg?w=1200&h=-1&s=1",
    },
    {
      src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/6f/9d/d3/southern-palms-beach.jpg?w=1200&h=-1&s=1",
    },
    {
      src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/6f/9d/80/southern-palms-beach.jpg?w=1200&h=-1&s=1",
    },
    {
      src: "https://s7d2.scene7.com/is/image/ritzcarlton/RCDORAD_00222_conversion?$XlargeViewport100pct$"
    },
  ];

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if(direction==="l"){
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber-1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber+1;

    }

    setSlideNumber(newSlideNumber);

  }

  return (
    <div>
      <Navbar/>
      <Header type="list"/>
      <div className="hotelContainer">
        {open && <div className="slider">
          <FontAwesomeIcon icon={faCircleXmark} className="close" onClick={()=>setOpen(false)}/>
          <FontAwesomeIcon icon={faCircleArrowLeft} className="arrow" onClick={()=>handleMove("l")}/>
          <div className="sliderWrapper">
            <img src={photos[slideNumber].src} alt="" className="sliderImg" />
          </div>
          <FontAwesomeIcon icon={faCircleArrowRight} className="arrow" onClick={()=>handleMove("r")}/>
        </div>}

        <div className="hotelWrapper">
          <button className="bookNow">Reserve or book now</button>
          <h1 className="hotelTitle">Grand Beach Hotel</h1>
          <div className="hotelAdress">
            <FontAwesomeIcon icon={faLocationDot}/>
            <span>Kilifi Mindiani</span>
          </div>
          <span className="hotelDistance">Excellent Location - 500m from center</span>
          <span className="hotelPriceHighlight">
            Book a stay over $114 at this property and get a free airport taxi
          </span>
          <div className="hotelImages">
            {photos.map((photo,i)=>(
              <div className="hotelImgWrapper">
                <img onClick={()=>handleOpen(i)} src={photo.src} alt="" className="hotelImg" />
              </div>
            ))}
          </div>

          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Breath taking beach retreats</h1>
              <p className="hotelDesc">
                Discover the perfect beachfront escape at The Ritz-Carlton, where distinctive
                resort experiences reflect the world’s most desirable destinations. From secluded 
                honeymoon retreats to family-friendly destinations, there are endless ways to find your place in the sun.
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a fortnight stay!!</h1>
              <span>
                Located across the shores of the Indian Ocean, this property has an excellent location score of 9.8
              </span>
              <h2>
                <b>$945</b> (Fortnight)
              </h2>
              <button>Reserve or book now</button>
            </div>
          </div>
        </div>
        <MailList/>
        <Footer/>
      </div>
    </div>
  )
};

export default Hotel;
