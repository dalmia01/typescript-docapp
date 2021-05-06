import React from "react";
import { connect } from "react-redux";

import { InputField, Radio, CheckBox, TextArea } from "./UI/FormFields";
import { setRightSideDrawer } from "../../reducers/ThemeOptions";
import { setPrescription } from "../../reducers/DefinitionReducer";
import SelectView from "../Common/SelectView";

const DynamicForm = (props) => {
    const definitionEdit = (element) => {
        props.editDefinition(element);
        props.setRightSideDrawer(true, props.rightSideDrawerContent, "EditCommonDef", {});
    };

    /**
     *   on change saving prescription and persiting dynamic form data
     */

    const inputChange = (e) => {
        if (e.target) {
            [...props.selectedOption.fields].map((item) => {
                if (item.name === e.target.name) {
                    item.value = e.target.value;
                }
            });

            if (props.prescription.length > 0) {
                let prescriptionIndex = props.prescription.findIndex((item) => {
                    return item.id === props.selectedOption.id;
                });

                if (prescriptionIndex >= 0) {
                    for (let element of props.prescription) {
                        [...element.fields].map((item) => {
                            if (item.name === e.target.name) {
                                item.value = e.target.value;
                            }
                        });
                    }

                    props.setPrescription([...props.prescription]);
                } else {
                    props.setPrescription([...props.prescription, props.selectedOption]);
                }
            } else {
                props.setPrescription([...props.prescription, props.selectedOption]);
            }
        } else {
            [...props.selectedOption.fields].map((item) => {
                if (item.name === e) {
                    item.value = "";
                }
            });

            if (props.prescription.length > 0) {
                let prescriptionIndex = props.prescription.findIndex((item) => {
                    return item.id === props.selectedOption.id;
                });

                if (prescriptionIndex >= 0) {
                    for (let element of props.prescription) {
                        [...element.fields].map((item) => {
                            if (item.name === e) {
                                item.value = "";
                            }
                        });
                    }

                    props.setPrescription([...props.prescription]);
                } else {
                    props.setPrescription([...props.prescription, props.selectedOption]);
                }
            } else {
                props.setPrescription([...props.prescription, props.selectedOption]);
            }
        }
    };

    /**
     *   on change saving prescription and persiting dynamic form data
     */

    return props.selectedOption.fields.map((formField, index) => {
        let definitionData =
            props.category === "MedicalHistory"
                ? props.medicalHistory.find((ele) => ele.id === props.selectedOption.id)
                : props.prescription.find((ele) => ele.id === props.selectedOption.id);

        let someValue = undefined;

        if (definitionData) {
            definitionData.fields.find((ele) => {
                if (ele.id === formField.id) {
                    someValue = ele.value || undefined;
                }
            });
        }

        //  let fieldData = definitionData ? definitionData.fields.find((ele) => ele.id === formField.id) : { value: undefined };

        switch (formField.operator) {
            case "input":
                return (
                    <InputField
                        item={formField}
                        key={formField.id}
                        name={formField.id}
                        value={someValue || ""}
                        editDefinition={() => definitionEdit(formField)}
                        inputChange={props.category !== "MedicalHistory" ? inputChange : props.medHistoryFormValueChange}
                        deleteDefinationField={() => props.deleteDefinationField(formField)}
                    />
                );
            case "select":
                return (
                    <SelectView
                        label={formField.label}
                        item={formField}
                        key={formField.id}
                        name={formField.name}
                        options={formField.possible_values}
                        value={someValue || ""}
                        editDefinition={() => definitionEdit(formField)}
                        valuesChangeHandler={props.category !== "MedicalHistory" ? inputChange : props.medHistoryFormValueChange}
                        deleteDefinationField={() => props.deleteDefinationField(formField)}
                        icons={true}
                    />
                );
            case "radio":
                return (
                    <Radio
                        item={formField}
                        key={formField.id}
                        name={formField.id}
                        value={someValue || (formField.possible_values && formField.possible_values[0])}
                        editDefinition={() => definitionEdit(formField)}
                        inputChange={props.category !== "MedicalHistory" ? inputChange : props.medHistoryFormValueChange}
                        deleteDefinationField={() => props.deleteDefinationField(formField)}
                    />
                );
            case "checkbox":
                return (
                    <CheckBox
                        item={formField}
                        key={formField.id}
                        name={formField.id}
                        value={someValue || (formField.possible_values && formField.possible_values[0])}
                        editDefinition={() => definitionEdit(formField)}
                        inputChange={props.category !== "MedicalHistory" ? inputChange : props.medHistoryFormValueChange}
                        deleteDefinationField={() => props.deleteDefinationField(formField)}
                    />
                );
            case "textarea":
                return (
                    <TextArea
                        item={formField}
                        key={formField.id}
                        name={formField.id}
                        value={someValue || ""}
                        editDefinition={() => definitionEdit(formField)}
                        inputChange={props.category !== "MedicalHistory" ? inputChange : props.medHistoryFormValueChange}
                        deleteDefinationField={() => props.deleteDefinationField(formField)}
                    />
                );
            default:
                return null;
        }
    });
};

const mapStateToProps = (state) => ({
    rightSideDrawerContent: state.ThemeOptions.rightSideDrawerContent,
    prescription: state.DefinitionReducer.prescription,
    selectedOption: state.DefinitionReducer.selectedOption,
    medicalHistory: state.DefinitionReducer.medicalHistory,
});

const mapDispatchToProps = (dispatch) => ({
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DynamicForm);
