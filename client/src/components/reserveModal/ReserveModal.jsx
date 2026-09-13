import { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmail } from "../../lib/validate";
import { postJson } from "../../lib/api";
import { todayIso } from "../../lib/search";
import "../authModal/authModal.css";
import "./reserveModal.css";

const emptyForm = { name: "", email: "", checkIn: "", checkOut: "", guests: 2 };

const ReserveModal = ({ isOpen, onClose, stay }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(""); // "", sending, sent
  const [reference, setReference] = useState(null);

  if (!isOpen) return null;

  const today = todayIso();

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !isEmail(form.email)) return setError("Please enter your name and a valid email address");
    if (!form.checkIn || !form.checkOut || form.checkOut <= form.checkIn) return setError("Check out must be after check in");
    setStatus("sending");
    try {
      const data = await postJson("/api/reservations", { ...form, guests: Number(form.guests), hotel: stay.slug });
      setReference(data.id);
      setStatus("sent");
    } catch (err) {
      setStatus("");
      setError(err.message);
    }
  };

  const close = () => {
    if (status === "sent") setForm(emptyForm);
    setStatus("");
    setError("");
    onClose();
  };

  const sent = status === "sent";

  return (
    <div className="modalOverlay" onClick={close}>
      <div className="modalContent reserveModal" onClick={(e) => e.stopPropagation()}>
        <button className="modalClose" onClick={close}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="modalHeader">
          <h2>{sent ? "Request received" : `Reserve ${stay.title}`}</h2>
          <p>
            {sent
              ? `Reference #${reference}. We will confirm availability by email at ${form.email}.`
              : "No payment now. We confirm availability by email."}
          </p>
        </div>

        {sent ? (
          <button className="submitBtn reserveDone" onClick={close}>Done</button>
        ) : (
          <form className="modalForm" onSubmit={submit} noValidate>
            <div className="formGroup">
              <input name="name" placeholder="Full name" value={form.name} onChange={update} />
            </div>
            <div className="formGroup">
              <input type="email" name="email" placeholder="Email address" value={form.email} onChange={update} />
            </div>
            <div className="reserveRow">
              <label>Check in
                <input type="date" name="checkIn" min={today} value={form.checkIn} onChange={update} />
              </label>
              <label>Check out
                <input type="date" name="checkOut" min={form.checkIn || today} value={form.checkOut} onChange={update} />
              </label>
              <label>Guests
                <input type="number" name="guests" min="1" max="10" value={form.guests} onChange={update} />
              </label>
            </div>
            {error && <span className="reserveError">{error}</span>}
            <button type="submit" className="submitBtn" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReserveModal;
