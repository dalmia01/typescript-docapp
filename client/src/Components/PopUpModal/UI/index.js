import React from "react";
import { Modal } from "reactstrap";

import UserPopUpModal from "./UserPopUpModal";
import ClinicForm from "./ClinicForm";

const PopUpModalUI = (props) => {
    const closeBtn = (
        <button className="close" onClick={props.closeModal}>
            &times;
        </button>
    );

    return (
        <React.Fragment>
            <Modal isOpen={true}>
                {["add user", "edit user"].includes(props.popUpModalContent.type) && <UserPopUpModal closeBtn={closeBtn} {...props} />}
                {props.popUpModalContent.type === "Update Clinic" && <ClinicForm closeBtn={closeBtn} {...props} />}
            </Modal>
        </React.Fragment>
    );
};

export default PopUpModalUI;
