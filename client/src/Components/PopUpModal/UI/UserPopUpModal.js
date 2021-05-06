import React from "react";
import { Row, Col, FormGroup, Label, Input, Form, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const UserPopUpModal = (props) => {
    return (
        <Form onSubmit={props.onSubmit}>
            <ModalHeader close={props.closeBtn}>{props.popUpModalContent.type === "add user" ? "Add User" : "Edit User"}</ModalHeader>
            <ModalBody>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input type="select" name="title" id="title" value={props.formValues.title} onChange={props.onChange}>
                                <option value="mrs">Mrs</option>
                                <option value="mr">Mr</option>
                                <option value="master">Master</option>
                                <option value="miss">Miss</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="gender">Gender</Label>
                            <Input type="select" name="sex" id="sex" value={props.formValues.gender} onChange={props.onChange}>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="others">Others</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="age">Age</Label>
                            <Input
                                type="text"
                                required
                                name="age"
                                id="age"
                                maxLength="3"
                                placeholder="Age"
                                value={props.formValues.age}
                                onChange={props.onChange}
                                pattern="[0-9]*"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="fname">First Name</Label>
                            <Input
                                type="text"
                                required
                                name="fname"
                                id="fname"
                                placeholder="First Name"
                                value={props.formValues.fname}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="lname">Last Name</Label>
                            <Input
                                type="text"
                                required
                                name="lname"
                                id="lname"
                                placeholder="last Name"
                                value={props.formValues.lname}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {props.popUpModalContent.type === "add user" && (
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="phone">Phone Number</Label>
                                <Input
                                    type="text"
                                    required
                                    name="phone"
                                    id="phone"
                                    placeholder="Phone number"
                                    value={props.formValues.phone}
                                    onChange={props.onChange}
                                    pattern="[0-9]*"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    required
                                    name="password"
                                    id="pasword"
                                    placeholder="Password"
                                    value={props.formValues.password}
                                    onChange={props.onChange}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                )}

                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="designation">Designation</Label>
                            <Input
                                type="text"
                                required
                                name="designation"
                                id="designation"
                                placeholder="Designation"
                                value={props.formValues.designation}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="role">Role</Label>
                            <Input type="select" name="role" id="role" value={props.formValues.role} onChange={props.onChange}>
                                <option value="admin">Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="reception">Reception</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="email">Email Address</Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="Email Address"
                                value={props.formValues.email}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="role">Clinics</Label>
                            <Input type="select" name="clinics" id="clinics" value={props.formValues.clinics} onChange={props.onChange}>
                                <option value="">Select</option>
                                {props.clinics && props.clinics.map((clinic) => <option value={clinic.id}>{clinic.clinic_name}</option>)}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="line_1">Line</Label>
                            <Input
                                type="text"
                                name="line"
                                id="line"
                                placeholder="Line"
                                value={props.formValues.line}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="area">Area</Label>
                            <Input
                                type="text"
                                name="area"
                                id="area"
                                placeholder="Area"
                                value={props.formValues.area}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="city">city</Label>
                            <Input
                                type="text"
                                name="city"
                                id="city"
                                placeholder="city"
                                value={props.formValues.city}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="state">State</Label>
                            <Input
                                type="text"
                                name="state"
                                id="state"
                                placeholder="State"
                                value={props.formValues.state}
                                onChange={props.onChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="pincode">Pincode</Label>
                            <Input
                                type="text"
                                name="pincode"
                                id="pincode"
                                placeholder="Pincode"
                                value={props.formValues.pincode}
                                onChange={props.onChange}
                                pattern="[0-9]*"
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" type="submit">
                    {props.popUpModalContent.type === "add user" ? "Add" : "Edit"}
                </Button>
            </ModalFooter>
        </Form>
    );
};

export default UserPopUpModal;
