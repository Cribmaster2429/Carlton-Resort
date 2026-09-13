import "./statement.css";

// One full bleed photo and one sentence. Lets the page breathe between sections.
const Statement = () => (
  <section className="statement">
    <img src="/images/resort/infinity-pool.jpg" alt="" loading="lazy" decoding="async" />
    <div className="wrap statementText">
      <blockquote>Nobody comes here to do things. They come here to stop.</blockquote>
      <cite>From a guest, March</cite>
    </div>
  </section>
);

export default Statement;
