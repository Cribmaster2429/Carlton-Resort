import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { differenceInCalendarDays } from "date-fns";
import { counters, defaultOptions, defaultDates, formatStayDate } from "../../lib/search";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./header.css";

// Home page hero plus the availability bar under it. Search carries dates and guests to /hotels.
const Header = () => {
  const navigate = useNavigate();
  const [openDate, setOpenDate] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);
  const [date, setDate] = useState(defaultDates);
  const [options, setOptions] = useState(defaultOptions);
  const [error, setError] = useState("");
  const [today] = useState(() => new Date());

  const toggle = (which) => {
    setOpenDate(which === "date" ? !openDate : false);
    setOpenGuests(which === "guests" ? !openGuests : false);
  };

  const handleOption = (name, delta) => setOptions((prev) => ({ ...prev, [name]: prev[name] + delta }));

  const handleSearch = () => {
    if (differenceInCalendarDays(date[0].endDate, date[0].startDate) < 1) {
      setError("Please choose a check out date after check in");
      return;
    }
    setError("");
    navigate("/hotels", { state: { date, options } });
  };

  const guests = `${options.adult} adult${options.adult === 1 ? "" : "s"}${options.children ? `, ${options.children} child${options.children === 1 ? "" : "ren"}` : ""}`;

  return (
    <>
      <section className="hero">
        <video className="heroVideo" autoPlay muted loop playsInline poster="/video/hero-poster.jpg">
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="wrap heroContent">
          <p className="eyebrow gold">Solmera Cay</p>
          <h1 className="heroTitle">The ocean sets the pace.</h1>
          <p className="heroDesc">A private stretch of white sand, forty suites and villas, and nothing you have to do.</p>
          <div className="heroActions">
            <a className="btn btnGold" href="#availability">Check availability</a>
            <a className="btn btnGhost" href="#stay">Explore the resort</a>
          </div>
        </div>
      </section>

      <div className="avail" id="availability">
        <div className="availBar">
          <button type="button" className="availItem" onClick={() => toggle("date")}>
            <small>Check in</small>
            <span>{formatStayDate(date[0].startDate)}</span>
          </button>
          <button type="button" className="availItem" onClick={() => toggle("date")}>
            <small>Check out</small>
            <span>{formatStayDate(date[0].endDate)}</span>
          </button>
          <button type="button" className="availItem" onClick={() => toggle("guests")}>
            <small>Guests</small>
            <span>{guests}</span>
          </button>
          <button type="button" className="availSearch" onClick={handleSearch}>Search</button>

          {openDate && (
            <DateRange
              editableDateInputs
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={date}
              minDate={today}
              className="availDates"
            />
          )}

          {openGuests && (
            <div className="availGuests">
              {counters.map((c) => (
                <div className="availCounter" key={c.name}>
                  <span>{c.label}</span>
                  <div>
                    <button type="button" disabled={options[c.name] <= c.min} onClick={() => handleOption(c.name, -1)}>−</button>
                    <b>{options[c.name]}</b>
                    <button type="button" onClick={() => handleOption(c.name, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <div className="availError">{error}</div>}
      </div>
    </>
  );
};

export default Header;
