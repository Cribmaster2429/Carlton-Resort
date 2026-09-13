import "./card.css";

// The one card used by every section: photo, dark fade, serif title, one line under it.
const Card = ({ img, title, subtitle, onClick, wide = false }) => {
  const clickable = typeof onClick === "function";

  const onKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    onClick();
  };

  return (
    <div
      className={["card", wide && "cardWide", clickable && "cardClickable"].filter(Boolean).join(" ")}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? onKeyDown : undefined}
    >
      <img src={img} alt={title} className="cardImg" loading="lazy" decoding="async" />
      <div className="cardText">
        <h3>{title}</h3>
        <small>{subtitle}</small>
      </div>
    </div>
  );
};

export default Card;
