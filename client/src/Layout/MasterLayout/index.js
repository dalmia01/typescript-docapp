import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";

// Layout
import history from "../../Utils/history";
import AppHeader from "../../Components/AppHeader";
import AppSidebar from "../../Components/AppSidebar/";
import AppRightDrawer from "../../Components/AppRightDrawer";
import PopUpModal from "../../Components/PopUpModal";
import { SIDEBAR_VISIBLE_ROUTES } from "../../Utils/Constants/commonConstants";

// import AppFooter from '../../Components/AppFooter/';

const MasterLayout = ({ children, popUpModalContent }) => {
    return (
        <Fragment>
            <AppHeader />
            <AppRightDrawer />
            <div className="app-main">
                {SIDEBAR_VISIBLE_ROUTES.includes(history.location.pathname) && <AppSidebar />}

                <div className="app-main__outer">
                    <div className="app-main__inner">{children}</div>
                </div>
            </div>
            <Modal />
            {Object.keys(popUpModalContent).length > 0 && <PopUpModal />}
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    popUpModalContent: state.ThemeOptions.popUpModalContent,
});

export default connect(mapStateToProps)(MasterLayout);
