import React, { Fragment } from "react";
import { connect } from "react-redux";
import cx from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Nav from "../AppNav/SideBarWidget";
import { setEnableMobileMenu } from "../../reducers/ThemeOptions";

const AppSidebar = (props) => {
    const toggleMobileSidebar = () => {
        let { enableMobileMenu, setEnableMobileMenu } = props;
        setEnableMobileMenu(!enableMobileMenu);
    };

    let { enableSidebarShadow } = props;

    return (
        <Fragment>
            <div className="sidebar-mobile-overlay" onClick={toggleMobileSidebar} />
            <ReactCSSTransitionGroup
                component="div"
                className={cx("app-sidebar", { "sidebar-shadow": enableSidebarShadow })}
                transitionName="SidebarAnimation"
                transitionAppear={true}
                transitionAppearTimeout={1500}
                transitionEnter={false}
                transitionLeave={false}
            >
                {/* <HeaderLogo/> */}
                <div className="app-sidebar__inner">
                    <Nav />
                </div>
            </ReactCSSTransitionGroup>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    enableSidebarShadow: state.ThemeOptions.enableSidebarShadow,
    enableMobileMenu: state.ThemeOptions.enableMobileMenu,
    backgroundImageOpacity: state.ThemeOptions.backgroundImageOpacity,
});

const mapDispatchToProps = (dispatch) => ({
    setEnableMobileMenu: (enable) => dispatch(setEnableMobileMenu(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar);
