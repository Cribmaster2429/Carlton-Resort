import "./experiences.css";

const Experiences = () => {
  const activities = [
    {
      id: 1,
      name: "Ocean Adventures",
      description: "Snorkeling, diving, and sunset cruises",
      image: "/images/experiences/ocean-adventures.jpg"
    },
    {
      id: 2,
      name: "Island Tours",
      description: "Guided hikes and cultural excursions",
      image: "/images/experiences/island-tours.jpg"
    },
    {
      id: 3,
      name: "Water Sports",
      description: "Surfing, paddleboarding, and kayaking",
      image: "/images/experiences/water-sports.jpg"
    }
  ];

  return (
    <section id="experiences" className="experiencesSection">
      <h1 className="experiencesTitle">Unforgettable Experiences</h1>
      <p className="experiencesDesc">
        Create lasting memories with our curated activities and island adventures.
      </p>
      <div className="experiencesGrid">
        {activities.map((activity) => (
          <div key={activity.id} className="experiencesCard">
            <img src={activity.image} alt={activity.name} className="experiencesCardImg" />
            <div className="experiencesCardContent">
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experiences;
