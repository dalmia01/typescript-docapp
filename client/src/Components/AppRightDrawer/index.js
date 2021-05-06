import React, { useState } from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";

import { setRightSideDrawer } from "../../reducers/ThemeOptions";
import { setSelectedOption, setDefinition, setPrescription, setMedicalHistory, setDefinitionList } from "../../reducers/DefinitionReducer";
import { setAuthLogout } from "../../actions/authActions";
import { ADD_DEFINITION, UPDATE_DEFINITION } from "../../Utils/Graphql/commonDefinitionGraphql";
import { getPrescription } from "../../Utils/common";

import FormDef from "./Components/FormDef";
import { DEFAULT_UPDATED_SUCCESS } from "../../Utils/Constants/messageConstants";
import { handleCommonError } from "../../Utils/validation";

import "./_index.scss";

const AppRightDrawer = (props) => {
    const [input, setInput] = useState({ length: 0, data: null, arr: [] });
    const [select, setSelect] = useState({ length: 0, data: null, arr: [], label: "" });
    const [radio, setRadio] = useState({ length: 0, data: null, arr: [], label: "" });
    const [check, setCheck] = useState({ length: 0, data: null, arr: [], label: "" });
    const [textarea, setTextArea] = useState({ length: 0, data: null, arr: [] });

    /**
     * add dynamic definition fields for particular item of category(symptoms, findings, diagnosis)
     */

    let [addDefinition] = useMutation(ADD_DEFINITION, {
        update: (_, data) => {
            const compareObjects = (obj1, obj2) => {
                return obj1.id === obj2.id;
            };

            let output = [];

            if (data.data.defination.category === "MedicalHistory") {
                let newMedicalHistoryItem = [...props.medicalHistory].filter((item) => {
                    if (item.id === data.data.defination.id) return item;
                });

                if (newMedicalHistoryItem.length > 0) {
                    output = [...data.data.defination.fields].filter((b) => {
                        let indexFound = newMedicalHistoryItem[0].fields.findIndex((a) => compareObjects(a, b));
                        return indexFound === -1;
                    });

                    props.medicalHistory.filter((item, index) => {
                        if (item.id === data.data.defination.id) {
                            props.medicalHistory[index].fields = item.fields.concat(output);
                        }
                    });
                }
            } else {
                let newPrescriptionItem = [...props.prescription].filter((item) => {
                    if (item.id === data.data.defination.id) return item;
                });

                if (newPrescriptionItem.length > 0) {
                    output = [...data.data.defination.fields].filter((b) => {
                        let indexFound = newPrescriptionItem[0].fields.findIndex((a) => compareObjects(a, b));
                        return indexFound === -1;
                    });

                    props.prescription.filter((item, index) => {
                        if (item.id === data.data.defination.id) {
                            props.prescription[index].fields = item.fields.concat(output);
                        }
                    });
                }
            }

            props.setSelectedOption(data.data.defination);

            props.setRightSideDrawer(false, props.rightSideDrawerContent, "", {});
            toast.success(DEFAULT_UPDATED_SUCCESS);
        },
        onError: (err) => {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    /**
     *  add dynamic definition fields for particular item of category(symptoms, findings, diagnosis)
     */

    /**
     *  updating dynamic definition field for particular item of category(symptoms, findings, diagnosis)
     */

    let [updateDefinition] = useMutation(UPDATE_DEFINITION, {
        update: (_, data) => {
            props.setSelectedOption(data.data.defination);
            props.setDefinition({});
            props.setRightSideDrawer(false, props.rightSideDrawerContent, "", {});
            toast.success(DEFAULT_UPDATED_SUCCESS);
        },
        onError: (err) => {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    const editForm = () => {
        updateDefinition({
            variables: {
                defination: JSON.stringify(props.defination),
            },
        });
        props.setRightSideDrawer(false, props.rightSideDrawerContent, "", {});
    };

    /**
     *  updating dynamic definition field for particular item of category(symptoms, findings, diagnosis)
     */

    /**
     * updating labels  of dynamuic select, radio, check fields && setting local state
     */

    const changelabel = (e, element) => {
        if (element === "selectlabel") {
            setSelect({ ...select, label: e.target.value });
        } else if (element === "radiolabel") {
            setRadio({ ...radio, label: e.target.value });
        } else if (element === "checklabel") {
            setCheck({ ...check, label: e.target.value });
        }
    };

    /**
     * updating labels  of dynamuic select, radio, check fields && setting local state
     */

    /**
     * updating values  of dynamuic created fields and setting local state
     */

    const changeField = (e, element, location) => {
        if (element === "dynamicinput") {
            setInput({ ...input, arr: [{ value: e.target.value }] });
        } else if (element === "dynamicselect") {
            let arrs = [...select.arr];
            arrs[location].options = e.target.value;
        } else if (element === "dynamicradio") {
            let arrs = [...radio.arr];
            arrs[location].options = e.target.value;
        } else if (element === "dynamiccheck") {
            let arrs = [...check.arr];
            arrs[location].options = e.target.value;
        } else if (element === "dynamictextarea") {
            setTextArea({ ...textarea, arr: [{ value: e.target.value }] });
        }
    };

    /**
     *  updating values  of dynamuic created fields and setting local state
     */

    /**
     *  enabling fields to input label asnd options for selected field type
     */

    const openContent = (type) => {
        if (type === "input") {
            let arrdata = [{ value: "" }];
            setInput((prevState) => ({ ...input, arr: arrdata }));
        } else if (type === "select") {
            let arrdata = [...select.arr, { options: "" }];
            setSelect({ ...select, arr: arrdata });
        } else if (type === "radio") {
            let arrdata = [...radio.arr, { options: "" }];
            setRadio({ ...radio, arr: arrdata });
        } else if (type === "checkbox") {
            let arrdata = [...check.arr, { options: "" }];
            setCheck({ ...check, arr: arrdata });
        } else if (type === "textarea") {
            let arrdata = [{ value: "" }];
            setTextArea((prevState) => ({ ...textarea, arr: arrdata }));
        }
    };

    /**
     * enabling fields to input label asnd options for selected field type
     */

    /**
     *  building form details , all fields names and options (if any) && call graphql request to add to database
     */

    const buildForm = () => {
        //  const formBuilderDetails = [...props.selectedOption.fields];
        const formBuilderDetails = [];

        if (input.arr.length > 0 && input.arr[0].value.trim() !== "") {
            formBuilderDetails.push({
                operator: "input",
                name: `input${uuidv4()}`,
                label: input.arr[0].value,
                optionsEnable: false,
                value: "",
            });
        }
        if (select.arr.length > 0 && select.label.trim() !== "") {
            let optionsol = [];
            for (let selectar of select.arr) {
                if (selectar.options.trim() !== "") optionsol = [...optionsol, selectar.options];
            }

            if (optionsol.length > 0) {
                formBuilderDetails.push({
                    operator: "select",
                    name: `select${uuidv4()}`,
                    label: select.label,
                    optionsEnable: true,
                    value: optionsol[0],
                    possible_values: [...optionsol],
                });
            }
        }
        if (radio.arr.length > 0 && radio.label.trim() !== "") {
            let optionsol = [];
            for (let selectar of radio.arr) {
                if (selectar.options.trim() !== "") optionsol = [...optionsol, selectar.options];
            }

            if (optionsol.length > 0) {
                formBuilderDetails.push({
                    operator: "radio",
                    name: `radio${uuidv4()}`,
                    label: radio.label,
                    optionsEnable: true,
                    value: optionsol[0],
                    possible_values: optionsol,
                });
            }
        }
        if (check.arr.length > 0 && check.label.trim() !== "") {
            let optionsol = [];
            for (let selectar of check.arr) {
                if (selectar.options.trim() !== "") optionsol = [...optionsol, selectar.options];
            }

            if (optionsol.length > 0) {
                formBuilderDetails.push({
                    operator: "checkbox",
                    name: `checkbox${uuidv4()}`,
                    label: check.label,
                    optionsEnable: true,
                    value: optionsol[0],
                    possible_values: optionsol,
                });
            }
        }
        if (textarea.arr.length > 0 && textarea.arr[0].value.trim() !== "") {
            formBuilderDetails.push({
                operator: "textarea",
                name: `textarea${uuidv4()}`,
                label: textarea.arr[0].value,
                optionsEnable: false,
                value: "",
            });
        }

        if (Object.keys(props.rightSideDrawerOthers).length > 0) {
            addDefinition({
                variables: {
                    name: props.rightSideDrawerOthers.name,
                    category: props.rightSideDrawerOthers.category,
                    fields: JSON.stringify(formBuilderDetails),
                    patient_id: "",
                },
            });
        } else {
            addDefinition({
                variables: {
                    id: props.selectedOption.id,
                    name: props.selectedOption.name,
                    category: props.selectedOption.category,
                    fields: JSON.stringify(formBuilderDetails),
                    patient_id: "",
                },
            });
        }

        setInput({ length: 0, data: null, arr: [] });
        setSelect({ length: 0, data: null, arr: [], label: "" });
        setRadio({ length: 0, data: null, arr: [], label: "" });
        setCheck({ length: 0, data: null, arr: [], label: "" });
        setTextArea({ length: 0, data: null, arr: [] });
    };

    /**
     * building form details , all fields names and options (if any) && call graphql request to add to database
     */

    /**
     * close right side drawer
     */

    const closeForm = () => {
        setInput({ length: 0, data: null, arr: [] });
        setSelect({ length: 0, data: null, arr: [], label: "" });
        setRadio({ length: 0, data: null, arr: [], label: "" });
        setCheck({ length: 0, data: null, arr: [], label: "" });
        setTextArea({ length: 0, data: null, arr: [] });

        props.setRightSideDrawer(false, props.rightSideDrawerContent, "", {});
        props.setDefinition({});
    };

    /**
     *  close right side drawer
     */

    /**
     * adding options && setting redux state (Defination) from select, radio, checkbox type field
     */

    const addToMultiOptions = () => {
        props.setDefinition({
            ...props.defination,
            field: {
                ...props.defination.field,
                possible_values: props.defination.field.possible_values.concat(""),
            },
        });
    };

    /**
     *  adding options && setting redux state (Defination) from select, radio, checkbox type field
     */

    /**
     *  on change edit label handler && set redux  state for defination
     */

    const editLabelHandler = (e) => {
        props.setDefinition({
            ...props.defination,
            field: {
                ...props.defination.field,
                label: e.target.value,
            },
        });
    };

    /**
     *  on change edit label handler && set redux  state for defination
     */

    /**
     *  on change edit options value handler && set redux  state for defination
     */

    const optionsChangeHandler = (e, index) => {
        props.defination.field.possible_values[index] = e.target.value;

        props.setDefinition({
            ...props.defination,
        });
    };

    /**
     * on change edit options value handler && set redux  state for defination
     */

    /**
     *  setting right drawer width
     */
    let drawerWidthClassName;

    if (["AddCommonDef"].includes(props.rightSideDrawerContentType)) {
        drawerWidthClassName = "width-500";
    } else if (["EditCommonDef", "FavouritePrescriptions"].includes(props.rightSideDrawerContentType)) {
        drawerWidthClassName = "width-300";
    }
    /**
     *  setting right drawer width
     */

    // set prescription from favourite prescription
    const setFavouritePrescription = (favPrescription) => {
        if (Object.keys(favPrescription).length > 0) {
            let favInitialPrescription = getPrescription(favPrescription, props.patient);
            props.setPrescription(favInitialPrescription);
            props.setSelectedOption({});

            //  props.setDefinitionList({...props.definitionList,})
        }

        let category = props.definitionList.all[0].category[0].toLowerCase() + props.definitionList.all[0].category.substr(1);

        let favPrescriptionIDs = favPrescription[category].map((item) => item.defination);

        let selected = props.definitionList.all.filter((item) => favPrescriptionIDs.indexOf(item.id) > -1),
            nonSelected = props.definitionList.all.filter((item) => favPrescriptionIDs.indexOf(item.id) <= -1);

        props.setDefinitionList({ ...props.definitionList, selected, nonSelected });
        props.setRightSideDrawer(false, props.rightSideDrawerContent, "", {});
    };

    return (
        <React.Fragment>
            <div
                className={
                    props.isRightSideDrawerVisible
                        ? `right-side-drawer ${drawerWidthClassName} visible`
                        : `right-side-drawer ${drawerWidthClassName}`
                }
            >
                <FormDef
                    closeForm={closeForm}
                    input={input}
                    openContent={openContent}
                    changelabel={changelabel}
                    changeField={changeField}
                    select={select}
                    radio={radio}
                    check={check}
                    textarea={textarea}
                    buildForm={buildForm}
                    defination={props.defination}
                    editLabelHandler={editLabelHandler}
                    optionsChangeHandler={optionsChangeHandler}
                    addToMultiOptions={addToMultiOptions}
                    editForm={editForm}
                    contentyType={props.rightSideDrawerContentType}
                    setFavouritePrescription={setFavouritePrescription}
                />
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    selectedOption: state.DefinitionReducer.selectedOption,
    isRightSideDrawerVisible: state.ThemeOptions.isRightSideDrawerVisible,
    rightSideDrawerContent: state.ThemeOptions.rightSideDrawerContent,
    defination: state.DefinitionReducer.defination,
    rightSideDrawerContentType: state.ThemeOptions.rightSideDrawerContentType,
    prescription: state.DefinitionReducer.prescription,
    medicalHistory: state.DefinitionReducer.medicalHistory,
    rightSideDrawerOthers: state.ThemeOptions.rightSideDrawerOthers,
    patient: state.DefinitionReducer.patient,
    definitionList: state.DefinitionReducer.definitionList,
});

const mapDispatchToProps = (dispatch) => ({
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers)),

    setSelectedOption: (selectedOption) => dispatch(setSelectedOption(selectedOption)),
    setDefinitionList: (definitionList) => dispatch(setDefinitionList(definitionList)),
    setDefinition: (definition) => dispatch(setDefinition(definition)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setMedicalHistory: (medicalHistory) => dispatch(setMedicalHistory(medicalHistory)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRightDrawer);
