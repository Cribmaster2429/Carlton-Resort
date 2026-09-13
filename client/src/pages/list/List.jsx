import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import SearchItem from "../../components/searchItem/SearchItem";
import { stays } from "../../components/stay/Stay";
import { counters, defaultOptions, defaultDates, formatStayDate, clampOption } from "../../lib/search";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [type, setType] = useState(location.state?.type || "");
  const [date, setDate] = useState(() => location.state?.date || defaultDates());
  const [options, setOptions] = useState(location.state?.options || defaultOptions);
  const [openDate, setOpenDate] = useState(false);
  const [today] = useState(() => new Date());

  // Footer and navbar links land on this route while it is already mounted, so resync from route state.
  useEffect(() => {
    setType(location.state?.type || "");
    if (location.state?.date) setDate(location.state.date);
    if (location.state?.options) setOptions(location.state.options);
  }, [location.state]);

  const appliedType = location.state?.type || "";
  const results = stays.filter((stay) => !appliedType || stay.title === appliedType);

  const handleSearch = () => {
    setOpenDate(false);
    navigate("/hotels", { state: { type, date, options }, replace: true });
  };

  return (
    <div>
      <Navbar />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>

            <div className="lsItem">
              <label>Stay</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Any</option>
                {stays.map((stay) => (
                  <option key={stay.slug}>{stay.title}</option>
                ))}
              </select>
            </div>

            <div className="lsItem">
              <label>Dates</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${formatStayDate(date[0].startDate)} to ${formatStayDate(date[0].endDate)}`}
              </span>
              {openDate && <DateRange onChange={(item) => setDate([item.selection])} minDate={today} ranges={date} />}
            </div>

            <div className="lsItem">
              <label>Guests</label>
              <div className="lsOptions">
                {counters.map((c) => (
                  <div className="lsOptionItem" key={c.name}>
                    <span className="lsOptionText">{c.label}</span>
                    <input
                      type="number"
                      min={c.min}
                      className="lsOptionInput"
                      value={options[c.name]}
                      onChange={(e) => setOptions({ ...options, [c.name]: clampOption(c.name, e.target.value) })}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="listResult">
            <h2 className="listResultTitle">{appliedType || "All stays"}</h2>
            {results.map((stay) => (
              <SearchItem key={stay.slug} stay={stay} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
