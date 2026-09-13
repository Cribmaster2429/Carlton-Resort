import "./events.css";

const Events = () => {
  const eventTypes = [
    {
      id: 1,
      name: "Weddings",
      description: "Beachfront ceremonies and elegant receptions",
      image: "/images/events/wedding.jpg"
    },
    {
      id: 2,
      name: "Meetings & Conferences",
      description: "Modern facilities with inspiring ocean views",
      image: "/images/events/conference.jpg"
    },
    {
      id: 3,
      name: "Private Events",
      description: "Birthdays, anniversaries, and special occasions",
      image: "/images/events/celebration.jpg"
    }
  ];

  return (
    <section id="events" className="eventsSection">
      <h1 className="eventsTitle">Events & Celebrations</h1>
      <p className="eventsDesc">
        From dream weddings to corporate retreats, we create extraordinary moments.
      </p>
      <div className="eventsGrid">
        {eventTypes.map((event) => (
          <div key={event.id} className="eventsCard">
            <img src={event.image} alt={event.name} className="eventsCardImg" />
            <div className="eventsCardContent">
              <h3>{event.name}</h3>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;
