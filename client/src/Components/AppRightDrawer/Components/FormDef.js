import React from "react";
import { Button } from "reactstrap";

import FavouritePrescriptionList from "./FavouritePrescriptionList";
import AddDefFileds from "./AddDefFields";
import EditDefFields from "./EditDefFields";

const FormDef = (props) => {
    const { closeForm, buildForm, editForm } = props;
    const [selectedFavPrescription, setselectedFavPrescription] = React.useState({});

    // selecting favourite prescription
    const sefFavouritePrescriptionHandler = () => {
        props.setFavouritePrescription(selectedFavPrescription);
        setselectedFavPrescription({});
    };

    // submit handler button jsx as add , edit or favourite
    const submitBtnType = () => {
        switch (props.contentyType) {
            case "AddCommonDef":
                return (
                    <Button color="info" onClick={buildForm}>
                        Save
                    </Button>
                );

            case "EditCommonDef":
                return (
                    <Button color="info" onClick={editForm}>
                        Edit
                    </Button>
                );
            case "FavouritePrescriptions":
                return (
                    <Button color="info" onClick={sefFavouritePrescriptionHandler}>
                        Select
                    </Button>
                );
            default:
                return null;
        }
    };

    // right drawer form title
    const formTitle = () => {
        switch (props.contentyType) {
            case "AddCommonDef":
                return "Add Fields";
            case "EditCommonDef":
                return "Edit Fields";
            case "FavouritePrescriptions":
                return "Favourite Prescriptions";
            default:
                return "Dynamic Form";
        }
    };

    // rendering form type based on type of content
    const renderForm = () => {
        switch (props.contentyType) {
            case "AddCommonDef":
                return <AddDefFileds {...props} />;
            case "EditCommonDef":
                return <EditDefFields {...props} />;
            case "FavouritePrescriptions":
                return (
                    <FavouritePrescriptionList
                        selectedFavPrescription={selectedFavPrescription}
                        setselectedFavPrescription={setselectedFavPrescription}
                    />
                );
            default:
                return <div>No content</div>;
        }
    };

    return (
        <nav className="right-navigation">
            <div className="center bold head">
                <div className="modal-header">
                    <h5 className="modal-title">{formTitle()}</h5>
                    <button className="close" onClick={closeForm}>
                        &times;
                    </button>
                </div>
            </div>
            <div className="elements">{renderForm()}</div>
            <div className="center bold btns foot">{submitBtnType()}</div>
        </nav>
    );
};

export default FormDef;
