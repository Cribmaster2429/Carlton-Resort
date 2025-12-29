import { useState } from "react";
import { faXmark, faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./authModal.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual auth logic
    console.log(`${activeTab} submitted:`, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="modalClose" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="modalHeader">
          <h2>Welcome to Carlton Resort</h2>
          <p>Your Hawaiian paradise awaits</p>
        </div>

        <div className="modalTabs">
          <button
            className={`modalTab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`modalTab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          {activeTab === "register" && (
            <div className="formGroup">
              <FontAwesomeIcon icon={faUser} className="formIcon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="formGroup">
            <FontAwesomeIcon icon={faEnvelope} className="formIcon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="formGroup">
            <FontAwesomeIcon icon={faLock} className="formIcon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {activeTab === "register" && (
            <div className="formGroup">
              <FontAwesomeIcon icon={faLock} className="formIcon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {activeTab === "login" && (
            <div className="formOptions">
              <label className="rememberMe">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgotPassword">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="submitBtn">
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="modalFooter">
          {activeTab === "login" ? (
            <p>Don't have an account? <button onClick={() => setActiveTab("register")}>Register</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setActiveTab("login")}>Sign In</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
