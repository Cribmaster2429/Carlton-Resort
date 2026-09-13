import { useNavigate } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ stay }) => {
  const navigate = useNavigate();

  return (
    <div className="searchItem">
      <img src={stay.img} alt={stay.title} className="siImg" loading="lazy" decoding="async" />
      <div className="siDesc">
        <h1 className="siTitle">{stay.title}</h1>
        <span className="siSubtitle">{stay.blurb}</span>
        <span className="siFeatures">{stay.features}</span>
        <span className="siCancelOp">Free cancellation</span>
        <span className="siCancelOpSubtitle">Cancel up to 48 hours before check in.</span>
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span>{stay.label}</span>
          <button>{stay.rating}</button>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">${stay.price}</span>
          <span className="siTaxOp">per night, taxes included</span>
          <button className="siCheckButton" onClick={() => navigate(`/hotels/${stay.slug}`)}>See availability</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
