import React, { Fragment } from "react";

const MasterLayout = ({ children }) => (
    <Fragment>
        <div className="app-container">{children}</div>
    </Fragment>
);

export default MasterLayout;
