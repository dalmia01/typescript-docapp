import React from "react";
import { Form, Row, Col, FormGroup, Label, Button } from "reactstrap";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { setPrescription } from "../../reducers/DefinitionReducer";
import { SelectField, TextField } from "./UI/MedicineFormFields";
import "./assets/scss/_multiple-select.scss";
import SelectView from "../Common/SelectView";

class DateView extends React.Component {
    render() {
        return (
            <Button outline className="mb-2 mr-2 btn-transition" color="primary" onClick={this.props.onClick} style={{ width: "100%" }}>
                {this.props.value || "No Follow-up date"}
            </Button>
        );
    }
}

const Others = (props) => {
    const others = props.prescription.find((item) => item.category === "Others") || {};
    // intiial form values
    let [formValues, setFormValues] = React.useState({
        additionalNotes:
            others.fields && others.fields.additionalNotes,
        patientNotes:
            (others.fields && others.fields.patientNotes) || (props.patient && props.patient.notes) || "",
        days:
            others.fields && others.fields.days,
        followUpDate:
            (others.fields && others.fields.followUpDate && others.fields.followUpDate) || null,
    });
    // on change of form fields set prescription values
    const valuesChangeHandler = (e) => {
        if (!e.target && e === "days") {
            setFormValues({ ...formValues, days: null, followUpDate: null });
            props.prescription.forEach((item) => {
                if (item.category === "Others") {
                    item.fields.days = null;
                    item.fields.followUpDate = null;
                }
            });
            props.setPrescription([...props.prescription]);
        } else {
            setFormValues({ ...formValues, [e.target.name]: e.target.value });

            props.prescription.forEach((item) => {
                if (item.category === "Others") {
                    item.fields[e.target.name] = e.target.value;
                }
            });
            if (e.target.name === "days") {
                setFormValues({
                    ...formValues,
                    days: e.target.value,
                    followUpDate: new Date().getTime() + Number(e.target.value) * 86400000,
                });
                props.prescription.forEach((item) => {
                    if (item.category === "Others") {
                        item.fields.followUpDate = new Date().getTime() + Number(e.target.value) * 86400000;
                    }
                });
            }

            props.setPrescription([...props.prescription]);
        }
    };

    // setting follow up date
    const settingDateHandler = (date) => {
        //   let modifiedDate = getModifiedDate(date);
        setFormValues({ ...formValues, followUpDate: date });
        props.prescription.forEach((item) => {
            if (item.category === "Others") {
                item.fields.followUpDate = date;
            }
        });
        props.setPrescription([...props.prescription]);
    };

    React.useEffect(() => {
        // adding others field to prescription if not present
        if (props.prescription.findIndex((item) => item.category === "Others") < 0) {
            props.setPrescription([
                ...props.prescription,
                {
                    id: uuidv4(),
                    name: "Others",
                    category: "Others",
                    fields: {
                        additionalNotes: "",
                        patientNotes: "",
                        days: null,
                        followUpDate: null,
                    },
                },
            ]);
        }
    });

    return (
        <Form>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label for="additionalNotes">Additional Notes</Label>

                        <TextField name="additionalNotes" value={formValues.additionalNotes} valuesChangeHandler={valuesChangeHandler} />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="patientNotes">Personal Notes (not printed)</Label>

                        <TextField name="patientNotes" value={formValues.patientNotes} valuesChangeHandler={valuesChangeHandler} />
                    </FormGroup>
                </Col>
            </Row>
            <Label for="days">Follow-up date</Label>
            <Row>
                <Col md={9}>
                    <SelectView
                        name="days"
                        options={[
                            { text: "1 day", value: "1" },
                            { text: "2 days", value: "2" },
                            { text: "3 days", value: "3" },
                            { text: "4 days", value: "4" },
                            { text: "5 days", value: "5" },
                            { text: "1 week", value: "7" },
                            { text: "2 weeks", value: "14" },
                            { text: "1 month", value: "30" },
                        ]}
                        value={formValues.days}
                        possible_values={["1", "2", "3", "4", "5", "7", "14", "30"]}
                        text={["1 day", "2 day", "3 day", "4 day", "5 day", "1 week", "2 weeks", "1 month"]}
                        valuesChangeHandler={(e) => valuesChangeHandler(e)}
                    />
                </Col>
                <Col md={3}>
                    <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={formValues.followUpDate}
                        onChange={(date) => settingDateHandler(date)}
                        popperClassName="datepicker-poper"
                        showPopperArrow={false}
                        minDate={new Date()}
                        showYearDropdown
                        showMonthDropdown
                        customInput={<DateView />}
                    />
                </Col>
            </Row>
        </Form>
    );
};

const mapStateToProps = (state) => ({
    prescription: state.DefinitionReducer.prescription,
    patient: state.DefinitionReducer.patient
});

const mapDispatchToProps = (dispatch) => ({
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Others);
