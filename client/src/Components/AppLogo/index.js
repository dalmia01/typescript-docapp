import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AppMobileMenu from "../AppMobileMenu";
import { setEnableClosedSidebar, setEnableMobileMenu, setEnableMobileMenuSmall } from "../../reducers/ThemeOptions";
import history from "../../Utils/history";
import { SIDEBAR_VISIBLE_ROUTES } from "../../Utils/Constants/commonConstants";

const HeaderLogo = (props) => {
    let [componentView, setComponentView] = useState({
        active: false,
        mobile: false,
        activeSecondaryMenuMobile: false,
        openLeft: false,
        openRight: false,
        relativeWidth: false,
        width: 280,
        noTouchOpen: false,
        noTouchClose: false,
    });

    const toggleEnableClosedSidebar = () => {
        let { enableClosedSidebar, setEnableClosedSidebar } = props;
        setEnableClosedSidebar(!enableClosedSidebar);
    };

    return (
        <Fragment>
            <div className="header__pane ml-auto">
                <div onClick={toggleEnableClosedSidebar}>
                    {SIDEBAR_VISIBLE_ROUTES.includes(history.location.pathname) && (
                        <div onClick={() => setComponentView({ active: !componentView.active })}>
                            {componentView.active ? <FontAwesomeIcon icon={faBars} /> : <FontAwesomeIcon icon={faTimes} />}
                        </div>
                    )}
                </div>
            </div>

            <AppMobileMenu />
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
    enableMobileMenu: state.ThemeOptions.enableMobileMenu,
    enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

const mapDispatchToProps = (dispatch) => ({
    setEnableClosedSidebar: (enable) => dispatch(setEnableClosedSidebar(enable)),
    setEnableMobileMenu: (enable) => dispatch(setEnableMobileMenu(enable)),
    setEnableMobileMenuSmall: (enable) => dispatch(setEnableMobileMenuSmall(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderLogo);
