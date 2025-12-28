import "./propertyList.css";

const PropertyList = () => {
  return (
    <div className="pList">
      <div className="pListItem">
        <img src="https://www.travellersbeach.com/assets/images/activities/1556895696-TheClubBar.jpg"
         alt="" className="pListImg" />
        <div className="pListTitles">
          <h1>Rooms</h1>
          <h2>153 hotels</h2>
        </div>
      </div>

      <div className="pListItem">
        <img src="https://www.travellersbeach.com/assets/images/activities/1556895696-TheClubBar.jpg"
         alt="" className="pListImg" />
        <div className="pListTitles">
          <h1>Cabins</h1>
          <h2>234 hotels</h2>
        </div>
      </div>

      <div className="pListItem">
        <img src="https://www.travellersbeach.com/assets/images/activities/1556895696-TheClubBar.jpg"
         alt="" className="pListImg" />
        <div className="pListTitles">
          <h1>Apartments</h1>
          <h2>456 hotels</h2>
        </div>
      </div>

      <div className="pListItem">
        <img src="https://www.travellersbeach.com/assets/images/activities/1556895696-TheClubBar.jpg"
         alt="" className="pListImg" />
        <div className="pListTitles">
          <h1>Villas</h1>
          <h2>456 hotels</h2>
        </div>
      </div>

    </div>
  )
}

export default PropertyList;