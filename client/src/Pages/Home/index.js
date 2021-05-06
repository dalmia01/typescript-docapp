import React from "react";
import { connect } from "react-redux";

import SelectedCustomerLayout from "./selectedCustomerLayout";
import CreatePatient from "./CreatePatient/index";
import SpecificPatient from "./SpecificPatient";

const Home = (props) => {
    if (props.homeContent === "selectCustom") {
        return <SelectedCustomerLayout />;
    } else if (props.homeContent === "createPatient") {
        return <CreatePatient patient={props.patient} />;
    } else {
        return <SpecificPatient patient={props.patient} />;
    }
};

const mapStateToProps = (state) => ({
    enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
    closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
    enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
    homeContent: state.DefinitionReducer.homeContent,
    patient: state.DefinitionReducer.patient,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
