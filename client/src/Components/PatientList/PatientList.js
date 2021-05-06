import React from "react";
import { ListGroup, ListGroupItem, Row, Col } from "reactstrap";

import "./_index.scss";

const PatientList = (props) => {
    const { patients, specificPatient, addPrescription, setPatientToScheduleAppointment } = props;

    return (
        <ListGroup>
            {patients.length > 0 &&
                patients.map((patient) => {
                    return (
                        <ListGroupItem className="list-item" key={patient.id}>
                            <Row className="primary">
                                <Col md="8" onClick={() => specificPatient(patient)}>
                                    <div className="p-name text-capitalize">{patient.first_name + " " + patient.last_name}</div>
                                    <div className="meta-info">
                                        {patient.age > -1 && patient.age + " years | "} {patient.phone}
                                    </div>
                                </Col>
                                <Col md="4" className="p-walkin flex-content font-2x space-2x">
                                    <div onClick={() => addPrescription(patient)}>
                                        <i className="pe-7s-note2" title="add prescription"></i>
                                    </div>
                                    <div onClick={() => setPatientToScheduleAppointment(patient)}>
                                        <i className="pe-7s-date" title="schedule appointment"></i>
                                    </div>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    );
                })}
        </ListGroup>
    );
};

export default PatientList;
