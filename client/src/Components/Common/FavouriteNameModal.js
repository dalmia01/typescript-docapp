import React from "react";
import { Modal, ModalBody, Button, Row, Col, FormGroup, Label, Input, ModalFooter } from "reactstrap";

const FavouriteNameModal = (props) => {
    let [name, setName] = React.useState("");

    const saveHandler = () => {
        if (name && name.length > 5) {
            props.confirmHandler(name);
        }
        props.setVisibility(false);
    };

    return (
        <Modal isOpen={props.isOpen}>
            <ModalBody>
                <div>
                    <Row form>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="title">Set Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Name should be > 5 character"
                                    id="title"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="link" onClick={() => props.setVisibility(false)}>
                    Cancel
                </Button>
                <Button color="primary" onClick={saveHandler}>
                    Save
                </Button>{" "}
            </ModalFooter>
        </Modal>
    );
};

export default FavouriteNameModal;
