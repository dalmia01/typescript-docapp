import React from "react";
import { connect } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";

import {
    FETCH_DEFINITIONS,
    SPECIFIC_DEFINITION,
    DELETE_DEFINITION_FIELD,
    DELETE_DEFINITION,
    ADD_DEFINITION_NAME,
    FAVOURITE_MEDICINE_VALUES,
    REMOVE_FAVOURITE_MEDICINE_VALUES,
    FETCH_FILTERED_DEFINITIONS,
} from "../../Utils/Graphql/commonDefinitionGraphql";
import { setRightSideDrawer } from "../../reducers/ThemeOptions";
import { setSelectedOption, setDefinition, setPrescription, setDefinitionList } from "../../reducers/DefinitionReducer";
import { DEFAULT_UPDATED_SUCCESS, DEFAULT_DELETED_SUCCESS } from "../../Utils/Constants/messageConstants";
import { handleCommonError } from "../../Utils/validation";
import { setAuthLogout } from "../../actions/authActions";

const DefinitionService = (props) => {
    // fetch common definition list for a particular type graphql mutation
    const [fetchDefinitions] = useLazyQuery(FETCH_DEFINITIONS, {
        onCompleted(definitions) {
            const compareObjects = (obj1, obj2) => {
                return obj1.id === obj2.id;
            };
            if (props.prescription.length > 0) {
                let prescriptionCategoryItems = [...props.prescription].filter((item) => {
                    if (item.category === props.category) return item;
                });

                prescriptionCategoryItems = prescriptionCategoryItems.filter((item) => {
                    return definitions.definations.some((defination) => defination.id === item.id);
                });

                let categorySelectedItems = [...props.prescription].filter((item) => item.category === props.category);

                let output = [];
                if (prescriptionCategoryItems.length > 0) {
                    output = [...definitions.definations].filter((b) => {
                        let indexFound = [...prescriptionCategoryItems].findIndex((a) => compareObjects(a, b));
                        return indexFound === -1;
                    });
                    if (props.category !== "MedicalHistory") {
                        props.setDefinitionList({ all: definitions.definations, selected: categorySelectedItems, nonSelected: output });
                    }
                } else {
                    props.setDefinitionList({ all: definitions.definations, selected: [], nonSelected: definitions.definations });
                }
            } else {
                props.setDefinitionList({ all: definitions.definations, selected: [], nonSelected: definitions.definations });
            }

            if (props.category === "MedicalHistory") {
                props.setSelectedOption({});
                let medicalHistoryCategoryItems = [...props.medicalHistory].filter((item) => {
                    if (item.category === "MedicalHistory") return item;
                });
                medicalHistoryCategoryItems = medicalHistoryCategoryItems.filter((item) => {
                    return definitions.definations.some((defination) => defination.id === item.id);
                });
                let output = [];
                if (medicalHistoryCategoryItems.length > 0) {
                    output = [...definitions.definations].filter((b) => {
                        let indexFound = [...medicalHistoryCategoryItems].findIndex((a) => compareObjects(a, b));
                        return indexFound === -1;
                    });

                    props.setDefinitionList({
                        all: definitions.definations,
                        selected: medicalHistoryCategoryItems,
                        nonSelected: output,
                    });
                } else {
                    props.setDefinitionList({ all: definitions.definations, selected: [], nonSelected: definitions.definations });
                }
            }
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // fetch common definition list for a particular type graphql mutation on filter
    const [fetchFilteredDefinitons] = useLazyQuery(FETCH_FILTERED_DEFINITIONS, {
        onCompleted(definitions) {
            const compareObjects = (obj1, obj2) => {
                return obj1.id === obj2.id;
            };
            let uniq = {};

            /** Filter out duplicate definations already in prescription vs fetch definations */
            let filteredArray = [];
            filteredArray = [...props.definitionList.all, ...definitions.definations, ...props.prescription].filter(
                (obj) => !uniq[obj.id] && (uniq[obj.id] = true)
            );

            if (props.prescription.length > 0) {
                let prescriptionCategoryItems = [...props.prescription];

                let categorySelectedItems = [...props.prescription].filter((item) => item.category === props.category);

                let output = [];
                if (prescriptionCategoryItems.length > 0) {
                    output = [...filteredArray].filter((b) => {
                        let indexFound = [...prescriptionCategoryItems].findIndex((a) => compareObjects(a, b));
                        return indexFound === -1;
                    });
                    if (props.category !== "MedicalHistory") {
                        props.setDefinitionList({ all: filteredArray, selected: categorySelectedItems, nonSelected: output });
                    }
                } else {
                    props.setDefinitionList({ all: filteredArray, selected: [], nonSelected: filteredArray });
                }
            } else {
                props.setDefinitionList({ all: filteredArray, selected: [], nonSelected: filteredArray });
            }

            if (props.category === "MedicalHistory") {
                props.setSelectedOption({});
                let medicalHistoryCategoryItems = [...props.medicalHistory].filter((item) => {
                    if (item.category === "MedicalHistory") return item;
                });
                medicalHistoryCategoryItems = medicalHistoryCategoryItems.filter((item) => {
                    return filteredArray.some((defination) => defination.id === item.id);
                });
                let output = [];
                if (medicalHistoryCategoryItems.length > 0) {
                    output = [...filteredArray].filter((b) => {
                        let indexFound = [...medicalHistoryCategoryItems].findIndex((a) => compareObjects(a, b));
                        return indexFound === -1;
                    });

                    props.setDefinitionList({
                        all: filteredArray,
                        selected: medicalHistoryCategoryItems,
                        nonSelected: output,
                    });
                } else {
                    props.setDefinitionList({ all: filteredArray, selected: [], nonSelected: filteredArray });
                }
            }
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // graphql query to  fetch  specific definition for particular item of any category && determing load state
    let [specificLoad, setSpecificLoad] = React.useState(false);
    const [getDefinitionDetails] = useLazyQuery(SPECIFIC_DEFINITION, {
        onCompleted(data) {
            if (props.category === "MedicalHistory") {
                props.setSelectedOption(data.defination || {});
            } else if (props.category) {
                if (props.prescription.length > 0) {
                    props.prescription.find((prescriptionItem) => {
                        if (prescriptionItem.id === data.defination.id) {
                            props.setSelectedOption({
                                category: prescriptionItem.category,
                                fields: prescriptionItem.fields,
                                id: prescriptionItem.id,
                                name: prescriptionItem.name,
                                is_fav: prescriptionItem.is_fav,
                                description: prescriptionItem.description,
                                dosageForm: prescriptionItem.dosageForm,
                            });
                        }
                    });
                } else {
                    props.setSelectedOption(data.defination || {});
                }
            } else {
                if (props.viewPrescription.vitals && props.viewPrescription.vitals.data && props.viewPrescription.vitals.data.length > 0) {
                    props.setSelectedOption({
                        category: data.defination.category,
                        fields: props.viewPrescription.vitals.data,
                        id: data.defination.id,
                    });
                } else {
                    props.setSelectedOption(data.defination || {});
                }
            }

            setSpecificLoad(false);
        },
        onError(err) {
            console.log(err);
            handleCommonError(err, props.setAuthLogout);
        },
        fetchPolicy: "network-only",
    });

    // selected definition and open detailed form (on right)
    const viewOption = async (element) => {
        if (props.clickable) {
            setSpecificLoad(true);
            getDefinitionDetails({
                variables: { category: element.category, id: element.id },
            });
        }
    };

    // make call to delete definition field
    let [deleteDefinationFieldMutation] = useMutation(DELETE_DEFINITION_FIELD, {
        update: (_, data) => {
            props.setSelectedOption(data.data.defination);
            toast.success(DEFAULT_UPDATED_SUCCESS);
        },
        onError: (err) => {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // handler to delete definition field
    const deleteDefinationField = (element) => {
        let deleteElement = {
            id: props.selectedOption.id,
            name: props.selectedOption.name,
            category: props.selectedOption.category,
            field: { ...element },
        };

        props.prescription.find((item) => {
            if (item.id === props.selectedOption.id) {
                item.fields.filter((field, index) => {
                    if (field.id === element.id) {
                        item.fields.splice(index, 1);
                    }
                });
            }
        });

        deleteDefinationFieldMutation({ variables: { defination: JSON.stringify(deleteElement) } });
    };

    // make api call to delete definition
    let [deleteDefinationMutation] = useMutation(DELETE_DEFINITION, {
        variables: props.selectedOption,
        update: async (_, data) => {
            toast.success(DEFAULT_DELETED_SUCCESS);
        },
        onError: async (err) => {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // remove selected item (definition)
    const removeSelectedItem = () => {
        const updatedPrescription = props.prescription.filter((item) => {
            return item.id !== props.selectedOption.id;
        });

        let selectedFields = props.definitionList.selected.filter((item) => {
            return item.id !== props.selectedOption.id;
        });

        let allFields = props.definitionList.all.filter((item) => {
            return item.id !== props.selectedOption.id;
        });
        // setSelectedFields(selectedFields);
        props.setDefinitionList({ all: allFields, selected: selectedFields });
        props.setSelectedOption({});
        props.setPrescription(updatedPrescription);
        deleteDefinationMutation();
    };

    // enable common defintion edit mode in right side drawer
    const editDefinition = (element) => {
        props.setDefinition({
            crudType: "edit",
            id: props.selectedOption.id,
            name: props.selectedOption.name,
            category: props.selectedOption.category,
            field: { ...element },
        });
    };

    // add new definition (specifically - only definition name)
    let [addDefinationNameMutation] = useMutation(ADD_DEFINITION_NAME, {
        update: async (_, data) => {
            props.setDefinitionList({
                all: [...props.definitionList.all, data.data.defination],
                selected: [...props.definitionList.selected, data.data.defination],
                nonSelected: [...props.definitionList.nonSelected],
            });
            props.setSelectedOption(data.data.defination);
            props.setPrescription([...props.prescription, data.data.defination]);
            toast.success(`${props.category} added successfully`);
        },
        onError: async (err) => {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // disable add definition button && calling add defintion mitation
    const addDefination = (name, category) => {
        addDefinationNameMutation({
            variables: {
                name: name ? name.trim() : "",
                category: category,
            },
        });
    };

    // adding medicine values as favourite -  graphql request
    const [savingFavouriteMedicineValues] = useMutation(FAVOURITE_MEDICINE_VALUES, {
        update: (_, data) => {
            toast.success(`Added to favourites`);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    // removing medicine values from favourite - graphql request
    const [removingFavouriteMedicineValues] = useMutation(REMOVE_FAVOURITE_MEDICINE_VALUES, {
        update: (_, data) => {
            toast.success(`Removed from favourites`);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    // saving & removing favourite medicine values
    const favouriteMedicineValues = (clear) => {
        if (clear) {
            removingFavouriteMedicineValues({ variables: { definationID: props.selectedOption.id } });
        } else {
            savingFavouriteMedicineValues({ variables: { defination: JSON.stringify(props.selectedOption) } });
        }
    };

    return (
        <React.Fragment>
            {props.children({
                editDefinition,
                deleteDefinationField,
                getDefinitionDetails,
                removeSelectedItem,
                deleteDefinationMutation,
                viewOption,
                specificLoad,
                fetchDefinitions,
                fetchFilteredDefinitons,
                addDefination,
                favouriteMedicineValues,
            })}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    rightSideDrawerContent: state.ThemeOptions.rightSideDrawerContent,
    selectedOption: state.DefinitionReducer.selectedOption,
    prescription: state.DefinitionReducer.prescription,
    defination: state.DefinitionReducer.defination,
    definitionList: state.DefinitionReducer.definitionList,
    viewPrescription: state.DefinitionReducer.viewPrescription,
    medicalHistory: state.DefinitionReducer.medicalHistory,
});

const mapDispatchToProps = (dispatch) => ({
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers)),
    setSelectedOption: (selectedOption) => dispatch(setSelectedOption(selectedOption)),
    setDefinition: (definition) => dispatch(setDefinition(definition)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setDefinitionList: (definitionList) => dispatch(setDefinitionList(definitionList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefinitionService);
