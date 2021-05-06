import React from "react";
import { Modal, ModalBody, Button } from "reactstrap";

const ConfirmModal = (props) => {
    const confirmDeleteHandler = () => {
        props.deleteConfirmHandler();
        props.setConfirmDelete(false);
    };

    return (
        <Modal isOpen={props.isOpen}>
            <ModalBody>
                <div className="pd-tb-10">{props.titleContent}</div>

                <div>
                    <Button className="mb-2 mr-2 btn btn-light" onClick={() => props.setConfirmDelete(false)}>
                        Cancel
                    </Button>

                    <Button id="delete-btn" className="mb-2 mr-2" color="danger" onClick={confirmDeleteHandler}>
                        Yes, Please
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ConfirmModal;
