import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import ReactToPrint from "react-to-print";

import { setPrescription } from "../../reducers/DefinitionReducer";
import { getDobFromAge } from "../../Utils/common";
import "./index.scss";
import VaccineModal from "../../Components/Common/VaccineModal";
import { vaccinesData } from "../../Utils/Constants/vaccineChartConstants";
import { setAuthLogout } from "../../actions/authActions";
import { PRINT_PRESCRIPTION_STYLE } from "../../Utils/InitialState/initialState";
import VaccineChart from "./VaccineChart";
import VaccinationPrintPreview from "./VaccinationPrintPreview";

const Vaccination = (props) => {
    // settign local states
    let [isVaccineModalVisible, setVaccineModalVisibility] = React.useState(false);
    let [vaccineModalContent, setVaccineModalContent] = React.useState({});

    // setting selected vaccine details  to render in modal
    const showVaccineDetails = (selectedVaccine) => {
        setVaccineModalContent(selectedVaccine);
        setVaccineModalVisibility(true);
    };

    const getDuration = (rangeId, dob) => {
        const rangeDetails = vaccinesData.ranges_details[rangeId];
        return moment(dob).add(rangeDetails.start_range, rangeDetails.range_unit).format("DD/MM/YYYY");
    };

    const getCardColor = (vaccine) => {
        if (!props.vaccineData.length) {
            return "blue";
        }
        const existingEntry = props.vaccineData.find((item) => {
            return item.range === vaccine.range && item.medicine_name === vaccine.medicine_name;
        });
        if (existingEntry) {
            if (existingEntry.given_date) {
                return "green";
            }
            if (existingEntry.due_date) {
                if (new Date(existingEntry.due_date) < new Date()) {
                    return "red";
                } else {
                    return "orange";
                }
            }
        }
        return "blue";
    };

    const page_style = `@page {margin:${PRINT_PRESCRIPTION_STYLE.margin}}`;
    const dob = props.patientDetails.dob ? moment(props.patientDetails.dob) : moment(getDobFromAge(props.patientDetails.age));
    return (
        <React.Fragment>
            {isVaccineModalVisible ? (
                <VaccineModal
                    isOpen={isVaccineModalVisible}
                    vaccineModalContent={vaccineModalContent}
                    setVaccineModalVisibility={setVaccineModalVisibility}
                />
            ) : null}
            <ReactToPrint
                trigger={() => <i className="pe-7s-print icon clickable" id="p-icon-print" style={{ float: "right" }} />}
                content={() => this.componentRef}
            />

            <div className="only-print-display">
                <VaccinationPrintPreview
                    ref={(el) => (this.componentRef = el)}
                    displayStyle="print"
                    dob={dob}
                    vaccinesData={vaccinesData}
                    vaccineData={props.vaccineData}
                    getCardColor={getCardColor}
                    showVaccineDetails={showVaccineDetails}
                    getDuration={getDuration}
                />
            </div>

            <VaccineChart
                displayStyle="print"
                dob={dob}
                vaccinesData={vaccinesData}
                vaccineData={props.vaccineData}
                getCardColor={getCardColor}
                showVaccineDetails={showVaccineDetails}
                getDuration={getDuration}
            />
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    patientDetails: state.DefinitionReducer.patient,
    prescription: state.DefinitionReducer.prescription,
    vaccineData: state.DefinitionReducer.vaccine,
});

const mapDispatchToProps = (dispatch) => ({
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Vaccination);
