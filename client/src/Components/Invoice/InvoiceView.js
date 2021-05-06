import React from "react";
import moment from "moment";
import { Col } from "reactstrap";
import { getPatienSerialId, getSexNotation } from "../../Utils/common";

export const InvoicePrintHead = (props) => {
    const { first_name, last_name, phone, age, salutation, sex, address, patient_serial_id = "" } = props.patient;
    const sexNotation = getSexNotation(sex);
    return (
        <React.Fragment>
            <div className="addresses">
                <div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
                    <div>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <b>Name : </b>
                                <span className="text-capitalize">
                                    {first_name} {last_name}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <b>Age/Sex : </b>
                                <span className="text-uppercase">
                                    {age}
                                    <span style={{ textTransform: "lowercase" }}>y</span>
                                    {salutation && ` / ${sexNotation}`}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <b>Address : </b>
                                <span className="text-capitalize">
                                    {address.line_1} {address.area} {address.city} {address.pincode}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <b>Mobile : </b>
                                <span className="text-uppercase">{phone}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <b>Patient #</b>
                                <span style={{ float: "right" }}>{getPatienSerialId(patient_serial_id)}</span>
                            </li>
                            <li class="list-group-item">
                                <b>Invoice #</b>
                                <span style={{ float: "right" }}>{props.initialSerialId}</span>
                            </li>
                            <li class="list-group-item">
                                <b>Date #</b>
                                <span style={{ float: "right" }}>
                                    {props.viewInvoice.updated_at
                                        ? moment(props.viewInvoice.updated_at).format("DD/MM/YYYY")
                                        : moment().format("DD/MM/YYYY")}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <br/>
        </React.Fragment>
    );
};

export const InvoiceHead = (props) => {
    const { first_name, last_name, phone, address, age, salutation, sex, patient_serial_id = "" } = props.patient;
    const sexNotation = getSexNotation(sex);
    return (
        <React.Fragment>
            <div className="addresses">
                <Col md="6" className="section">
                    <b>Name : </b>
                    <span className="text-capitalize">
                        {first_name} {last_name}
                    </span>
                    <br />
                    <b>Age/Sex : </b>
                    <span className="text-uppercase">
                        {age}
                        <span style={{ textTransform: "lowercase" }}>y</span>
                        {salutation && ` / ${sexNotation}`}
                    </span>
                    <br />
                    <b>Address : </b>
                    <span className="text-capitalize">
                        {address.line_1} {address.area} {address.city} {address.pincode}
                    </span>
                    <br />
                    <b>Mobile : </b>
                    <span className="text-uppercase">{phone}</span>
                </Col>
                <Col md="6">
                    <div className="valueTable to">
                        <div className="row">
                            <div className="label">Patient #</div>
                            <div className="value">{getPatienSerialId(patient_serial_id)}</div>
                        </div>
                        <div className="row">
                            <div className="label">Invoice #</div>
                            <div className="value">{props.initialSerialId}</div>
                        </div>
                        <div className="row">
                            <div className="label">Date</div>
                            <div className="value date">
                                {props.viewInvoice.updated_at
                                    ? moment(props.viewInvoice.updated_at).format("DD/MM/YYYY")
                                    : moment().format("DD/MM/YYYY")}
                            </div>
                        </div>
                    </div>
                </Col>
            </div>
            <br/>
        </React.Fragment>
    );
};
