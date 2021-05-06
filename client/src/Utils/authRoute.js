import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { routeConstants } from "../Utils/Constants/routeConstants";

function AuthRoute({ component: Component, ...componentInfo }) {
    if (componentInfo.protected) {
        return <Route {...componentInfo} render={(props) => (componentInfo.user ? <Component {...props} /> : <Redirect to="/login" />)} />;
    }

    return (
        <Route
            {...componentInfo}
            render={(props) => (componentInfo.user ? <Redirect to={routeConstants.HOME} /> : <Component {...props} />)}
        />
    );
}

const mapStateToProps = (state) => ({
    user: state.AuthReducer.user,
});

export default connect(mapStateToProps)(AuthRoute);
