import React, { useContext, useState, useEffect } from 'react';
import { auth } from './config';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)

    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password)
    }

    const signout = () => {
        return auth.signOut()
    }

    const resetPassword = (email) => {
        return auth.sendPasswordResetEmail(email)
    }

    const updatePassword = (password) => {
        return auth.currentUser.updatePassword(password)
    }

    const value = {
        currentUser,
        login,
        signup,
        signout,
        resetPassword,
        updatePassword
    }

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user && user.emailVerified === true) {
                setCurrentUser(user.email)
            }
        })
    }, [])
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}