import React from "react";
import { Row, Col, FormGroup, Label, Input, Form, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ClinicForm = (props) => {
    return (
        <Form onSubmit={props.onSubmit}>
            <ModalHeader close={props.closeBtn}>Clinic Details</ModalHeader>
            <ModalBody>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="clinicName">Clinic's Name</Label>
                            <Input
                                type="text"
                                required
                                name="clinicName"
                                id="clinicName"
                                placeholder="Clinic Name"
                                value={props.clinicsValues.clinicName}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="address">Address</Label>
                            <Input
                                type="text"
                                required
                                name="address"
                                id="address"
                                placeholder="Address"
                                value={props.clinicsValues.address}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="phoneNum">Phone Number</Label>
                            <Input
                                type="text"
                                required
                                name="phoneNum"
                                id="phoneNum"
                                placeholder="Phone number"
                                value={props.clinicsValues.phoneNum}
                                onChange={props.onChange}
                                pattern="[0-9]*"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="website">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                id="website"
                                placeholder="Website"
                                value={props.clinicsValues.website}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" type="submit">
                    Save
                </Button>
            </ModalFooter>
        </Form>
    );
};

export default ClinicForm;
