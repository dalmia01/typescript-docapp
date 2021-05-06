import React from "react";
import { Button, Input } from "reactstrap";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import ReactToPrint from "react-to-print";

import { PRINT_INVOICE_STYLE } from "../../Utils/InitialState/initialState";
import LineItems from "./LineItems";
import "./Invoice.module.scss";
import { SAVE_INVOICE, UPDATE_INVOICE, DELETE_INVOICE } from "../../Utils/Graphql/invoiceGraphql";
import { DEFAULT_CREATED_SUCCESS, DEFAULT_UPDATED_SUCCESS } from "../../Utils/Constants/messageConstants";
import { setInvoices, setViewInvoice } from "../../actions/paymentActions";
import ConfirmModal from "../Common/ConfirmModal";
import InvoicePrintPreview from "./InvoicePrintPreview";
import { InvoiceHead } from "./InvoiceView";

const PAYMENT_MODE = {
    CASH: "Cash",
    PAYTM: "Paytm",
    CC: "CC",
    DC: "DC",
    UPI: "UPI",
    OTHER: "Other",
};

const Invoice = (props) => {
    let locale = "en-US";
    let currency = "INR";
    const page_style = `@page {margin:${PRINT_INVOICE_STYLE.margin}}`;

    let initalPaymentMode = props.viewInvoice.payment_mode || PAYMENT_MODE.CASH;
    let initalTaxRate = props.viewInvoice.tax_rate || 0.0;
    let initialTotalPaid = 0.0;
    let initialSerialId = props.viewInvoice.serial_id || "New Invoice";
    let initalLineItems = props.viewInvoice.line_items || [
        {
            id: "initial", // react-beautiful-dnd unique key
            name: "",
            description: "",
            quantity: 0,
            price: 0.0,
        },
    ];

    let [invoiceDetails, setInvoiceDetails] = React.useState({
        paymentMode: initalPaymentMode,
        taxRate: initalTaxRate,
        lineItems: initalLineItems,
    });

    React.useEffect(() => {
        if (Object.keys(props.viewInvoice).length > 0) {
            setInvoiceDetails({
                paymentMode: props.viewInvoice.payment_mode,
                taxRate: props.viewInvoice.tax_rate,
                lineItems: [...props.viewInvoice.line_items],
            });
        } else {
            setInvoiceDetails({
                paymentMode: PAYMENT_MODE.CASH,
                taxRate: 0.0,
                lineItems: [
                    {
                        id: "initial", // react-beautiful-dnd unique key
                        name: "",
                        description: "",
                        quantity: 0,
                        price: 0.0,
                    },
                ],
            });
        }
    }, [props.viewInvoice]);

    // save invoice graphql
    let [saveInvoice] = useMutation(SAVE_INVOICE, {
        update: (_, data) => {
            toast.success(DEFAULT_CREATED_SUCCESS);

            setInvoiceDetails({
                paymentMode: PAYMENT_MODE.CASH,
                taxRate: 0.0,
                lineItems: [
                    {
                        id: "initial", // react-beautiful-dnd unique key
                        name: "",
                        description: "",
                        quantity: 0,
                        price: 0.0,
                    },
                ],
            });

            let newInvoices = [...props.invoices].concat(data.data.invoice);

            props.setInvoices(newInvoices);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    // edit invoice
    const [updateInvoice] = useMutation(UPDATE_INVOICE, {
        update: (_, data) => {
            let updatedInvoices = [...props.invoices].map((invoice) => {
                if (invoice.serial_id === data.data.invoice.serial_id) {
                    return data.data.invoice;
                } else {
                    return invoice;
                }
            });

            props.setInvoices(updatedInvoices);
            props.setViewInvoice(data.data.invoice);

            toast.success(DEFAULT_UPDATED_SUCCESS);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    // delete invoice graphql request
    const [deleteInvoice] = useMutation(DELETE_INVOICE, {
        update: (_, data) => {
            let deleteInvoice = [...props.invoices].filter((invoice) => {
                if (invoice.serial_id === initialSerialId) {
                    return data.data.invoice;
                } else {
                    return invoice;
                }
            });

            props.setInvoices(deleteInvoice);
            props.changePageViewMode();
        },
        onError: (err) => {
            console.log(err);
        },
    });

    const handleInvoiceChange = (event) => {
        setInvoiceDetails({ ...invoiceDetails, [event.target.name]: event.target.value });
    };

    const handleLineItemChange = (elementIndex) => (event) => {
        let lineItems = invoiceDetails.lineItems.map((item, i) => {
            if (elementIndex !== i) return item;
            return { ...item, [event.target.name]: event.target.value };
        });
        setInvoiceDetails({ ...invoiceDetails, lineItems });
    };

    const handleAddLineItem = (event) => {
        setInvoiceDetails({
            ...invoiceDetails,
            // use optimistic uuid for drag drop; in a production app this could be a database id
            lineItems: invoiceDetails.lineItems.concat([{ id: uuidv4(), name: "", description: "", quantity: 0, price: 0.0 }]),
        });
    };

    const handleRemoveLineItem = (elementIndex) => (event) => {
        setInvoiceDetails({
            ...invoiceDetails,
            lineItems: invoiceDetails.lineItems.filter((item, i) => {
                return elementIndex !== i;
            }),
        });
    };

    const handleReorderLineItems = (newLineItems) => {
        setInvoiceDetails({
            ...invoiceDetails,
            lineItems: newLineItems,
        });
    };

    const handleFocusSelect = (event) => {
        event.target.select();
    };

    // save invoice btn click
    const handlePayButtonClick = () => {
        saveInvoice({
            variables: {
                patient_id: props.patient.id,
                payment_mode: invoiceDetails.paymentMode,
                tax_rate: String(invoiceDetails.taxRate),
                line_items: JSON.stringify(invoiceDetails.lineItems),
                total_paid: calcGrandTotal().toFixed(2),
            },
        });
    };

    // edit invoice btn click
    const handleUpdatePayButtonClick = () => {
        updateInvoice({
            variables: {
                payment_mode: invoiceDetails.paymentMode,
                tax_rate: String(invoiceDetails.taxRate),
                line_items: JSON.stringify(invoiceDetails.lineItems),
                total_paid: calcGrandTotal().toFixed(2),
                serial_id: initialSerialId,
            },
        });
    };

    // delete invoice handler
    // delete patient confirm handler
    let [confirmDelete, setConfirmDelete] = React.useState(false);

    const confirmDeleteHandler = () => {
        setConfirmDelete(true);
    };

    const handleDeleteInvoice = () => {
        deleteInvoice({ variables: { serial_id: initialSerialId } });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const calcTaxAmount = (c) => {
        return c * (invoiceDetails.taxRate / 100);
    };

    const calcLineItemsTotal = () => {
        return invoiceDetails.lineItems.reduce((prev, cur) => prev + cur.quantity * cur.price, 0);
    };

    const calcTaxTotal = () => {
        return calcLineItemsTotal() * (invoiceDetails.taxRate / 100);
    };

    const calcGrandTotal = () => {
        return calcLineItemsTotal() + calcTaxTotal();
    };

    const documentTitle = document.title;

    return (
        <React.Fragment>
            <div className="invoice">
                <div className="brand" style={{ textAlign: "center", fontSize: "18px" }}>
                    <ReactToPrint
                        trigger={() => <i className="pe-7s-print icon clickable" id="p-icon-print" style={{ float: "right" }} />}
                        onBeforePrint={() => document.title="Invoice"}
                        onAfterPrint={() => document.title=documentTitle}
                        content={() => this.componentRef}
                        pageStyle={page_style}
                    />
                </div>

                <div className="display-none">
                    <InvoicePrintPreview
                        ref={(el) => (this.componentRef = el)}
                        displayStyle="print"
                        patient={props.patient}
                        initialSerialId={initialSerialId}
                        viewInvoice={props.viewInvoice}
                        items={invoiceDetails.lineItems}
                        currencyFormatter={formatCurrency}
                        invoiceDetails={invoiceDetails}
                        totalPaid={formatCurrency(calcGrandTotal())}
                    />
                </div>
                <InvoiceHead patient={props.patient} initialSerialId={initialSerialId} viewInvoice={props.viewInvoice} />

                <LineItems
                    items={invoiceDetails.lineItems}
                    currencyFormatter={formatCurrency}
                    addHandler={handleAddLineItem}
                    changeHandler={handleLineItemChange}
                    focusHandler={handleFocusSelect}
                    deleteHandler={handleRemoveLineItem}
                    reorderHandler={handleReorderLineItems}
                />

                <div className="totalContainer">
                    <form>
                        <div className="valueTable">
                            <div className="row">
                                <div className="label">Payment Mode</div>
                                <div className="value">
                                    <Input
                                        type="select"
                                        name="title"
                                        id="title"
                                        value={invoiceDetails.paymentMode}
                                        onChange={(e) => {
                                            setInvoiceDetails({ ...invoiceDetails, paymentMode: e.target.value });
                                        }}
                                    >
                                        {Object.keys(PAYMENT_MODE).map((mode) => {
                                            return <option value={PAYMENT_MODE[mode]}>{PAYMENT_MODE[mode]}</option>;
                                        })}
                                    </Input>
                                </div>
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="valueTable">
                            {/* <div className="row">
                              <div className="label">Subtotal</div>
                              <div className="value currency">{formatCurrency(calcLineItemsTotal())}</div>
                            </div> */}
                            {/* <div className="row">
                              <div className="label">Tax ({invoiceDetails.taxRate}%)</div>
                              <div className="value currency">{formatCurrency(calcTaxTotal())}</div>
                            </div> */}
                            <div className="row">
                                <div className="label">To be paid</div>
                                <div className="value currency">{formatCurrency(calcGrandTotal())}</div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="pay">
                    {/* <button className="payNow" >Save</button> */}

                    {Object.keys(props.viewInvoice).length > 0 ? (
                        <div>
                            <Button
                                outline
                                className="mb-2 mr-2 btn-transition"
                                color="primary"
                                onClick={handleUpdatePayButtonClick}
                                disabled={calcGrandTotal() <= 0}
                            >
                                Update
                            </Button>
                            <Button outline className="mb-2 mr-2 btn-transition" color="danger" onClick={confirmDeleteHandler}>
                                Delete
                            </Button>
                        </div>
                    ) : (
                        <Button
                            outline
                            className="mb-2 mr-2 btn-transition"
                            color="primary"
                            onClick={handlePayButtonClick}
                            disabled={calcGrandTotal() <= 0}
                        >
                            Save
                        </Button>
                    )}
                </div>

                <div className="footer">
                    {/* <div className="comments">
                      <h4>Notes</h4>
                      <p>More details or disclaimer to be added here.</p>
                    </div> */}
                    <div className="closing">
                        <div>Thank-you</div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                isOpen={confirmDelete}
                titleContent="Are You Sure You Want To Delete?"
                setConfirmDelete={setConfirmDelete}
                deleteConfirmHandler={handleDeleteInvoice}
            />
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    invoices: state.PaymentReducer.invoices,
});

const mapDispatchToProps = (dispatch) => ({
    setInvoices: (invoices) => dispatch(setInvoices(invoices)),
    setViewInvoice: (invoice) => dispatch(setViewInvoice(invoice)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
