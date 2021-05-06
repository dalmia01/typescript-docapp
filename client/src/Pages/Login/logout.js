import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class ResetPasswordWithToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedOut: false,
        };
    }

    render() {
        return (
            <div className="loader-container">
                <div className="loader-container-inner">
                    <h6 className="mt-3">Thank you! Logging you out ...</h6>
                </div>
            </div>
        );
    }
}

export default withRouter(ResetPasswordWithToken);
