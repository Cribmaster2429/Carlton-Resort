import { useState } from "react";
import { isEmail } from "../../lib/validate";
import { postJson } from "../../lib/api";
import "./mailList.css";

const MailList = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "", sending, done, already
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Please enter a valid email address");
    setStatus("sending");
    try {
      const { already } = await postJson("/api/subscribe", { email });
      setStatus(already ? "already" : "done");
    } catch (err) {
      setStatus("");
      setError(err.message);
    }
  };

  return (
    <section className="mail">
      <div className="wrap">
        <h2 className="sectionTitle">A few emails a year.</h2>
        <p className="mailDesc">Offers first, then the occasional note about what is new. Nothing weekly, nothing shouting.</p>
        {status === "done" ? (
          <p className="mailSuccess">You are on the list. A welcome note is on its way to {email}.</p>
        ) : status === "already" ? (
          <p className="mailSuccess">{email} is already on the list. Nothing more to do.</p>
        ) : (
          <form className="mailForm" onSubmit={handleSubscribe} noValidate>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Subscribe"}
            </button>
          </form>
        )}
        {error && <span className="mailError">{error}</span>}
      </div>
    </section>
  );
};

export default MailList;
