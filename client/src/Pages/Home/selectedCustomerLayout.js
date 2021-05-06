import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { connect } from "react-redux";

import EmptyState from "./emptyState";

import "./index.scss";

const SelectedCustomerLayout = (props) => {
    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="TabsAnimation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
        >
            <EmptyState />
        </ReactCSSTransitionGroup>
    );
};

const mapStateToProps = (state) => ({
    enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
    enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedCustomerLayout);
