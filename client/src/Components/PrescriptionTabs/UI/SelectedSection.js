import React from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";

import { setRightSideDrawer } from "../../../reducers/ThemeOptions";
import { setPrescription, setDefinition, setSelectedOption } from "../../../reducers/DefinitionReducer.js";
import { setAuthLogout } from "../../../actions/authActions";
import DynamicForm from "../DynamicForm";
import MedicineForm from "../MedicineForm";
import MedicineModal from "../../Common/MedicineModal";

const SelectedSection = (props) => {
    // setting medcine values as favourite for default
    let [favourite, setFavourite] = React.useState(props.selectedOption.is_fav);
    let [modalVisibility, setModalVisibility] = React.useState(false);

    // setting favourite medicine
    const setFavouriteHandler = () => {
        setFavourite(!favourite);
        if (!favourite) {
            props.favouriteMedicineValues();
        } else {
            props.favouriteMedicineValues("clear");
        }
    };

    // medicine popup
    const medicinePopUpHandler = () => {
        setModalVisibility(true);
    };

    // dynamic form component
    const dynamicForm = (
        <DynamicForm
            selectedOption={props.selectedOption}
            prescription={props.prescription}
            editDefinition={props.editDefinition}
            deleteDefinationField={props.deleteDefinationField}
            medHistoryFormValueChange={props.medHistoryFormValueChange}
            category={props.category}
        />
    );

    return (
        <div className="card mb-3 widget-chart">
            <div className="widget-chart-content card-custom">
                <Row className="heading form-inline">
                    <Col md="8" className="text-left">
                        <h5 style={{ textTransform: "none" }}>{props.selectedOption.name}</h5>
                    </Col>
                    {props.dynamic ? (
                        <Col md="4" className="text-right">
                            <i
                                onClick={() => props.setRightSideDrawer(true, props.rightSideDrawerContent, "AddCommonDef", {})}
                                className="pe-7s-tools btn-icon-wrapper icon clickable"
                                title="Add fields"
                            ></i>
                            <i
                                className="pe-7s-trash btn-icon-wrapper icon clickable"
                                title={`Delete ${props.selectedOption.name}`}
                                onClick={props.confirmItemDeleteHandler}
                            ></i>
                        </Col>
                    ) : (
                        <Col md="4" className="text-right">
                            <i
                                className="lnr-pencil icon clickable"
                                title={`Edit ${props.selectedOption.name}`}
                                onClick={medicinePopUpHandler}
                            ></i>
                            <i
                                className="pe-7s-star icon clickable"
                                id="p-icon-star"
                                onClick={setFavouriteHandler}
                                title={favourite ? "Removed from defaults/favourites" : "Set as defaults/avourites"}
                                style={{ color: favourite ? "#f1c40f" : "#495057" }}
                            />
                            <i
                                className="pe-7s-trash btn-icon-wrapper icon clickable"
                                title={`Delete ${props.selectedOption.name}`}
                                onClick={props.confirmItemDeleteHandler}
                            ></i>
                        </Col>
                    )}
                </Row>
                <Row>
                    <Col md="12" className="FormElements">
                        {props.dynamic ? dynamicForm : <MedicineForm />}
                    </Col>
                </Row>
            </div>
            {modalVisibility && (
                <MedicineModal
                    isOpen={modalVisibility}
                    title="Add Medicine"
                    setModalVisibility={setModalVisibility}
                    selectedOption={props.selectedOption}
                    edit={true}
                    category={props.category}
                />
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    selectedOption: state.DefinitionReducer.selectedOption,
    isRightSideDrawerVisible: state.ThemeOptions.isRightSideDrawerVisible,
    rightSideDrawerContent: state.ThemeOptions.rightSideDrawerContent,
    prescription: state.DefinitionReducer.prescription,
    defination: state.DefinitionReducer.defination,
    rightSideDrawerContentType: state.DefinitionReducer.rightSideDrawerContentType,
    patient: state.DefinitionReducer.patient,
});

const mapDispatchToProps = (dispatch) => ({
    setRightSideDrawer: (isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers) =>
        dispatch(setRightSideDrawer(isRightSideDrawerVisible, rightSideDrawerContent, rightSideDrawerContentType, rightSideDrawerOthers)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
    setDefinition: (defination) => dispatch(setDefinition(defination)),
    setSelectedOption: (selectedOption) => dispatch(setSelectedOption(selectedOption)),
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedSection);
