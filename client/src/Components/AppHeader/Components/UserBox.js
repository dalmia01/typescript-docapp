import React, { Fragment } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, Nav, NavItem, NavLink } from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "../index.scss";
import { setAuthLogout } from "../../../actions/authActions";
import { setHomeRightSideContent } from "../../../reducers/DefinitionReducer";
import ResetModal from "../../Common/ResetModal";
import { routeConstants } from "../../../Utils/Constants/routeConstants";

const UserBox = (props) => {
    // userbox visibility state
    let [active, setActive] = React.useState(false);

    // to reset password confirm modal
    let [confirmPassword, setConfirmPassword] = React.useState({ visibility: false });

    // open reset password modal
    const resetModalHandler = () => {
        setConfirmPassword({ visibility: true });
        setActive(false);
    };

    // to logout
    const logout = (e) => {
        e.preventDefault();
        props.setAuthLogout();
    };

    // redirect to addign new patient route
    const addPatient = (e) => {
        e.preventDefault();
        setActive(false);
        props.setHomeRightSideContent("createPatient", {});
        props.history.push("home");
    };

    const routingRedirect = (routeName) => {
        props.history.push(routeName);
    };

    return (
        <Fragment>
            <ResetModal isOpen={confirmPassword.visibility} titleContent="Reset Password" setConfirmPassword={setConfirmPassword} />

            <div className="header-btn-lg pr-0 header-action">
                <Dropdown isOpen={active} toggle={() => setActive(!active)}>
                    <DropdownToggle className="p-0 action-btn">
                        <i className="lnr-cog text-primary gear-icon" />
                    </DropdownToggle>
                    <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                        <Nav vertical>
                            <NavItem className="nav-item-header">Activity</NavItem>
                            <NavItem>
                                <NavLink onClick={addPatient}>Add Patient</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => routingRedirect(routeConstants.USER_MANAGER)}>User Manager</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => routingRedirect(routeConstants.INVOICES_MANAGER)}>Invoices Manager</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => routingRedirect(routeConstants.APPOINTMENTS)}>Set Appointments Slots</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => routingRedirect(routeConstants.BOOKINGS)}>Schedule Appointment</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => routingRedirect(routeConstants.PATIENTS_BOOKING)}>Patients Booking</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => routingRedirect(routeConstants.VACCINATION_DETAILS)}>Vaccination Details</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => routingRedirect(routeConstants.CLINIC_MANAGER)}>Clinics Manager</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/" onClick={resetModalHandler}>
                                    Reset Password
                                </NavLink>
                            </NavItem>
                            <NavItem className="nav-item-header">My Account</NavItem>
                            <NavItem>
                                <NavLink to="/">
                                    Settings
                                    <div className="ml-auto badge badge-success">New</div>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/">
                                    Billing
                                    <div className="ml-auto badge badge-warning">512</div>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={(e) => logout(e)}>Logout</NavLink>
                            </NavItem>
                        </Nav>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    patient: state.DefinitionReducer.patient,
});

const mapDispatchToProps = (dispatch) => ({
    setAuthLogout: () => dispatch(setAuthLogout()),
    setHomeRightSideContent: (homeContent) => dispatch(setHomeRightSideContent(homeContent, {})),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserBox));
