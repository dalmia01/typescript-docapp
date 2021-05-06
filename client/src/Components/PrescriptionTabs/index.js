import React from "react";
import { connect } from "react-redux";
import { useLazyQuery } from "@apollo/react-hooks";

import { setAuthLogout } from "../../actions/authActions";
import { setSelectedOption, setPrescription, setDefinitionList } from "../../reducers/DefinitionReducer";
import { setRightSideDrawer } from "../../reducers/ThemeOptions";
import CommonDefUi from "./UI/CommonDefUI";
import Vitals from "./Vitals";
import Others from "./Others";
import ConfirmModal from "../Common/ConfirmModal";
import DefinationService from "../DefinitionService";
import { SPECIFIC_DEFINITION } from "../../Utils/Graphql/commonDefinitionGraphql";
import { handleCommonError } from "../../Utils/validation";

import "./assets/scss/_multiple-select.scss";

const SelectFields = (props) => {
    const [filterSelect, setFilterSelect] = React.useState("");
    const [medHistoryUiVisibility, setMedHistoryUiVisibility] = React.useState(true);

    // get medicine values from backend

    const [getDefinitionDetails] = useLazyQuery(SPECIFIC_DEFINITION, {
        onCompleted(data) {
            let elementToSet = {
                category: data.defination.category,
                fields: data.defination.fields,
                id: data.defination.id,
                name: data.defination.name,
                is_fav: data.defination.is_fav,
                description: data.defination.description,
                dosageForm: data.defination.dosageForm,
            };
            props.setSelectedOption(elementToSet);
            props.setPrescription([...props.prescription, elementToSet]);
        },
        onError(err) {
            console.log(err);
            handleCommonError(err, props.setAuthLogout);
        },
    });

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
            // add the defination to prescription
            let findIndex = props.prescription.findIndex((definationItem) => element.id === definationItem.id);
            if (findIndex < 0 && props.category !== "Medicines") {
                props.setPrescription([...props.prescription, element]);
            }

            // remove from non-selected fields list
            let removeFromOptions = [...props.definitionList.nonSelected].filter((field) => {
                return !(field.id === element.id);
            });
            props.setDefinitionList({ selected: [element, ...props.definitionList.selected], nonSelected: removeFromOptions });

            if (props.category === "Medicines") {
                getDefinitionDetails({
                    variables: { category: element.category, id: element.id },
                });
            } else {
                props.setSelectedOption(element);
            }
            // make it selected by default
        }, 100);

        setMedHistoryUiVisibility(false);
    };

    // remove from selected definition
    const removeFromSelectedOptions = (e, element) => {
        if (element.id === props.selectedOption.id) {
            props.setSelectedOption({});
        }

        let removeFromPrescription = props.prescription.filter((item) => {
            return item.id !== element.id;
        });

        props.setPrescription(removeFromPrescription);

        setTimeout(() => {
            let removeFromSelectedOptions = [...props.definitionList.selected].filter((field) => {
                if (!(field.id === element.id)) return field;
            });

            element.fields.map((field) => (field.value = ""));

            props.setDefinitionList({ selected: removeFromSelectedOptions, nonSelected: [element, ...props.definitionList.nonSelected] });
        }, 100);
    };

    /**
     *   setting definiton list on selection or removal from Defintion list or selected defintions respectively
     */

    /**
     *   setting confirm delete state
     */

    let [confirmDelete, setConfirmDelete] = React.useState({ visibility: false });

    const confirmItemDeleteHandler = () => {
        setConfirmDelete({ visibility: true });
    };

    /**
     *   setting confirm delete state
     */

    return (
        <div className="">
            {["Symptoms", "Findings", "Diagnosis", "Medicines", "Investigations", "Instructions"].includes(props.category) && (
                <DefinationService
                    category={props.category}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                    clickable={props.clickable}
                >
                    {({
                        removeSelectedItem,
                        editDefinition,
                        deleteDefinationField,
                        viewOption,
                        specificLoad,
                        fetchDefinitions,
                        addDefination,
                        fetchFilteredDefinitons,
                        favouriteMedicineValues,
                    }) => (
                        <div>
                            <ConfirmModal
                                isOpen={confirmDelete.visibility}
                                titleContent="Are You Sure You Want To Delete?"
                                setConfirmDelete={setConfirmDelete}
                                deleteConfirmHandler={removeSelectedItem}
                            />

                            <div className="grid-row">
                                <CommonDefUi
                                    category={props.category}
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
                                    favouriteMedicineValues={favouriteMedicineValues}
                                    fetchFilteredDefinitons={fetchFilteredDefinitons}
                                />
                            </div>
                        </div>
                    )}
                </DefinationService>
            )}

            {props.category === "Vitals" && <Vitals />}

            {props.category === "Others" && <Others />}
        </div>
    );
};

const mapStateToProps = (state) => ({
    selectedOption: state.DefinitionReducer.selectedOption,
    isRightSideDrawerVisible: state.ThemeOptions.isRightSideDrawerVisible,
    prescription: state.DefinitionReducer.prescription,
    definitionList: state.DefinitionReducer.definitionList,
});

const mapDispatchToProps = (dispatch) => ({
    setSelectedOption: (selectedOption) => dispatch(setSelectedOption(selectedOption)),
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setDefinitionList: (definitionList) => dispatch(setDefinitionList(definitionList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectFields);
