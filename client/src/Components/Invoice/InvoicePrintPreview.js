import React, { Component } from "react";
import { InvoicePrintHead } from "./InvoiceView";
import "./Invoice.module.scss";

class InvoicePrintPreview extends Component {
    render() {
        return (
            <div className="invoice-print">
                <div className="name">Dr. Pulkit's Family Clinic & Diabetes Centre</div>
                <div className="address">5/1 GF, Subhash Nagar, New Delhi 110027</div>
                <InvoicePrintHead
                    patient={this.props.patient}
                    initialSerialId={this.props.initialSerialId}
                    viewInvoice={this.props.viewInvoice}
                />

                <table class="mb-0 table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.items.map((item, index) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{this.props.currencyFormatter(item.quantity * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ul class="list-group" style={{ marginTop: "20px" }}>
                    <li class="list-group-item">
                        <b>Payment Mode</b>
                        <span style={{ float: "right" }}>{this.props.invoiceDetails.paymentMode}</span>
                    </li>
                    <li class="list-group-item">
                        <b>Total Paid</b>
                        <span style={{ float: "right" }}>{this.props.totalPaid}</span>
                    </li>
                </ul>
            </div>
        );
    }
}

export default InvoicePrintPreview;
