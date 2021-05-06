import React, { Fragment } from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { withRouter } from "react-router-dom";

import Routes from "../routes";

import { SIDEBAR_VISIBLE_ROUTES } from "../../Utils/Constants/commonConstants";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closedSmallerSidebar: false,
        };
    }

    render() {
        let {
            colorScheme,
            enableFixedHeader,
            enableFixedSidebar,
            enableFixedFooter,
            enableClosedSidebar,
            closedSmallerSidebar,
            enableMobileMenu,
        } = this.props;

        const { width } = window.screen;

        return (
            <Fragment>
                <div
                    className={cx(
                        "app-container app-theme-" + colorScheme,
                        { "fixed-header": enableFixedHeader },
                        { "fixed-sidebar": enableFixedSidebar || width < 1250 },
                        { "fixed-footer": enableFixedFooter },
                        {
                            "closed-sidebar":
                                (SIDEBAR_VISIBLE_ROUTES.includes(this.props.location.pathname) ? enableClosedSidebar : true) ||
                                width < 1250,
                        },
                        { "closed-sidebar-mobile": closedSmallerSidebar || width < 1250 },
                        { "sidebar-mobile-open": enableMobileMenu }
                    )}
                >
                    <Routes />
                </div>
            </Fragment>
        );
    }
}

const mapStateToProp = (state) => ({
    colorScheme: state.ThemeOptions.colorScheme,
    enableFixedHeader: state.ThemeOptions.enableFixedHeader,
    enableMobileMenu: state.ThemeOptions.enableMobileMenu,
    enableFixedFooter: state.ThemeOptions.enableFixedFooter,
    enableFixedSidebar: state.ThemeOptions.enableFixedSidebar,
    enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
    enablePageTabsAlt: state.ThemeOptions.enablePageTabsAlt,
});

export default withRouter(connect(mapStateToProp)(Main));
