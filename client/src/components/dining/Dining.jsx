import Card from "../card/Card";

const restaurants = [
  { name: "Coral", description: "Fine dining, seven courses, over the water", image: "/images/dining/fine-dining.jpg" },
  { name: "Sunset Bar", description: "Cocktails, grills, feet in the sand", image: "/images/dining/beach-bar.jpg" },
  { name: "Morning Tides", description: "Breakfast until whenever you wake up", image: "/images/dining/breakfast-cafe.jpg" },
];

const Dining = () => (
  <section id="dine" className="section">
    <div className="wrap">
      <p className="eyebrow">Dine</p>
      <h2 className="sectionTitle">Three kitchens. One coastline.</h2>
      <p className="lede spaced">Caught this morning, cooked tonight. Dress code is sand on your feet.</p>
      <div className="grid grid3">
        {restaurants.map((r) => (
          <Card key={r.name} img={r.image} title={r.name} subtitle={r.description} wide />
        ))}
      </div>
    </div>
  </section>
);

export default Dining;
