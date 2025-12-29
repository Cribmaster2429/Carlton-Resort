import { faBed, faCalendarDays, faPerson, faUmbrellaBeach, faUtensils, faSpa, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from 'react-date-range';
import { useState } from "react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {format} from "date-fns";
import { useNavigate, Link } from "react-router-dom";

const Header = ({type}) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1
  });
  const [searchError, setSearchError] = useState("");

  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setOptions(prev=>{return {
      ...prev, [name]: operation === "i" ? options[name] + 1 : options[name] -1
    }})
  }

  const handleSearch = () => {
    // Validate destination
    if (!destination.trim()) {
      setSearchError("Please enter a destination");
      return;
    }

    // Validate date range (check if end date is after start date)
    if (date[0].startDate.getTime() === date[0].endDate.getTime()) {
      setSearchError("Please select a check-out date");
      return;
    }

    // Clear any previous error and navigate
    setSearchError("");
    navigate("/hotels", { state: {destination, date, options}});
  }

  return (
    <div className="header">
      <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>

        <nav className="headerNav">
          <Link to="/hotels" className="headerNavItem active">
            <FontAwesomeIcon icon={faBed} />
            <span>Accommodations</span>
          </Link>
          <a href="/#dining" className="headerNavItem">
            <FontAwesomeIcon icon={faUtensils} />
            <span>Dining</span>
          </a>
          <a href="/#experiences" className="headerNavItem">
            <FontAwesomeIcon icon={faUmbrellaBeach} />
            <span>Experiences</span>
          </a>
          <a href="/#spa" className="headerNavItem">
            <FontAwesomeIcon icon={faSpa} />
            <span>Spa & Wellness</span>
          </a>
          <a href="/#events" className="headerNavItem">
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Events</span>
          </a>
        </nav>

        { type !== "list" &&
          <>
          <h1 className="headerTitle">Luxury at its finest - Pamper yourself with the royal treatment</h1>
          <p className="headerDesc">Soak up the Hawaiian culture... It's all here waiting for you!!</p>

        <div className="headerSearch">
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faBed} className="headerIcon" />
            <input type="text" placeholder="What is your destination?"
            onChange={e=>setDestination(e.target.value)} className="headerSearchInput" />
          </div>

          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <span onClick={()=>setOpenDate(!openDate)} className="headerSearchText">{`${format(date[0].startDate, "dd-MM-yyyy")}
             to ${format(date[0].endDate, "dd-MM-yyyy")}`}</span>
            {openDate && <DateRange editableDateInputs={true} onChange={item => setDate([item.selection])}
            moveRangeOnFirstSelection={false} ranges={date} className="date" minDate={new Date()}/>}
          </div>

          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faPerson} className="headerIcon" />
            <span onClick={()=>setOpenOptions(!openOptions)} className="headerSearchText">{`${options.adult} adult . ${options.children} children . 
            ${options.room} room`}</span>
            { openOptions && <div className="options">
              <div className="optionItem">
                <span className="optionText">Adult</span>
                <div className="optionCounter">
                  <button disabled={options.adult <= 1} className="optionCounterButton" onClick={()=>handleOption("adult", "d")}>-</button>
                  <span className="optionCounterNumber">{options.adult}</span>
                  <button className="optionCounterButton" onClick={()=>handleOption("adult", "i")}>+</button>
                </div>
              </div>

              <div className="optionItem">
                <span className="optionText">Children</span>
                <div className="optionCounter">
                  <button disabled={options.children <= 0} className="optionCounterButton" onClick={()=>handleOption("children", "d")}>-</button>
                  <span className="optionCounterNumber">{options.children}</span>
                  <button className="optionCounterButton" onClick={()=>handleOption("children", "i")}>+</button>
                </div>
              </div>

              <div className="optionItem">
                <span className="optionText">Room</span>
                <div className="optionCounter">
                  <button disabled={options.room <= 1} className="optionCounterButton" onClick={()=>handleOption("room", "d")}>-</button>
                  <span className="optionCounterNumber">{options.room}</span>
                  <button className="optionCounterButton" onClick={()=>handleOption("room", "i")}>+</button>
                </div>
              </div>

            </div>}
          </div>

          <div className="headerSearchItem">
          <button className="headerBtn" onClick={handleSearch}>Search</button>
          </div>
        </div>
        {searchError && <div className="searchError">{searchError}</div>}
        </>}
      </div>
    </div>
  )
}

export default Header;