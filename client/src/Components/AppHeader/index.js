import React, { Fragment } from "react";
import cx from "classnames";
import { connect } from "react-redux";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import HeaderLogo from "../AppLogo";
import { setHomeRightSideContent } from "../../reducers/DefinitionReducer";
import history from "../../Utils/history";
import UserBox from "./Components/UserBox";

const Header = (props) => {
    let { enableMobileMenuSmall, enableHeaderShadow } = props;

    const directingTohome = () => {
        history.push("/home");
    };
    return (
        <Fragment>
            <ReactCSSTransitionGroup
                component="div"
                className={cx("app-header", "bg-light header-text-dark", { "header-shadow": enableHeaderShadow })}
                transitionName="HeaderAnimation"
                transitionAppear={true}
                transitionAppearTimeout={1500}
                transitionEnter={false}
                transitionLeave={false}
            >
                <div className="logo-src" onClick={() => directingTohome()}>
                    Dr. Pulkit Varshney
                </div>

                <HeaderLogo />

                <div className={cx("app-header__content", { "header-mobile-open": enableMobileMenuSmall })}>
                    <div className="app-header-right">
                        <UserBox />
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
});

const mapDispatchToProps = (dispatch) => ({
    setHomeRightSideContent: (homeContent) => dispatch(setHomeRightSideContent(homeContent)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
