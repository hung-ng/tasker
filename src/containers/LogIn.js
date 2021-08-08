import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useAuth } from '../firebase/Auth';
import './login.css'

const LogIn = () => {
    const [error, setError] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const { login, currentUser } = useAuth()

    const history = useHistory();

    const loginController = (e) => {
        e.preventDefault();
        const dataLogin = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        if (dataLogin.email.trim() === "") {
            setError(prev => { return { ...prev, email: "Email is missing" } })
        }
        else {
            setError(prev => { return { ...prev, email: "" } })
        }

        if (dataLogin.password.trim() === "") {
            setError(prev => { return { ...prev, password: "Password is missing" } })
        }
        else {
            setError(prev => { return { ...prev, password: "" } })
        }

        if (dataLogin.email !== "" && dataLogin.password !== "") {
            loginModel(dataLogin.email.trim(), dataLogin.password.trim());
        }
    }

    const loginModel = async (email, password) => {
        try {
            setLoading(true)
            const response = await login(email, password);
            if (response.user.emailVerified === false) {
                alert("Your email is not verified");
                setLoading(false);
            }
            else {
                history.push("/groups")
            }
        }
        catch (err) {
            if (err.code === 'auth/user-not-found'
                || err.code === "auth/invalid-email"
            ) {
                setError(prev => { return { ...prev, email: "User not found" } })
            }
            else if (err.code === 'auth/wrong-password') {
                setError(prev => { return { ...prev, password: "Password is incorrect" } })
            }
            setLoading(false)
        }
    }

    if (currentUser) {
        return <Redirect to="/groups" />
    }

    return (
        <div className="login-container">
            <div className="aside">
                <div className="header">
                    <h1>Tasker</h1>
                </div>
                <form id="login-form" onSubmit={loginController}>
                    <div className="input-wrapper">
                        <input type="email" name="email" placeholder="Email" />
                        <div className="error">{error.email}</div>
                    </div>
                    <div className="input-wrapper">
                        <input type="password" name="password" placeholder="Password" />
                        <div className="error">{error.password}</div>
                    </div>
                    <button className="btn btn-primary" disabled={loading} type="submit">
                        Login
                    </button>
                    <Link to="/forgotpassword" id="forgotPassword" className="cursor-pointer" >Forgot password?</Link>
                    <div className="form-action">
                        <Link to="/signup" className="cursor-pointer" >Don't have an account? Register</Link>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default LogIn;