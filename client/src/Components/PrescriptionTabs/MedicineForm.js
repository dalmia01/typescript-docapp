import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, FormGroup, Label } from "reactstrap";
import CustomSelect from "../Common/CustomSelect";
import { setRightSideDrawer } from "../../reducers/ThemeOptions";
import { setPrescription } from "../../reducers/DefinitionReducer";
import "./medicineForm.scss";
import { SelectField, InputField, RadioField, CheckField } from "./UI/MedicineFormFields";
import SelectView from "../Common/SelectView";

const MedicineForm = (props) => {
    /**
     *   on change saving prescription and persiting dynamic form data
     */

    const valuesChangeHandler = (e) => {
        if (e.target && (e.target.name === "meals" || e.target.name === "timings")) {
            if (e.target.checked) {
                // add the numerical value of the checkbox to options array
                [...props.selectedOption.fields].map((item) => {
                    if (item.name === e.target.name) {
                        item.value = item.value
                            ? item.value.includes(e.target.value)
                                ? item.value
                                : item.value + "-" + e.target.value
                            : e.target.value;
                    }
                });
            } else {
                [...props.selectedOption.fields].map((item) => {
                    if (item.name === e.target.name) {
                        let items = item.value.split("-");
                        let index = items.indexOf(e.target.value);
                        items.splice(index, 1);
                        item.value = items.join("-");
                    }
                });
                // or remove the value from the unchecked checkbox from the array
            }
        } else {
            if (!e.target) {
                [...props.selectedOption.fields].map((item) => {
                    if (item.name === "dosageForm") {
                        item.value = e;
                    }
                });
            } else {
                [...props.selectedOption.fields].map((item) => {
                    if (item.name === e.target.name) {
                        item.value = e.target.value;
                    }
                });
            }
        }

        if (props.prescription.length > 0) {
            let prescriptionIndex = props.prescription.findIndex((item) => {
                return item.id === props.selectedOption.id;
            });

            if (prescriptionIndex >= 0) {
                props.prescription[prescriptionIndex].fields = props.selectedOption.fields;

                props.setPrescription([...props.prescription]);
            } else {
                props.setPrescription([...props.prescription, props.selectedOption]);
            }
        } else {
            props.setPrescription([...props.prescription, props.selectedOption]);
        }
    };

    /**
     *   on change saving prescription and persiting dynamic form data
     */

    /**
     * dynamic input field
     */
    const dynamicInputField = (beforeValue, afterValue) => {
        return (
            <InputField
                inputType="text"
                someType="timings"
                name={beforeValue}
                valuesChangeHandler={valuesChangeHandler}
                value={
                    props.selectedOption.fields.find((item) => item.name === beforeValue && item.value) &&
                    props.selectedOption.fields.find((item) => item.name === beforeValue && item.value).value
                }
                readOnly={
                    props.selectedOption.fields.find((item) => item.name === afterValue && item.value) &&
                    props.selectedOption.fields.find((item) => item.name === afterValue && item.value).value
                        ? true
                        : false
                }
            />
        );
    };

    const dynamicColInputField = (num, dayTime, beforeValue, afterValue) => {
        return (
            <Col md={num}>
                <Row>
                    <div style={{ textAlign: "center" }}>{dayTime}</div>
                    <Row>
                        <Col md={dayTime !== "Evening" ? 5 : 10}>
                            <div>
                                {dynamicInputField(beforeValue, afterValue)}

                                <div>Before</div>
                            </div>
                        </Col>
                        {dayTime !== "Evening" && (
                            <Col md={5}>
                                <div>
                                    {dynamicInputField(afterValue, beforeValue)}

                                    <div>After</div>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Row>
            </Col>
        );
    };

    return (
        <Form>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label for="dosageQuantity">Dosage Quantiy</Label>
                        <InputField
                            name="dosageQuantity"
                            valuesChangeHandler={valuesChangeHandler}
                            value={
                                props.selectedOption.fields.find((item) => item.name === "dosageQuantity" && item.value) &&
                                props.selectedOption.fields.find((item) => item.name === "dosageQuantity" && item.value).value
                            }
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <label>Dosage Type</label>
                    <FormGroup tag="fieldset">
                        <RadioField
                            name="dosageType"
                            value="frequency"
                            checked={
                                props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) &&
                                props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value).value === "frequency"
                            }
                            valuesChangeHandler={valuesChangeHandler}
                        />
                        <RadioField
                            name="dosageType"
                            value="timings"
                            checked={
                                props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) &&
                                props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value).value === "timings"
                            }
                            valuesChangeHandler={valuesChangeHandler}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Row
                style={{
                    display:
                        props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) &&
                        props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value).value === "meals"
                            ? "none"
                            : "none",
                }}
            >
                <Col md={12}>
                    <label>Meals</label>

                    <FormGroup style={{ marginLeft: "20px" }}>
                        <Row>
                            {dynamicColInputField(4, "BreakFast", "mealsBreakFastBefore", "mealsBreakFastAfter")}
                            {dynamicColInputField(4, "Lunch", "mealsLunchBefore", "mealsLunchAfter")}
                            {dynamicColInputField(4, "Dinner", "mealsDinnerBefore", "mealsDinnerAfter")}
                        </Row>
                    </FormGroup>
                </Col>
            </Row>

            <Row
                style={{
                    display:
                        props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) &&
                        props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value).value === "frequency"
                            ? "block"
                            : "none",
                }}
            >
                <Col md={12}>
                    <div>
                        <label>Meal Type</label>
                        <FormGroup tag="fieldset">
                            <RadioField
                                name="frequencyMealType"
                                value="Before Meal"
                                checked={
                                    props.selectedOption.fields.find((item) => item.name === "frequencyMealType" && item.value) &&
                                    props.selectedOption.fields.find((item) => item.name === "frequencyMealType" && item.value).value ===
                                        "Before Meal"
                                }
                                valuesChangeHandler={valuesChangeHandler}
                            />
                            <RadioField
                                name="frequencyMealType"
                                value="After Meal"
                                checked={
                                    props.selectedOption.fields.find((item) => item.name === "frequencyMealType" && item.value) &&
                                    props.selectedOption.fields.find((item) => item.name === "frequencyMealType" && item.value).value ===
                                        "After Meal"
                                }
                                valuesChangeHandler={valuesChangeHandler}
                            />
                        </FormGroup>
                    </div>

                    <FormGroup tag="fieldset" disabled>
                        {props.selectedOption.fields.find((item) => item.name === "frequency" && item.possible_values) &&
                            props.selectedOption.fields
                                .find((item) => item.name === "frequency" && item.possible_values)
                                .possible_values.map((field, index) => (
                                    <RadioField
                                        key={"frequency" + index}
                                        name="frequency"
                                        value={field}
                                        disabled={
                                            props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) ===
                                                undefined ||
                                            (props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) &&
                                                props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value)
                                                    .value !== "frequency")
                                        }
                                        checked={
                                            (props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) ===
                                                undefined &&
                                                false) ||
                                            (props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) &&
                                                props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value)
                                                    .value === "frequency" &&
                                                props.selectedOption.fields.find((item) => item.name === "frequency" && item.value) &&
                                                props.selectedOption.fields.find((item) => item.name === "frequency" && item.value)
                                                    .value === field)
                                        }
                                        valuesChangeHandler={valuesChangeHandler}
                                        textValue={field === "custom" ? "custom" : `Every ${field} hours `}
                                    />
                                ))}

                        <Row
                            style={{
                                display:
                                    props.selectedOption.fields.find((item) => item.name === "frequency" && item.value) &&
                                    props.selectedOption.fields.find((item) => item.name === "frequency" && item.value).value === "custom"
                                        ? "flex"
                                        : "none",
                            }}
                        >
                            <Col md={4}>
                                <FormGroup style={{ marginTop: "5px" }}>
                                    <InputField
                                        inputType={"number"}
                                        min={1}
                                        name="customFrequencyValue"
                                        valuesChangeHandler={valuesChangeHandler}
                                        value={
                                            props.selectedOption.fields.find(
                                                (item) => item.name === "customFrequencyValue" && item.value
                                            ) &&
                                            props.selectedOption.fields.find((item) => item.name === "customFrequencyValue" && item.value)
                                                .value
                                        }
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={4}>
                                <SelectField
                                    name="customFrequency"
                                    value={
                                        props.selectedOption.fields.find((item) => item.name === "customFrequency" && item.value) &&
                                        props.selectedOption.fields.find((item) => item.name === "customFrequency" && item.value).value
                                    }
                                    valuesChangeHandler={valuesChangeHandler}
                                    possible_values={
                                        props.selectedOption.fields.find(
                                            (item) => item.name === "customFrequency" && item.possible_values
                                        ) &&
                                        props.selectedOption.fields.find((item) => item.name === "customFrequency" && item.possible_values)
                                            .possible_values
                                    }
                                />
                            </Col>
                        </Row>
                    </FormGroup>
                </Col>
            </Row>

            <Row
                style={{
                    display:
                        props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value) &&
                        props.selectedOption.fields.find((item) => item.name === "dosageType" && item.value).value === "timings"
                            ? "block"
                            : "none",
                }}
            >
                <Col md={12}>
                    <label>Timings</label>
                    <FormGroup style={{ marginLeft: "20px" }}>
                        <Row>
                            {dynamicColInputField(4, "Morning", "timingsMorningBefore", "timingsMorningAfter")}
                            {dynamicColInputField(4, "Afternoon", "timingsAfternoonBefore", "timingsAfternoonAfter")}
                            {dynamicColInputField(4, "Night", "timingsNightBefore", "timingsNightAfter")}
                        </Row>
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <FormGroup>
                        <SelectView
                            label={"Duration (medication period)"}
                            name={"duration"}
                            options={
                                props.selectedOption.fields.find((item) => item.name === "duration" && item.possible_values) &&
                                props.selectedOption.fields.find((item) => item.name === "duration" && item.possible_values).possible_values
                            }
                            value={
                                props.selectedOption.fields.find((item) => item.name === "duration" && item.value) &&
                                props.selectedOption.fields.find((item) => item.name === "duration" && item.value).value
                            }
                            valuesChangeHandler={valuesChangeHandler}
                            icons={false}
                        />
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    );
};

const mapStateToProps = (state) => ({
    rightSideDrawerContent: state.ThemeOptions.rightSideDrawerContent,
    prescription: state.DefinitionReducer.prescription,
    selectedOption: state.DefinitionReducer.selectedOption,
});

const mapDispatchToProps = (dispatch) => ({
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MedicineForm);
