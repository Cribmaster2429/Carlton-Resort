import "./mailList.css";

const MailList = () => {
  return (
    <div className="mail">
      <h1 className="mailTitle">Save money, save reputation!!</h1>
      <span className="mailDesc">Sign up to receive seasonal emails with special offers and deals</span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Email address" />
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default MailList;