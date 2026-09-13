import { useNavigate } from "react-router-dom";
import Card from "../card/Card";

// The four stay types. Slugs are mirrored in server/src/stays.js, keep them in sync.
// Sources for every photo are listed in public/images/CREDITS.md.
export const stays = [
  {
    slug: "ocean-rooms",
    title: "Ocean Rooms",
    price: 240,
    rating: "9.2",
    label: "Wonderful",
    blurb: "King bed and a balcony over the water",
    features: "45 m² · balcony · rain shower",
    img: "/images/property/rooms.jpg",
  },
  {
    slug: "beach-suites",
    title: "Beach Suites",
    price: 380,
    rating: "9.4",
    label: "Exceptional",
    blurb: "Steps from the sand, with a daybed on the terrace",
    features: "70 m² · terrace · outdoor shower",
    img: "/images/suites/sunrise-beach-suite.jpg",
  },
  {
    slug: "garden-villas",
    title: "Garden Villas",
    price: 520,
    rating: "9.5",
    label: "Exceptional",
    blurb: "A private lap pool inside a walled garden",
    features: "110 m² · private pool · garden",
    img: "/images/suites/coral-garden-villa.jpg",
  },
  {
    slug: "pool-villas",
    title: "Pool Villas",
    price: 890,
    rating: "9.7",
    label: "Exceptional",
    blurb: "Infinity pool, two bedrooms and the whole horizon",
    features: "180 m² · infinity pool · 2 bedrooms",
    img: "/images/property/villas.jpg",
  },
];

export const findStay = (slug) => stays.find((stay) => stay.slug === slug);

const Stay = () => {
  const navigate = useNavigate();

  return (
    <section id="stay" className="section">
      <div className="wrap">
        <p className="eyebrow">Stay</p>
        <h2 className="sectionTitle">Four ways to wake up here.</h2>
        <p className="lede spaced">Every room faces the water. The only decision is how much of it you want to yourself.</p>
        <div className="grid grid4">
          {stays.map((stay) => (
            <Card
              key={stay.slug}
              img={stay.img}
              title={stay.title}
              subtitle={`From $${stay.price} a night`}
              onClick={() => navigate("/hotels", { state: { type: stay.title } })}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stay;
