import React from "react";
import { withRouter } from "react-router-dom";
import { FormGroup, Row, Col, Button } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { debounce } from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";
import { useLazyQuery } from "@apollo/react-hooks";

import history from "../../Utils/history";
import PatientList from "../PatientList/PatientList";
import PatientSearch from "../PatientList/PatientSearch";
import { handleCommonError } from "../../Utils/validation";
import ToolTip from "../Common/ToolTip";
import {
    setAllPrescriptions,
    setViewPrescription,
    setSpecificPatient,
    setPrescription,
    setMedicalHistory,
    setFilteredPatients,
} from "../../reducers/DefinitionReducer";
import { setHomeRightSideContent } from "../../reducers/DefinitionReducer";
import { setAuthLogout } from "../../actions/authActions";
import { FILTER_PATIENT } from "../../Utils/Graphql/patientsGraphql";
import EmptyState from "../Common/EmptyState";
import { setPatientToAppoint } from "../../actions/userActions";

import "./index.scss";

class DateView extends React.Component {
    render() {
        return (
            <Button outline className="mb-2 mr-2 btn-transition" color="primary" onClick={this.props.onClick}>
                {this.props.value}
            </Button>
        );
    }
}

const Nav = (props) => {
    const [startDate, setStartDate] = React.useState(new Date());
    const [patientsList, setPatientsList] = React.useState([]);
    const [notFound, setNotFound] = React.useState(false);

    // get patients on filter - graphql request to get patients data
    const [getData, { loading }] = useLazyQuery(FILTER_PATIENT, {
        onCompleted(patientData) {
            setPatientsList(patientData.patient);
            props.setFilteredPatients(patientData.patient);
            if (patientData.patient.length > 0) {
                setNotFound(false);
            } else {
                setNotFound(true);
            }
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // debounce effect (to handle api requests throttle) on change in search

    const delayedHandleChange = debounce((eventData) => getData(eventData), 400);

    let [searchText, setSearchText] = React.useState("");
    const onSearchTextChange = (event) => {
        let text = event.target.value.replace(/[^A-Za-z0-9 ]/g, "");
        setSearchText(text);
        if (searchText && searchText.length > 2) {
            delayedHandleChange({
                variables: { filter: JSON.stringify({ name_phone: searchText }) },
            });
        }
    };

    // call graphql function and setting redux states.
    const specificPatient = (patient) => {
        setPatientsList([]);
        setNotFound(true);
        props.setSpecificPatient(patient);
        props.setHomeRightSideContent("specificPatient", patient);
    };

    /**
     *  redirect to prescription page , addign new prescription for specific patient
     */
    const addPrescription = (patient) => {
        props.setViewPrescription({});
        let initialPrescription = [];
        props.setPrescription(initialPrescription);
        props.setSpecificPatient(patient);
        history.push({
            pathname: "/prescription",
        });
    };

    /**
     * setting patient to schedule appointment
     */

    const setPatientToScheduleAppointment = (particularPatient) => {
        props.setPatientToAppoint({
            id: particularPatient.id,
            name: `${particularPatient.first_name} ${particularPatient.last_name}`,
        });
        history.push({
            pathname: "/bookings",
        });
    };

    // return modified date

    const getModifiedDate = (date) => {
        let dayDate = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        let month = date.getMonth() + 1;
        month = month > 9 ? month : "0" + month;
        let year = date.getFullYear() > 9 ? date.getFullYear() : "0" + date.getFullYear();
        let modifiedDate = `${dayDate}/${month}/${year}`;
        return modifiedDate;
    };

    /**
     *  setting date handler
     */

    const settingDateHandler = (date) => {
        let modifiedDate = getModifiedDate(date);

        setStartDate(date);
        getData({ variables: { filter: JSON.stringify({ date: modifiedDate }) } });
    };

    React.useEffect(() => {
        let modifiedDate = getModifiedDate(startDate);
        getData({ variables: { filter: JSON.stringify({ date: modifiedDate }) } });
    }, []);

    return (
        <div className="side-nav">
            <div className="card">
                <FormGroup className="search-grp">
                    <PatientSearch onSearchTextChange={onSearchTextChange} searchText={searchText} />
                </FormGroup>
            </div>
            <div className="card schedule-container">
                <div className="card-header-title title">
                    <Row>
                        <Col md="7">
                            <i className="lnr-calendar-full icon-gradient bg-arielle-smile s-icon"></i>
                            Schedule
                        </Col>
                        <Col md="1">
                            <ToolTip
                                id="lnr-sync"
                                toolTipContent={<div className="font-weight-light">Refresh</div>}
                                placement="top"
                                className="tooltip-light"
                            >
                                <i
                                    class="lnr-sync"
                                    id="lnr-sync"
                                    onClick={() => getData({ variables: { filter: JSON.stringify({ date: getModifiedDate(startDate) }) } })}
                                ></i>
                            </ToolTip>
                        </Col>
                        <Col md="4">
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={startDate}
                                onChange={(date) => settingDateHandler(date)}
                                popperClassName="datepicker-poper"
                                showPopperArrow={false}
                                showYearDropdown
                                showMonthDropdown
                                customInput={<DateView />}
                            />
                        </Col>
                    </Row>
                </div>
                <PerfectScrollbar>
                    {loading ? (
                        <h6 className="alert alert-light fade show">Please wait while we load patients</h6>
                    ) : patientsList.length > 0 ? (
                        <PatientList
                            patients={props.filtered_patients}
                            specificPatient={specificPatient}
                            addPrescription={addPrescription}
                            setPatientToScheduleAppointment={setPatientToScheduleAppointment}
                        />
                    ) : notFound ? (
                        <EmptyState content="No patient found" />
                    ) : (
                        <h6 className="alert alert-light fade show">Search for Patients</h6>
                    )}
                </PerfectScrollbar>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    patient: state.DefinitionReducer.patient,
    medicalHistory: state.DefinitionReducer.medicalHistory,
    filtered_patients: state.DefinitionReducer.filtered_patients,
});

const mapDispatchToProps = (dispatch) => ({
    setHomeRightSideContent: (homeContent, patient) => dispatch(setHomeRightSideContent(homeContent, patient)),
    setAllPrescriptions: (allPrescriptions) => dispatch(setAllPrescriptions(allPrescriptions)),
    setViewPrescription: (viewPrescription) => dispatch(setViewPrescription(viewPrescription)),
    setSpecificPatient: (patient) => dispatch(setSpecificPatient(patient)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setPatientToAppoint: (patient) => dispatch(setPatientToAppoint(patient)),
    setMedicalHistory: (medicalHistory) => dispatch(setMedicalHistory(medicalHistory)),
    setFilteredPatients: (filtered_patients) => dispatch(setFilteredPatients(filtered_patients)),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Nav);
