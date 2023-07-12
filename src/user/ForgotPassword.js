import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../authentication/AuthProvider";
import "./forgotpassword.css";

const ForgotPassword = () => {
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const { resetPassword } = useAuth();

  const formController = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email.trim() === "") {
      setError("Please input your email");
    } else {
      setError("");
    }

    if (email.trim() !== "") {
      formModel(email.trim());
    }
  };

  const formModel = async (email) => {
    try {
      setLoading(true);
      await resetPassword(email);
      alert("Verification email has been sent! Please check your mail box.");
      history.push("/login");
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="forgotPassword-container">
      <div className="aside">
        <div className="header">
          <h1>Forgot Password?</h1>
        </div>
        <form id="forgotPassword-form" onSubmit={formController}>
          <div className="input-wrapper">
            <input type="email" name="email" placeholder="Input your email" />
            <div className="error">{error}</div>
          </div>
          <button disabled={loading} className="btn btn-primary" type="submit">
            Send Verification Email
          </button>
          <Link to="/login" id="cancel" className="cursor-pointer">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
