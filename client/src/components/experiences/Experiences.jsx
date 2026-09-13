import Card from "../card/Card";

const activities = [
  { name: "Ocean Adventures", description: "Snorkelling, diving and sunset cruises", image: "/images/experiences/ocean-adventures.jpg" },
  { name: "Island Tours", description: "Guided hikes and the villages inland", image: "/images/experiences/island-tours.jpg" },
  { name: "Water Sports", description: "Surf, paddleboard, kayak", image: "/images/experiences/water-sports.jpg" },
];

const Experiences = () => (
  <section id="experiences" className="section">
    <div className="wrap">
      <p className="eyebrow">Experiences</p>
      <h2 className="sectionTitle">Days that fill themselves.</h2>
      <p className="lede spaced">A reef dive before breakfast, a boat out to the sandbar, or nothing at all. All three are on the menu.</p>
      <div className="grid grid3">
        {activities.map((a) => (
          <Card key={a.name} img={a.image} title={a.name} subtitle={a.description} wide />
        ))}
      </div>
    </div>
  </section>
);

export default Experiences;
