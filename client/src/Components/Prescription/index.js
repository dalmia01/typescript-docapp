import React from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import ReactToPrint from "react-to-print";
import { connect } from "react-redux";
import ToolTip from "../Common/ToolTip";
import moment from "moment";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { Fragment } from "react";

import { getPrescription } from "../../Utils/common";
import history from "../../Utils/history";
import PrintPreview from "./PrintPreview";
import { PRINT_PRESCRIPTION_STYLE } from "../../Utils/InitialState/initialState";
import {
    setPrescription,
    setSpecificPatient,
    setAllPrescriptions,
    setViewPrescription,
    setDefinitionList,
    setSelectedOption,
} from "../../reducers/DefinitionReducer";
import { setRightSideDrawer } from "../../reducers/ThemeOptions";
import { setAuthLogout } from "../../actions/authActions";
import { SAVE_PRESCRIPTION, DELETE_PRESCRIPTION } from "../../Utils/Graphql/prescriptionGraphql";
import ConfirmModal from "../Common/ConfirmModal";
import FavouriteNameModal from "../Common/FavouriteNameModal";
import { handleCommonError } from "../../Utils/validation";

import "./index.scss";

const Prescription = (props) => {
    let initialPrescription = [];
    let [isSmsEnabled, setSmsEnabled] = React.useState(false);

    // print page setting styles
    const page_style = `@page {margin:${PRINT_PRESCRIPTION_STYLE.margin}}`;

    /**
     *   graphql request to save prescription to database
     */

    let [savePrescriptionData] = useMutation(SAVE_PRESCRIPTION, {
        update(_, data) {
            toast.success("Prescription saved successfully");
            setTimeout(() => {
                history.push("/home");
            }, 1000);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    const savePrescription = (favName) => {
        const symptoms = [...props.prescription].filter((item) => {
            return item.category === "Symptoms";
        });

        const findings = [...props.prescription].filter((item) => {
            return item.category === "Findings";
        });

        const diagnosis = [...props.prescription].filter((item) => {
            return item.category === "Diagnosis";
        });

        const investigations = [...props.prescription].filter((item) => {
            return item.category === "Investigations";
        });

        const instructions = [...props.prescription].filter((item) => {
            return item.category === "Instructions";
        });

        const medicines = [...props.prescription].filter((item) => {
            return item.category === "Medicines";
        });

        const others = [...props.prescription].filter((item) => {
            return item.category === "Others";
        });

        let vitals = {};

        [...props.prescription].filter((item) => {
            if (item.category === "Vitals") {
                vitals = { ...item };
            }
        });

        const prescription = {
            patient_id: props.patient.id,
            symptoms: symptoms,
            findings: findings,
            diagnosis: diagnosis,
            medicines: medicines,
            investigations: investigations,
            instructions: instructions,
            vitals: vitals,
            others: others,
            smsEnabled: isSmsEnabled,
        };

        // edit case
        if (Object.keys(props.viewPrescription).length > 0) {
            prescription.precription_id = props.viewPrescription.id;
        }

        // case of saving as favourite
        if (favName) {
            delete prescription.patient_id;
            prescription.fav_name = favName;
            prescription.is_fav = true;
        }

        prescription.user_id = props.user.id;
        savePrescriptionData({ variables: { data: JSON.stringify(prescription) } });
    };

    /**
     *  graphql request to delete prescription to database
     */
    let [deletePrescriptionData] = useMutation(DELETE_PRESCRIPTION, {
        update(_, data) {
            if (data.data && data.data.prescription) {
                const updatedAllPrescriptions = props.allPrescriptions.filter((prescription) => {
                    return prescription.id !== data.data.prescription;
                });
                props.setAllPrescriptions(updatedAllPrescriptions);
                props.setViewPrescription(updatedAllPrescriptions[0]);
                toast.success("Prescription deleted successfully");
            } else {
                toast.error("Some error occurred");
            }
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    const deletePrescription = () => {
        deletePrescriptionData({ variables: { id: props.viewPrescription.id } });
    };

    // print settings
    const [printOptionsVisibility, setPrintOptionsVisibility] = React.useState(false);
    const [printOptions, setPrintOptions] = React.useState({
        symptoms: true,
        findings: true,
        diagnosis: true,
        investigations: true,
        instructions: true,
        vaccines: true,
        medicines: true,
        vitals: true,
        others: true,
    });
    const printSettings = () => {
        setPrintOptionsVisibility(!printOptionsVisibility);
    };
    const changePrintOptionsHandler = (e, item) => {
        setPrintOptions({ ...printOptions, [e.target.value]: !printOptions[e.target.value] });
    };

    // to confirm delete operation (to delete prescription ) enable disable confirm modal
    let [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = React.useState(false);

    let [favNameModalVisible, setFavNameModalVisibility] = React.useState(false);

    /**
     *  redirecting it to prection page from any other page for editing some specific prescription && setting prescription in redux state
     */

    const editPrescription = () => {
        if (Object.keys(props.viewPrescription).length > 0) {
            initialPrescription = getPrescription(props.viewPrescription, props.patient);

            props.setPrescription(initialPrescription);
        }

        history.push({
            pathname: "/prescription",
        });
    };

    // adding & saving favourite prescription
    const addToFavourite = (favName) => {
        savePrescription(favName);
    };

    // clear prescription
    const clearPrescription = () => {
        props.setPrescription([]);
        props.setSelectedOption({});
        props.setDefinitionList({ ...props.definitionList, selected: [], nonSelected: [...props.definitionList.all] });
    };

    const renderActionIcons = () => {
        return (
            <Fragment>
                {props.isSmsEnabled && (
                    <ToolTip
                        id="p-sms-checkbox"
                        toolTipContent={<div className="font-weight-light">Select to send SMS Update</div>}
                        placement="top"
                        className="tooltip-light"
                    >
                        <input
                            id="p-sms-checkbox"
                            type="checkbox"
                            checked={isSmsEnabled}
                            onChange={() => setSmsEnabled(!isSmsEnabled)}
                            className="side-margin-10"
                        />
                    </ToolTip>
                )}

                {props.prescription.length <= 0 && !props.edit && (
                    <ToolTip
                        id="p-icon-link"
                        toolTipContent={<div className="font-weight-light">Fill from favourites prescription</div>}
                        placement="top"
                        className="tooltip-light"
                    >
                        <i
                            className="pe-7s-link icon clickable"
                            id="p-icon-link"
                            onClick={() => props.setRightSideDrawer(true, props.rightSideDrawerContent, "FavouritePrescriptions", {})}
                        />
                    </ToolTip>
                )}

                {props.favourite && props.prescription.length > 0 && (
                    <ToolTip
                        id="p-icon-star"
                        toolTipContent={<div className="font-weight-light">Add to favourite</div>}
                        placement="top"
                        className="tooltip-light"
                    >
                        <i className="pe-7s-star icon clickable" id="p-icon-star" onClick={() => setFavNameModalVisibility(true)} />
                    </ToolTip>
                )}

                {props.save && props.prescription.length > 0 && (
                    <ToolTip
                        id="p-icon-download"
                        toolTipContent={<div className="font-weight-light">Save</div>}
                        placement="top"
                        className="tooltip-light"
                    >
                        <i className="pe-7s-diskette icon clickable" id="p-icon-download" alt="Save" onClick={() => savePrescription()} />
                    </ToolTip>
                )}

                {props.delete && Object.keys(props.viewPrescription).length > 0 && props.viewPrescription.id && (
                    <ToolTip
                        id="p-icon-trash"
                        toolTipContent={<div className="font-weight-light warning-tooltip">Delete</div>}
                        placement="top"
                        className="tooltip-light"
                    >
                        <i className="pe-7s-trash icon clickable" id="p-icon-trash" onClick={() => setConfirmDeleteModalVisible(true)} />
                    </ToolTip>
                )}

                {props.edit && (
                    <ToolTip
                        id="p-icon-edit"
                        toolTipContent={<div className="font-weight-light">Edit</div>}
                        placement="top"
                        className="tooltip-light"
                    >
                        <i
                            className="lnr-pencil icon clickable"
                            id="p-icon-edit"
                            style={{ fontSize: "1.2rem" }}
                            onClick={editPrescription}
                        />
                    </ToolTip>
                )}

                {props.prescription.length > 0 && (
                    <ToolTip
                        id="p-icon-refresh"
                        toolTipContent={<div className="font-weight-light">Clear prescription</div>}
                        placement="top"
                        className="tooltip-light"
                    >
                        <i className="pe-7s-refresh-2 icon clickable" id="p-icon-refresh" onClick={clearPrescription} />
                    </ToolTip>
                )}
            </Fragment>
        );
    };

    /**
     *  redirecting it to prection page from any other page for editing
     *  some specific prescription && setting prescription in redux state
     */

    return (
        <Fragment>
            <ConfirmModal
                isOpen={confirmDeleteModalVisible}
                titleContent="Are You Sure You Want To Delete?"
                setConfirmDelete={setConfirmDeleteModalVisible}
                deleteConfirmHandler={deletePrescription}
            />
            <FavouriteNameModal
                isOpen={favNameModalVisible}
                titleContent="Add favourite name."
                setVisibility={setFavNameModalVisibility}
                confirmHandler={addToFavourite}
            />
            <div className="card mb-3 widget-chart">
                <div className="widget-chart-content card-custom">
                    <Row className="heading">
                        <Col md="8" className="text-left mrg-top0">
                            <i className="pe-7s-note2 icon" />
                            Prescription ({moment(props.viewPrescription.updated_at).format("LL")})
                        </Col>
                        <Col md="4" className="text-right end-flex">
                            {renderActionIcons()}
                            <ReactToPrint
                                trigger={() => <i className="pe-7s-print icon clickable" id="p-icon-print" />}
                                content={() => this.componentRef}
                                pageStyle={page_style}
                            />
                            <ToolTip
                                id="p-icon-settings"
                                toolTipContent={<div className="font-weight-light">Settings</div>}
                                placement="top"
                                className="tooltip-light"
                            >
                                <i
                                    className="lnr-cog icon clickable"
                                    id="p-icon-settings"
                                    style={{ fontSize: "1.2rem" }}
                                    onClick={printSettings}
                                />
                            </ToolTip>
                        </Col>
                    </Row>
                    {printOptionsVisibility && (
                        <div class="card-body">
                            <div class="card-title">Print Form Options</div>
                            <div class="form-group">
                                <div>
                                    {Object.keys(printOptions).map((item) => {
                                        return (
                                            <FormGroup check inline>
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name={"printOptions"}
                                                        onChange={changePrintOptionsHandler}
                                                        value={item}
                                                        checked={printOptions[item]}
                                                        disabled={false}
                                                    />
                                                    {item}
                                                </Label>
                                            </FormGroup>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="display-none">
                        <PrintPreview
                            ref={(el) => (this.componentRef = el)}
                            displayStyle="print"
                            homePrescription={props.homePrescription}
                            printOptions={printOptions}
                        />
                    </div>

                    <PrintPreview
                        homePrescription={props.homePrescription}
                        printOptions={printOptions}
                        doctor={props.viewPrescription.doctor}
                    />
                </div>
            </div>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    prescription: state.DefinitionReducer.prescription,
    patient: state.DefinitionReducer.patient,
    viewPrescription: state.DefinitionReducer.viewPrescription,
    allPrescriptions: state.DefinitionReducer.allPrescriptions,
    medicalHistory: state.DefinitionReducer.medicalHistory,
    definitionList: state.DefinitionReducer.definitionList,
    rightSideDrawerContent: state.ThemeOptions.rightSideDrawerContent,
    user: state.AuthReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
    setViewPrescription: (viewPrescription) => dispatch(setViewPrescription(viewPrescription)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setSpecificPatient: (patient) => dispatch(setSpecificPatient(patient)),
    setAllPrescriptions: (allPrescriptions) => dispatch(setAllPrescriptions(allPrescriptions)),
    setDefinitionList: (definitionList) => dispatch(setDefinitionList(definitionList)),
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setSelectedOption: () => dispatch(setSelectedOption({})),
});

export default connect(mapStateToProps, mapDispatchToProps)(Prescription);
