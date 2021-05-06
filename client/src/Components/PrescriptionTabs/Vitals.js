import React from "react";
import { connect } from "react-redux";
import VitalsUI from "./UI/VitalsUI";
import { setRightSideDrawer } from "../../reducers/ThemeOptions";
import { setSelectedOption, setPrescription, setDefinition } from "../../reducers/DefinitionReducer";
import DefinitionService from "../DefinitionService";
const Vitals = (props) => {
    const rightSideDrawerHandler = () => {
        props.setRightSideDrawer(true, props.rightSideDrawerContent, "AddCommonDef", { category: "Vitals", name: "vitals" });
    };

    return (
        <DefinitionService>
            {({ editDefinition, deleteDefinationField, getDefinitionDetails, inputChange }) => (
                <VitalsUI
                    rightSideDrawerHandler={rightSideDrawerHandler}
                    selectedOption={props.selectedOption}
                    prescription={props.prescription}
                    editDefinition={editDefinition}
                    getDefinitionDetails={getDefinitionDetails}
                    inputChange={inputChange}
                    deleteDefinationField={deleteDefinationField}
                />
            )}
        </DefinitionService>
    );
};

const mapStateToProps = (state) => ({
    isRightSideDrawerVisible: state.ThemeOptions.isRightSideDrawerVisible,
    rightSideDrawerContent: state.ThemeOptions.rightSideDrawerContent,
    rightSideDrawerContentType: state.DefinitionReducer.rightSideDrawerContentType,
    selectedOption: state.DefinitionReducer.selectedOption,
    prescription: state.DefinitionReducer.prescription,
    defination: state.DefinitionReducer.defination,
});

const mapDispatchToProps = (dispatch) => ({
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers)),
    setSelectedOption: (selectedOption) => dispatch(setSelectedOption(selectedOption)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setDefinition: (definition) => dispatch(setDefinition(definition)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Vitals);
