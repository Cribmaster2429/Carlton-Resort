/**
 * A modal (popup) component that handles user authentication.
 * It provides two forms: Login and Register, which users can switch between using tabs.
 *
 * PROPS (inputs from parent component):
 * - isOpen: boolean - controls whether the modal is visible
 * - onClose: function - called when user wants to close the modal
 */

import { useState } from "react";
import { faXmark, faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./authModal.css";


/* ============================================
   MAIN COMPONENT
   ============================================ */

const AuthModal = ({ isOpen, onClose }) => {

  /* ------------------------------------------
     STATE VARIABLES
     useState() creates variables that, when changed, causes the component to re-render (update on screen)
     ------------------------------------------ */

  // Tracks which tab is active: "login" or "register"
  const [activeTab, setActiveTab] = useState("login");

  // Stores all the form input values in one object
  // This is called a "controlled form" - React controls the input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });


  /* ------------------------------------------
     EVENT HANDLER FUNCTIONS
     These functions run when the user interacts with the form (typing, clicking, etc.)
     ------------------------------------------ */

  /**
   * handleInputChange
   *
   * Called every time the user types in any input field.
   * Updates the formData state with the new value.
   *
   * HOW IT WORKS:
   * - e.target.name = the "name" attribute of the input (e.g., "email")
   * - e.target.value = what the user typed
   * - ...formData = keeps all existing values (spread operator)
   * - [e.target.name]: e.target.value = updates only the changed field
   */
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * handleSubmit
   *
   * Called when the user clicks the submit button.
   *
   * e.preventDefault() stops the form from refreshing the page
   * (default HTML form behavior that we don't want in React)
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual auth logic
    console.log(`${activeTab} submitted:`, formData);
    onClose();
  };


  /* ------------------------------------------
     EARLY RETURN (Conditional Rendering)
     If the modal shouldn't be shown, return nothing.
     This prevents the modal HTML from being added to the page.
     ------------------------------------------ */

  if (!isOpen) return null;


  /* ------------------------------------------
     COMPONENT RENDER (JSX)
     Everything below is what gets displayed on screen
     ------------------------------------------ */

  return (
    // OVERLAY: The dark background behind the modal
    // Clicking it calls onClose to dismiss the modal
    <div className="modalOverlay" onClick={onClose}>

      {/* MODAL CONTENT: The white box containing the form
          e.stopPropagation() prevents clicks inside from
          bubbling up to the overlay (which would close it) */}
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>

        {/* CLOSE BUTTON: X icon in the corner */}
        <button className="modalClose" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>


        {/* ====== HEADER SECTION ====== */}
        <div className="modalHeader">
          <h2>Welcome to Carlton Resort</h2>
          <p>Your Hawaiian paradise awaits</p>
        </div>


        {/* ====== TAB BUTTONS ======
            Switches between Login and Register forms
            The "active" class is added to style the selected tab */}
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


        {/* ====== THE FORM ====== */}
        <form className="modalForm" onSubmit={handleSubmit}>

          {/* NAME FIELD - Only shown for registration
              The && operator means: if left side is true, render right side */}
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

          {/* EMAIL FIELD - Shown for both login and register */}
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

          {/* PASSWORD FIELD - Shown for both login and register */}
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

          {/* CONFIRM PASSWORD FIELD - Only shown for registration */}
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

          {/* LOGIN OPTIONS - Only shown on login tab
              Contains "Remember me" checkbox and "Forgot password" link */}
          {activeTab === "login" && (
            <div className="formOptions">
              <label className="rememberMe">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgotPassword">Forgot password?</a>
            </div>
          )}

          {/* SUBMIT BUTTON - Text changes based on active tab
              Uses ternary operator: condition ? ifTrue : ifFalse */}
          <button type="submit" className="submitBtn">
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>


        {/* ====== FOOTER SECTION ======
            Shows link to switch between login/register */}
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
