import React, { useEffect } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { useLazyQuery } from "@apollo/react-hooks";
import { Row, Col, ListGroup, ListGroupItem, Button, Table } from "reactstrap";
import moment from "moment";
import { useMutation } from "@apollo/react-hooks";
import { toast, Bounce } from "react-toastify";
import { capitalize } from "lodash";
import { v4 as uuid } from "uuid";
import {
    setViewPrescription,
    updateVaccineDetails,
    setPrescription,
    setAllPrescriptions,
    setSpecificPatient,
} from "../../../reducers/DefinitionReducer";
import { setPatientToAppoint } from "../../../actions/userActions";
import { setHomeRightSideContent } from "../../../reducers/DefinitionReducer";
import { setAuthLogout } from "../../../actions/authActions";
import { setInvoices, setInvoicesLoading, setViewInvoice } from "../../../actions/paymentActions";
import Prescription from "../../../Components/Prescription";
import { FETCH_INVOICES } from "../../../Utils/Graphql/invoiceGraphql";
import { DELETE_PATIENT, GET_VACCINE_CHART, UPDATE_PATIENT_VACCINE_TRACK } from "../../../Utils/Graphql/patientsGraphql";
import { FETCH_PRESCRIPTIONS } from "../../../Utils/Graphql/prescriptionGraphql";
import EmptyState from "../../../Components/Common/EmptyState";
import ConfirmModal from "../../../Components/Common/ConfirmModal";
import { handleCommonError } from "../../../Utils/validation";
import VitalsModal from "../../../Components/Common/VitalsModal";
import VitalsHomeTable from "../../../Components/Table/VitalsHomeTable";
import history from "../../../Utils/history";
import { routeConstants } from "../../../Utils/Constants/routeConstants";
import {getPatienSerialId} from "../../../Utils/common";
import ToolTip from "../../../Components/Common/ToolTip";

import "./_index.scss";
import Invoice from "../../../Components/Invoice/Invoice";

const PAGE_VIEW_MODE = {
    PRESCRIPTION_VIEW: "PRESCRIPTION_VIEW",
    INVOICE_VIEW: "INVOICE_VIEW",
    BILL_CREATE: "BILL_CREATE",
    BILL_VIEW: "BILL_VIEW",
};

const SpecificPatient = (props) => {
    let [active, setActive] = React.useState(0);
    let [activeInvoice, setActiveInvoice] = React.useState(0);
    const { first_name, last_name, phone, age, address, sex, bookings, isTracked, patient_serial_id="" } = props.patient;

    let mergedAddress = "";

    if (address) {
        mergedAddress = address.area ? mergedAddress + address.area : mergedAddress;
        mergedAddress = address.state ? mergedAddress + " " + address.state : mergedAddress;
        mergedAddress = address.pincode ? mergedAddress + " " + address.pincode : mergedAddress;
    }

    let sortedDates =
        bookings.length > 0 &&
        [...bookings].sort((a, b) => {
            let yeara = a.date.split("/")[2];
            let yearb = b.date.split("/")[2];
            let montha = a.date.split("/")[1] - 1;
            let monthb = b.date.split("/")[1] - 1;
            let dayDatea = a.date.split("/")[0];
            let dayDateb = b.date.split("/")[0];

            return new Date(yeara, montha, dayDatea) > new Date(yearb, monthb, dayDateb) ? 1 : -1;
        });

    /**
     *  graphql request to delete some  patient
     */

    let [deletePatientData] = useMutation(DELETE_PATIENT, {
        variables: { id: props.patient.id },
        update(_, data) {
            toast("Patient deleted successfully", {
                transition: Bounce,
                closeButton: true,
                autoClose: 2000,
                position: "top-center",
                type: "success",
            });

            setTimeout(() => {
                props.setHomeRightSideContent("selectCustom", {});
            }, 2000);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // fetch vaccine chart graphql query
    const [getVaccineChart] = useLazyQuery(GET_VACCINE_CHART, {
        onCompleted(data) {
            props.updateVaccineDetails(data.vaccine || []);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // get all prescriptions for specific patient - graphql request to fetch all prescriptions of specific pateint
    const [getPrescription] = useLazyQuery(FETCH_PRESCRIPTIONS, {
        onCompleted(prescriptionData) {
            props.setAllPrescriptions(prescriptionData.prescriptions);
            if (prescriptionData.prescriptions.length > 0) {
                props.setViewPrescription(prescriptionData.prescriptions[0]);
            } else {
                props.setAllPrescriptions([]);
                props.setViewPrescription({});
            }
            // props.setHomeRightSideContent("specificPatient", patient);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // get all bills for specific patient - graphql request to fetch all bills of specific patient
    const [getInvoices] = useLazyQuery(FETCH_INVOICES, {
        onCompleted: (data) => {
            props.setInvoices(data.invoices);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    useEffect(() => {
        props.setInvoicesLoading();
        getVaccineChart({
            variables: {
                id: props.patient.id,
            },
        });
        getPrescription({ variables: { id: props.patient.id, unique: uuid() } });
        getInvoices({ variables: { patient_id: props.patient.id, unique: uuid(), filter_criteria: "specific patient" } });
    }, [props.patient]);

    // delete patient confirm handler
    let [confirmDelete, setConfirmDelete] = React.useState({ visibility: false });

    const confirmDeleteHandler = () => {
        setConfirmDelete({ visibility: true });
    };

    const deletePatient = () => {
        deletePatientData();
        setConfirmDelete(false);
    };

    const redirectToCreatePrescriptionPage = () => {
        props.setViewPrescription({});
        let initialPrescription = [];
        props.setPrescription(initialPrescription);
        history.push({
            pathname: routeConstants.PRESCRIPTION,
        });
    };

    const redirectToBookAppointmentPage = () => {
        props.setPatientToAppoint({
            id: props.patient.id,
            name: `${props.patient.first_name} ${props.patient.last_name}`,
        });
        history.push({
            pathname: routeConstants.BOOKINGS,
        });
    };

    // update current selected prescription to view.
    // selected from Last Visits list.
    const viewPrescription = (index) => {
        setActive(index);
        setPageViewMode(PAGE_VIEW_MODE.PRESCRIPTION_VIEW);
        props.setViewPrescription(props.allPrescriptions[index]);
    };

    // selected from last bills list
    const viewInvoice = (index) => {
        setActiveInvoice(index);
        setPageViewMode(PAGE_VIEW_MODE.BILL_CREATE);
        props.setViewInvoice(props.invoices[index]);
    };

    // switch to edit patient view
    const editPatient = () => {
        props.setHomeRightSideContent("createPatient", props.patient);
    };

    // control vitals (full view) modal visibility
    let [vitalsModalVisibility, setVitalsModalVisibility] = React.useState(false);

    // control page mode. Check - PAGE_VIEW_MODE
    let [pageViewMode, setPageViewMode] = React.useState(PAGE_VIEW_MODE.PRESCRIPTION_VIEW);

    const renderPrescriptionView = () => {
        return Object.keys(props.viewPrescription).length > 0 ? (
            <Prescription patient={props.patient} viewPrescription={props.viewPrescription} delete edit homePrescription />
        ) : (
            <div className="card">
                <EmptyState content={props.allPrescriptions.length ? "No Prescription Found" : "No prescription yet."} />
            </div>
        );
    };

    const changePageViewMode = () => {
        setPageViewMode(PAGE_VIEW_MODE.PRESCRIPTION_VIEW);
        props.setViewInvoice({});
    };

    const renderCreateBillView = () => {
        return <Invoice patient={props.patient} viewInvoice={props.viewInvoice} changePageViewMode={changePageViewMode} />;
    };

    const createBill = () => {
        setPageViewMode(PAGE_VIEW_MODE.BILL_CREATE);
        props.setViewInvoice({});
    };

    /**
     *  graphql request to update patient vaccine track status
     */

    let [patientUpdateVaccineTrack] = useMutation(UPDATE_PATIENT_VACCINE_TRACK, {
        variables: { id: props.patient.id, isTracked: !isTracked },
        update(_, data) {
            props.setSpecificPatient({ ...props.patient, isTracked: !isTracked });
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    const renderPatientCard = () => {
        return (
            <div className="card mb-3 widget-chart">
                <div className="user-card">
                    <div className="icon-wrapper rounded-circle">
                        <div className="icon-wrapper-bg bg-primary" />
                        <i className="lnr-user text-primary" />
                    </div>
                    <div className="widget-numbers p-name text-capitalize">{first_name + " " + last_name}</div>
                    <div className="widget-subheading">
                        {patient_serial_id && `${getPatienSerialId(patient_serial_id)} | `}{age > -1 && age + " years  | "} {capitalize(sex)}
                    </div>
                    <div className="widget-description p-details text-left">
                        <Table size="sm" className="mb-0">
                            <tbody>
                                <tr>
                                    <th className="icon-cell">
                                        <i className="pe-7s-phone icon" />
                                    </th>
                                    <td className="data-cell">{phone}</td>
                                </tr>
                                <tr>
                                    <th className="icon-cell">
                                        <i className="pe-7s-home icon" />
                                    </th>
                                    <td className="data-cell">{mergedAddress}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-block text-right card-footer" style={{ padding: "20px 0 0 0" }}>
                        <Button outline className="mb-2 mr-2 btn-transition" color="danger" onClick={() => confirmDeleteHandler()}>
                            Delete
                        </Button>
                        <Button outline className="mb-2 mr-2 btn-transition" color="primary" onClick={() => editPatient()}>
                            Edit
                        </Button>
                        <Button outline className="mb-2 mr-2 btn-transition" color="primary" onClick={() => createBill()}>
                            Create Bill
                        </Button>
                        <ToolTip
                            id="p-sms-checkbox"
                            toolTipContent={
                                <div className="font-weight-light">
                                    {isTracked ? "Click to UnTrack Patient Vaccine" : "Click to Track Patient Vaccine"}
                                </div>
                            }
                            placement="top"
                            className="tooltip-light"
                        >
                            <Button
                                id="p-sms-checkbox"
                                className="mb-2 mr-2 btn-transition"
                                color={isTracked ? "success" : "light"}
                                onClick={() => patientUpdateVaccineTrack()}
                            >
                                Track Vaccine
                            </Button>
                        </ToolTip>
                        <Button outline className="mb-2 mr-2 btn-transition" color="primary" onClick={redirectToCreatePrescriptionPage}>
                            Add Prescription
                        </Button>
                        <Button outline className="mb-2 mr-2 btn-transition" color="primary" onClick={redirectToBookAppointmentPage}>
                            Book Appointment
                        </Button>
                    </div>

                    {sortedDates && sortedDates.length > 0 ? (
                        <div className="widget-subheading n-visit">
                            Upcoming Appointment: {sortedDates[0].date} {sortedDates[0].time}
                        </div>
                    ) : (
                        <div className="widget-subheading n-visit">No upcoming appointments</div>
                    )}
                </div>
            </div>
        );
    };

    const renderLastVisitCard = () => {
        return (
            <div className="card mb-3 widget-chart">
                <div className="widget-chart-content last-visit card-custom">
                    <Row className="heading">
                        <Col md="9 text-left">Last Visits</Col>
                        <Col md="3 text-right">
                            <i className="pe-7s-angle-right-circle icon"></i>
                        </Col>
                    </Row>
                    <PerfectScrollbar>
                        <ListGroup flush className="date-list">
                            {props.allPrescriptions.length > 0 ? (
                                props.allPrescriptions
                                    .sort((a, b) => moment(b.updated_at) - moment(a.updated_at))
                                    .map((prescription, index) => {
                                        return (
                                            <ListGroupItem
                                                key={"prescription" + index}
                                                className={active === index ? " text-left active-visit" : " text-left "}
                                                onClick={() => viewPrescription(index)}
                                            >
                                                {moment(prescription.updated_at).format("LL")}
                                                <span style={{ float: "right" }}>{moment(prescription.updated_at).format("HH:mm")}</span>
                                            </ListGroupItem>
                                        );
                                    })
                            ) : (
                                <ListGroupItem>No Visits yet</ListGroupItem>
                            )}
                        </ListGroup>
                    </PerfectScrollbar>
                </div>
            </div>
        );
    };

    const renderLastBillCard = () => {
        return (
            <div className="card mb-3 widget-chart">
                <div className="widget-chart-content last-bill card-custom">
                    <Row className="heading">
                        <Col md="9 text-left">Last Bills</Col>
                        <Col md="3 text-right">
                            <i className="pe-7s-angle-right-circle icon"></i>
                        </Col>
                    </Row>
                    <PerfectScrollbar>
                        <ListGroup flush className="date-list">
                            {props.invoices.length > 0 ? (
                                props.invoices
                                    .sort((a, b) => b.serial_id - a.serial_id)
                                    .map((invoice, index) => {
                                        return (
                                            <ListGroupItem
                                                key={"invoice" + index}
                                                className={activeInvoice === index ? " text-left active-visit" : " text-left "}
                                                onClick={() => viewInvoice(index)}
                                            >
                                                {invoice.serial_id}
                                            </ListGroupItem>
                                        );
                                    })
                            ) : (
                                <ListGroupItem>No Bills yet</ListGroupItem>
                            )}
                        </ListGroup>
                    </PerfectScrollbar>
                </div>
            </div>
        );
    };

    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="TabsAnimation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
        >
            <ConfirmModal
                isOpen={confirmDelete.visibility}
                titleContent="Are You Sure You Want To Delete?"
                setConfirmDelete={setConfirmDelete}
                deleteConfirmHandler={deletePatient}
            />

            <VitalsModal isOpen={vitalsModalVisibility} setVitalsModalVisibility={setVitalsModalVisibility} />

            <Row>
                <Col md="12" lg="4">
                    <Row>
                        <Col md={props.enableClosedSidebar ? "6 col-width" : "12 col-width"}>{renderPatientCard()}</Col>
                        <Col md={props.enableClosedSidebar ? "6 col-width" : "12 col-width"}>{renderLastVisitCard()}</Col>
                        <Col md={props.enableClosedSidebar ? "6 col-width" : "12 col-width"}>{renderLastBillCard()}</Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <div className="card mb-3 widget-chart">
                                <div className="widget-chart-content card-custom">
                                    <Row className="heading justify-align">
                                        <Col md="text-left">Vitals</Col>
                                        <Col md="text-right">
                                            {props.allPrescriptions.length > 0 && (
                                                <Button
                                                    outline
                                                    className="mb-2 mr-2 btn-transition"
                                                    color="primary"
                                                    onClick={() => setVitalsModalVisibility(true)}
                                                >
                                                    Detailed
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12" className="vitals-table">
                                            {props.allPrescriptions.length > 0 ? (
                                                <VitalsHomeTable allPrescriptions={props.allPrescriptions} />
                                            ) : (
                                                <EmptyState content="No Vitals Found" />
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md="12" lg="8">
                    {pageViewMode === PAGE_VIEW_MODE.PRESCRIPTION_VIEW ? renderPrescriptionView() : null}
                    {pageViewMode === PAGE_VIEW_MODE.BILL_CREATE ? renderCreateBillView() : null}
                </Col>
            </Row>
        </ReactCSSTransitionGroup>
    );
};

const mapStateToProps = (state) => ({
    allPrescriptions: state.DefinitionReducer.allPrescriptions,
    viewPrescription: state.DefinitionReducer.viewPrescription,
    patient: state.DefinitionReducer.patient,
    invoices: state.PaymentReducer.invoices,
    viewInvoice: state.PaymentReducer.viewInvoice,
});

const mapDispatchToProps = (dispatch) => ({
    setViewPrescription: (viewPrescription) => dispatch(setViewPrescription(viewPrescription)),
    setHomeRightSideContent: (homeContent, patient) => dispatch(setHomeRightSideContent(homeContent, patient)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setPatientToAppoint: (patient) => dispatch(setPatientToAppoint(patient)),
    updateVaccineDetails: (details) => dispatch(updateVaccineDetails(details)),
    setAllPrescriptions: (allPrescriptions) => dispatch(setAllPrescriptions(allPrescriptions)),
    setInvoicesLoading: () => dispatch(setInvoicesLoading()),
    setInvoices: (invoices) => dispatch(setInvoices(invoices)),
    setViewInvoice: (invoice) => dispatch(setViewInvoice(invoice)),
    setSpecificPatient: (patient) => dispatch(setSpecificPatient(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpecificPatient);
