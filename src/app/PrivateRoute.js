import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../firebase/Auth';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    
    const { currentUser } = useAuth()

    return (
        <Route
            {...rest}
            render={routeProps => {
                return currentUser ? <RouteComponent {...routeProps} /> : <Redirect to="/login" />
            }}
        />
    );
};

export default PrivateRoute;