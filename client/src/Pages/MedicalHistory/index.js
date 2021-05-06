import React from "react";
import { connect } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { toast, Bounce } from "react-toastify";

import DefinationService from "../../Components/DefinitionService";
import ConfirmModal from "../../Components/Common/ConfirmModal";

import {
    setSelectedOption,
    setPrescription,
    setDefinitionList,
    setMedicalHistory,
    setSpecificPatient,
} from "../../reducers/DefinitionReducer";
import { setRightSideDrawer } from "../../reducers/ThemeOptions";
import { setAuthLogout } from "../../actions/authActions";
import MedHistory from "../../Components/MedHistory";
import { SAVE_MEDICAL_HISTORY } from "../../Utils/Graphql/patientsGraphql";

const MedicalHistory = (props) => {
    // succes medical history message
    const toastMsg = (msg) => {
        toast(msg, {
            transition: Bounce,
            closeButton: true,
            autoClose: 2000,
            position: "bottom-center",
            type: "success",
        });

        setTimeout(() => {
            props.setMedicalHistory([]);
            props.setRSelectedOption(1);
        }, 2000);
    };

    // saving medical history
    let [saveMedicalHistory] = useMutation(SAVE_MEDICAL_HISTORY, {
        variables: {
            patient_id: props.patient.id,
            data: JSON.stringify(props.medicalHistory),
        },
        update(_, data) {
            props.setSpecificPatient(data.data.patient);
            toastMsg("Medical History saved successfully");
        },
        onError(err) {},
    });

    /**
     *   setting confirm delete state
     */

    let [confirmDelete, setConfirmDelete] = React.useState({ visibility: false });
    const [filterSelect, setFilterSelect] = React.useState("");

    const [medHistoryUiVisibility, setMedHistoryUiVisibility] = React.useState(true);

    const confirmItemDeleteHandler = () => {
        setConfirmDelete({ visibility: true });
    };

    /**
     *   setting definiton list on selection or removal from Defintion list or selected defintions respectively
     */
    // add a definition from list of option
    const addFromSelectOptions = (e, element) => {
        if (e.target.className.includes("selct-single-item")) {
            e.target.className = "selct-single-item  animate-out";
        } else {
            e.target.parentElement.className = "selct-single-item  animate-out";
        }

        setTimeout(() => {
            let removeFromOptions = [...props.definitionList.nonSelected].filter((field) => {
                return !(field.id === element.id);
            });

            props.setDefinitionList({ selected: [...props.definitionList.selected, element], nonSelected: removeFromOptions });
        }, 100);

        setMedHistoryUiVisibility(false);
    };

    // remove from selected definition
    const removeFromSelectedOptions = (e, element) => {
        if (element.id === props.selectedOption.id) {
            props.setSelectedOption({});
        }

        let removeFromMedHistory = props.medicalHistory.filter((item) => {
            return item.id !== element.id;
        });

        props.setMedicalHistory(removeFromMedHistory);

        setTimeout(() => {
            let removeFromSelectedOptions = [...props.definitionList.selected].filter((field) => {
                if (!(field.id === element.id)) return field;
            });
            props.setDefinitionList({ selected: removeFromSelectedOptions, nonSelected: [...props.definitionList.nonSelected, element] });
        }, 100);
    };

    // medicine form values change
    const medHistoryFormValueChange = (e) => {
        [...props.selectedOption.fields].map((item) => {
            if (item.name === e.target.name) {
                item.value = e.target.value;
            }
        });

        if (props.medicalHistory.length > 0) {
            let medHistoryIndex = props.medicalHistory.findIndex((item) => {
                return item.id === props.selectedOption.id;
            });

            if (medHistoryIndex >= 0) {
                for (let element of props.medicalHistory) {
                    [...element.fields].map((item) => {
                        if (item.name === e.target.name) {
                            item.value = e.target.value;
                        }
                    });
                }

                props.setMedicalHistory([...props.medicalHistory]);
            } else {
                props.setMedicalHistory([...props.medicalHistory, props.selectedOption]);
            }
        } else {
            props.setMedicalHistory([...props.medicalHistory, props.selectedOption]);
        }
    };

    // save history handler
    const saveMedicalHistoryHandler = () => {
        saveMedicalHistory();
    };

    React.useEffect(() => {
        if (props.patient.medical_history.length > 0) {
            let medHistory = [...props.patient.medical_history].map((item) => {
                return {
                    id: item.defination,
                    name: item.name,
                    category: "MedicalHistory",
                    fields: [...item.data],
                };
            });
            props.setMedicalHistory(medHistory);
        } else {
            props.setMedicalHistory([]);
        }
    }, []);

    return (
        <div>
            <DefinationService category={"MedicalHistory"} clickable={true}>
                {({
                    removeSelectedItem,
                    editDefinition,
                    deleteDefinationField,
                    viewOption,
                    specificLoad,
                    fetchDefinitions,
                    addDefination,
                }) => (
                    <div>
                        <ConfirmModal
                            isOpen={confirmDelete.visibility}
                            titleContent="Are You Sure You Want To Delete?"
                            setConfirmDelete={setConfirmDelete}
                            deleteConfirmHandler={removeSelectedItem}
                        />

                        <div className="grid-row">
                            <MedHistory
                                category={"MedicalHistory"}
                                addDefination={addDefination}
                                selectedDefinitions={props.definitionList.selected || []}
                                selectedOption={props.selectedOption}
                                viewOption={viewOption}
                                removeFromSelectedOptions={removeFromSelectedOptions}
                                filterSelect={filterSelect}
                                setFilterSelect={setFilterSelect}
                                selectOptions={props.definitionList.nonSelected || []}
                                addFromSelectOptions={addFromSelectOptions}
                                specificLoad={specificLoad}
                                confirmItemDeleteHandler={confirmItemDeleteHandler}
                                editDefinition={editDefinition}
                                deleteDefinationField={deleteDefinationField}
                                setSelectedOption={props.setSelectedOption}
                                fetchDefinitions={fetchDefinitions}
                                definitionList={props.definitionList}
                                medHistoryUiVisibility={medHistoryUiVisibility}
                                setMedHistoryUiVisibility={setMedHistoryUiVisibility}
                                medHistoryFormValueChange={medHistoryFormValueChange}
                                saveMedicalHistoryHandler={saveMedicalHistoryHandler}
                                medicalHistory={props.medicalHistory}
                            />
                        </div>
                    </div>
                )}
            </DefinationService>
        </div>
    );
};

const mapStateToProps = (state) => ({
    selectedOption: state.DefinitionReducer.selectedOption,
    isRightSideDrawerVisible: state.ThemeOptions.isRightSideDrawerVisible,
    prescription: state.DefinitionReducer.prescription,
    definitionList: state.DefinitionReducer.definitionList,
    medicalHistory: state.DefinitionReducer.medicalHistory,
    patient: state.DefinitionReducer.patient,
});

const mapDispatchToProps = (dispatch) => ({
    setSelectedOption: (selectedOption) => dispatch(setSelectedOption(selectedOption)),
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setDefinitionList: (definitionList) => dispatch(setDefinitionList(definitionList)),
    setMedicalHistory: (medicalHistory) => dispatch(setMedicalHistory(medicalHistory)),
    setSpecificPatient: (patient) => dispatch(setSpecificPatient(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MedicalHistory);
