import React, { useEffect } from "react";
import { Modal, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/react-hooks";
import { updateVaccineDetails } from "../../reducers/DefinitionReducer";
import { setAuthLogout } from "../../actions/authActions";
import "./_index.scss";
import SelectBox from "./SelectBox";
import { UPDATE_VACCINATION } from "../../Utils/Graphql/patientsGraphql";
import { handleCommonError } from "../../Utils/validation";
class DateView extends React.Component {
    render() {
        let value = this.props.value === "" ? this.props.placeholderText : this.props.value;
        return (
            <Input
                type="button"
                value={this.props.disabled ? this.props.placeholderText : value}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
                placeholder={this.props.placeholderText}
            />
        );
    }
}
// coms
const VaccineModal = (props) => {
    const [notes, setNotes] = React.useState("");
    const [givenDate, setGivenDate] = React.useState("");
    const [dueDate, setDueDate] = React.useState("");
    const [medicineBrand, setMedicineBrand] = React.useState("-1");

    useEffect(() => {
        const existingEntry =
            props.vaccine.find((item) => {
                return item.range === props.vaccineModalContent.range && item.medicine_name === props.vaccineModalContent.medicine_name;
            }) || {};

        setNotes(existingEntry.notes || "");
        setGivenDate((existingEntry.given_date && new Date(existingEntry.given_date)) || "");
        setDueDate((existingEntry.due_date && new Date(existingEntry.due_date)) || "");
        setMedicineBrand(existingEntry.medicine_brand || "-1");
    }, []);

    // make call to delete definition field
    let [updateVaccinationMutation] = useMutation(UPDATE_VACCINATION, {
        update: (_, data) => {
            props.setVaccineModalVisibility(false);
            props.updateVaccineDetails(data.data.vaccine || []);
            toast.success("Updated");
        },
        onError: (err) => {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    const upsertVaccineChartDetails = () => {
        if (medicineBrand === "-1" && givenDate) {
            toast.error("Select Medicine Brand");
            return 0;
        }
        if (!givenDate && !dueDate) {
            toast.error("Given Date or Due Date is mandatory");
            return 0;
        }
        const newVaccineState = [...props.vaccine];
        const existingEntry = newVaccineState.find((item) => {
            return item.range === props.vaccineModalContent.range && item.medicine_name === props.vaccineModalContent.medicine_name;
        });
        if (existingEntry) {
            existingEntry.given_date = givenDate || "";
            existingEntry.due_date = dueDate || "";
            existingEntry.medicine_brand = medicineBrand || "-1";
            existingEntry.notes = notes;
            updateVaccinationMutation({
                variables: {
                    id: props.patientDetails.id,
                    data: JSON.stringify(existingEntry),
                },
            });
        } else {
            const vaccine = {
                range: props.vaccineModalContent.range,
                vaccine_group_name: props.vaccineModalContent.vaccine_group_name,
                medicine_name: props.vaccineModalContent.medicine_name,
                medicine_brand: medicineBrand,
                notes: notes,
                given_date: givenDate || "",
                due_date: dueDate || "",
            };
            newVaccineState.push(vaccine);
            updateVaccinationMutation({
                variables: {
                    id: props.patientDetails.id,
                    data: JSON.stringify(vaccine),
                },
            });
        }
    };
    return (
        <Modal isOpen={props.isOpen}>
            <div className="modal-header">
                <h5 className="modal-title">{props.vaccineModalContent.medicine_name}</h5>
                <button className="close" onClick={() => props.setVaccineModalVisibility(false)}>
                    ×
                </button>
            </div>
            <div className="modal-body">
                <form className="">
                    <div className="form-row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="exampleEmail11" className="">
                                    Vaccination note
                                </label>
                                <Input
                                    type="textarea"
                                    placeholder="add vaccination note"
                                    value={notes}
                                    onChange={(event) => setNotes(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="examplePassword11" className="">
                                    Given Date
                                </label>
                                <div>
                                    <DatePicker
                                        selected={givenDate}
                                        onChange={(date) => setGivenDate(date)}
                                        customInput={<DateView placeholderText="Select Given Date" className="flex-content" />}
                                        className="flex-content"
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown
                                        showMonthDropdown
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="examplePassword11" className="">
                                    Due Date
                                </label>
                                <div>
                                    <DatePicker
                                        selected={dueDate}
                                        onChange={(date) => setDueDate(date)}
                                        customInput={<DateView placeholderText="Select Due Date" className="flex-content" />}
                                        className="flex-content"
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown
                                        showMonthDropdown
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <SelectBox
                            selectHandler={(event) => setMedicineBrand(event.target.value)}
                            value={medicineBrand}
                            defaultText="Select Brand"
                            options={props.vaccineModalContent.medicine_brands}
                        />
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-link" onClick={() => props.setVaccineModalVisibility(false)}>
                    Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={upsertVaccineChartDetails}>
                    Save
                </button>
            </div>
        </Modal>
    );
};

const mapStateToProps = (state) => ({
    patientDetails: state.DefinitionReducer.patient,
    vaccine: state.DefinitionReducer.vaccine,
});

const mapDispatchToProps = (dispatch) => ({
    updateVaccineDetails: (details) => dispatch(updateVaccineDetails(details)),
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VaccineModal);
