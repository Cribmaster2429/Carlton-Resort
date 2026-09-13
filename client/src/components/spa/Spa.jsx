import "./spa.css";

const Spa = () => {
  const services = [
    {
      id: 1,
      name: "Signature Treatments",
      description: "Traditional Hawaiian healing therapies",
      image: "/images/spa/massage.jpg"
    },
    {
      id: 2,
      name: "Yoga & Meditation",
      description: "Oceanfront sessions at sunrise and sunset",
      image: "/images/spa/yoga.jpg"
    },
    {
      id: 3,
      name: "Fitness Center",
      description: "State-of-the-art equipment and personal training",
      image: "/images/spa/fitness.jpg"
    }
  ];

  return (
    <section id="spa" className="spaSection">
      <h1 className="spaTitle">Spa & Wellness</h1>
      <p className="spaDesc">
        Rejuvenate your body and mind at our world-class wellness center.
      </p>
      <div className="spaGrid">
        {services.map((service) => (
          <div key={service.id} className="spaCard">
            <img src={service.image} alt={service.name} className="spaCardImg" />
            <div className="spaCardContent">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Spa;
