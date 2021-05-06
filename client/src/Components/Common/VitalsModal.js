import React from "react";
import { connect } from "react-redux";
import { Modal, ModalBody, Button, Row, Col } from "reactstrap";

import VitalsHomeTable from "../../Components/Table/VitalsHomeTable";
import EmptyState from "./EmptyState";

const VitalsModal = (props) => {
    const confirmDeleteHandler = () => {
        props.setConfirmDelete({ visibility: false, user: {} });
    };

    return (
        <Modal isOpen={props.isOpen}>
            <div class="modal-header">
                <h5 class="modal-title">Vitals</h5>
                <button class="close" onClick={() => props.setVitalsModalVisibility(false)}>
                    ×
                </button>
            </div>
            <ModalBody>
                <div className="pd-tb-10">
                    <Row>
                        <Col md="12" className="vitals-table">
                            {props.allPrescriptions.length > 0 ? (
                                <VitalsHomeTable allPrescriptions={props.allPrescriptions} />
                            ) : (
                                <EmptyState content="No Vitals Found" />
                            )}
                        </Col>
                    </Row>
                </div>
            </ModalBody>
        </Modal>
    );
};

const mapDispatchToProps = (state) => ({
    allPrescriptions: state.DefinitionReducer.allPrescriptions,
});

export default connect(mapDispatchToProps)(VitalsModal);
