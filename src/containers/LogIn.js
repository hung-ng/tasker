import React, { useState } from 'react';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../firebase/Auth';
import './login.css'

const LogIn = () => {
    const [error, setError] = useState("")

    const [loading, setLoading] = useState(false)

    const [count, setCount] = useState(0)

    const { login, currentUser } = useAuth()

    const history = useHistory();

    const {email, password} = useParams()

    const loginController = (e) => {
        e.preventDefault();
        const dataLogin = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        if (dataLogin.email.trim() === "") {
            setError("Email is missing")
        } else if (dataLogin.password.trim() === "") {
            setError("Password is missing")
        } else {
            setError("")
        }

        if (dataLogin.email !== "" && dataLogin.password !== "") {
            loginModel(dataLogin.email.trim(), dataLogin.password.trim());
        }
    }

    const loginModel = async (email, password) => {
        try {
            setLoading(true)
            const response = await login(email, password);
            if (response.user.emailVerified === true) {
                history.go(0)
            }
            else {
                alert("Your email is not verified");
                setLoading(false);
            }
        }
        catch (err) {
            if (err.code === 'auth/user-not-found'
                || err.code === "auth/invalid-email"
                || err.code === 'auth/wrong-password'
            ) {
                setError("Email or password is incorrect")
            }
            setLoading(false)
        }
    }

    if(email&&password&&count===0){
        setCount(prev => prev + 1)

        const dataLogin = {
            email: email,
            password: password
        };

        if (dataLogin.email.trim() === "") {
            setError("Email is missing")
        } else if (dataLogin.password.trim() === "") {
            setError("Password is missing")
        } else {
            setError("")
        }

        if (dataLogin.email !== "" && dataLogin.password !== "") {
            loginModel(dataLogin.email.trim(), dataLogin.password.trim());
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
                    <div className="error">{error}</div>
                    <div className="input-wrapper">
                        <input type="email" name="email" placeholder="Email" />
                    </div>
                    <div className="input-wrapper">
                        <input type="password" name="password" placeholder="Password" />
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