import Card from "../card/Card";

const events = [
  { name: "Weddings", description: "Up to 120 guests on the sand", image: "/images/events/wedding.jpg" },
  { name: "Meetings", description: "Three rooms, all facing the water", image: "/images/events/conference.jpg" },
  { name: "Celebrations", description: "Private dinners and long nights", image: "/images/events/celebration.jpg" },
];

const Events = () => (
  <section id="events" className="section">
    <div className="wrap">
      <p className="eyebrow">Events</p>
      <h2 className="sectionTitle">Say it by the sea.</h2>
      <p className="lede spaced">Weddings on the beach, boardrooms with a view, and birthdays that run late.</p>
      <div className="grid grid3">
        {events.map((e) => (
          <Card key={e.name} img={e.image} title={e.name} subtitle={e.description} wide />
        ))}
      </div>
    </div>
  </section>
);

export default Events;
