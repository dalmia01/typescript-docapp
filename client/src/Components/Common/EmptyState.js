import React, { Fragment } from "react";

import NoDataImg from "../../assets/utils/images/nodata2.png";
import "./common.scss";

const EmptyState = (props) => {
    return (
        <Fragment>
            <div className="empty">
                <div className="info-container">
                    <div className="card-title">{props.title || "Whoops..."}</div>
                    <div className="content">{props.content}</div>
                </div>
                <div>
                    <img src={NoDataImg} alt="Not Available" />
                </div>
            </div>
        </Fragment>
    );
};

export default EmptyState;
