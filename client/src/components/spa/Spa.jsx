import "./spa.css";

const Spa = () => (
  <section id="spa" className="section spaSection">
    <div className="wrap spaSplit">
      <img src="/images/spa/bath-ocean-view.jpg" alt="Bath with a view of the sea" className="spaImage" loading="lazy" decoding="async" />
      <div>
        <p className="eyebrow">Spa and wellness</p>
        <h2 className="sectionTitle">Slow is the whole point.</h2>
        <p className="lede">Open air treatment rooms, a saltwater pool, and yoga on the sand at sunrise for anyone who is up. Nobody checks.</p>
      </div>
    </div>
  </section>
);

export default Spa;
