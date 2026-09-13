import "./dining.css";

const Dining = () => {
  const restaurants = [
    {
      id: 1,
      name: "Coral Restaurant",
      description: "Award-winning fine dining with Pacific Rim cuisine",
      image: "/images/dining/fine-dining.jpg"
    },
    {
      id: 2,
      name: "Sunset Beach Bar",
      description: "Casual dining and tropical cocktails by the shore",
      image: "/images/dining/beach-bar.jpg"
    },
    {
      id: 3,
      name: "Morning Tides Cafe",
      description: "Farm-to-table breakfast with ocean views",
      image: "/images/dining/breakfast-cafe.jpg"
    }
  ];

  return (
    <section id="dining" className="diningSection">
      <h1 className="diningTitle">Exquisite Dining Experiences</h1>
      <p className="diningDesc">
        Savor world-class cuisine at our resort restaurants, from oceanfront fine dining to casual beachside grills.
      </p>
      <div className="diningGrid">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="diningCard">
            <img src={restaurant.image} alt={restaurant.name} className="diningCardImg" />
            <div className="diningCardContent">
              <h3>{restaurant.name}</h3>
              <p>{restaurant.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dining;
