import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../authentication/AuthProvider";
import { auth, db } from "../authentication/config";
import "./signup.css";

const SignUp = () => {
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

  const history = useHistory();

  const signupController = (e) => {
    e.preventDefault();
    const dataSignup = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };
    if (dataSignup.firstName.trim() === "") {
      setError((prev) => {
        return { ...prev, firstName: "First Name must be filled" };
      });
    } else {
      setError((prev) => {
        return { ...prev, firstName: "" };
      });
    }

    if (dataSignup.lastName.trim() === "") {
      setError((prev) => {
        return { ...prev, lastName: "Last Name must be filled" };
      });
    } else {
      setError((prev) => {
        return { ...prev, lastName: "" };
      });
    }

    if (dataSignup.email.trim() === "") {
      setError((prev) => {
        return { ...prev, email: "Email must be filled" };
      });
    } else {
      setError((prev) => {
        return { ...prev, email: "" };
      });
    }

    if (dataSignup.password.trim() === "") {
      setError((prev) => {
        return { ...prev, password: "Password is needed" };
      });
    } else {
      setError((prev) => {
        return { ...prev, password: "" };
      });
    }

    if (dataSignup.password.trim().length < 6) {
      setError((prev) => {
        return { ...prev, password: "Password must has at least 6 characters" };
      });
    } else {
      setError((prev) => {
        return { ...prev, password: "" };
      });
    }

    if (dataSignup.confirmPassword.trim() === "") {
      setError((prev) => {
        return { ...prev, confirmPassword: "Please confirm your password" };
      });
    } else if (
      dataSignup.confirmPassword.trim() !== dataSignup.password.trim()
    ) {
      setError((prev) => {
        return { ...prev, confirmPassword: "Password does not match" };
      });
    } else {
      setError((prev) => {
        return { ...prev, confirmPassword: "" };
      });
    }

    if (
      dataSignup.firstName !== "" &&
      dataSignup.lastName !== "" &&
      dataSignup.email !== "" &&
      dataSignup.password !== "" &&
      dataSignup.confirmPassword !== "" &&
      dataSignup.password === dataSignup.confirmPassword &&
      dataSignup.password.trim().length >= 6
    ) {
      signupModel(dataSignup);
    }
  };

  const signupModel = async (data) => {
    try {
      setLoading(true);
      await signup(data.email.trim(), data.password.trim());

      await db.collection("users").doc(data.email).set({
        groups_id: [],
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        notifications: [],
        unseen_notifications: false,
      });

      auth.currentUser.updateProfile({
        displayName: data.lastName.trim() + " " + data.firstName.trim(),
      });

      auth.currentUser.sendEmailVerification();

      alert("Your email has been registered, please check your email");

      history.push("/login");
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="aside">
        <div className="header">
          <h1>Tasker</h1>
        </div>
        <form id="register-form" onSubmit={signupController}>
          <div className="input-name-wrapper">
            <div className="input-wrapper">
              <input type="text" name="firstName" placeholder="First name" />
              <div className="error" id="first-name-error">
                {error.firstName}
              </div>
            </div>
            <div className="input-wrapper">
              <input type="text" name="lastName" placeholder="Last name" />
              <div className="error" id="last-name-error">
                {error.lastName}
              </div>
            </div>
          </div>
          <div className="input-wrapper">
            <input type="email" name="email" placeholder="Email" />
            <div className="error" id="email-error">
              {error.email}
            </div>
          </div>
          <div className="input-wrapper">
            <input type="password" name="password" placeholder="Password" />
            <div className="error" id="password-error">
              {error.password}
            </div>
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
            />
            <div className="error" id="confirm-password-error">
              {error.confirmPassword}
            </div>
          </div>
          <button disabled={loading} className="btn btn-primary" type="submit">
            Register
          </button>
          <div class="form-action">
            <Link to="/login" className="cursor-pointer">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
