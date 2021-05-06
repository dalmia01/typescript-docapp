import React, { Fragment } from "react";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";
import { Row, Col, Card } from "reactstrap";
import { useLazyQuery } from "@apollo/react-hooks";
import moment from "moment";
import { setAuthLogout } from "../../actions/authActions";
import { setPopUpModal } from "../../reducers/ThemeOptions";
import EmptyState from "../../Components/Common/EmptyState";
import { handleCommonError } from "../../Utils/validation";
import { FETCH_INVOICES } from "../../Utils/Graphql/invoiceGraphql";
import CustomSelect from "../../Components/Common/CustomSelect";
import { daysDateTypes } from "../../Utils/helperFunctions";

const InvoiceManager = (props) => {
    let [invoices, setInvoices] = React.useState([]);
    let [filterByDate, setFilterByDate] = React.useState("Select");
    /**
     *  graphql request to fetch invoices
     */

    const [fetchInvoices] = useLazyQuery(FETCH_INVOICES, {
        onCompleted(data) {
            setInvoices(data.invoices);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    React.useEffect(() => {
        fetchInvoices({ variables: { filter_criteria: "", unique_id: uuid(), start: new Date(), end: new Date() } });
    }, []);

    React.useEffect(() => {
        fetchInvoices({ variables: { filter_criteria: "", unique_id: uuid(), start: new Date(), end: new Date() } });
    }, [props.popUpModalContent]);

    /**
     * all invoices list && jsx
     */

    let allInvoices = [];

    if (invoices.length > 0) {
        allInvoices = invoices.map((invoice, index) => {
            return (
                <tr key={invoice.serial_id}>
                    <td className=" text-muted">{index + 1}</td>
                    <td>
                        <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                                <div className="widget-content-left flex2">
                                    <div className="widget-heading">{invoice.serial_id}</div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        {invoice.patient_id.first_name} {invoice.patient_id.last_name}
                    </td>
                    <td>{invoice.patient_id.phone}</td>
                    <td className="">{invoice.payment_mode}</td>
                    <td className="">
                        <div className="">
                            {invoice.updated_at
                                ? moment(invoice.updated_at).format("DD/MM/YYYY")
                                : moment(invoice.created_at).format("DD/MM/YYYY")}
                        </div>
                    </td>
                    <td className="">
                        <div className="">INR {invoice.total_paid}</div>
                    </td>
                </tr>
            );
        });
    }

    const invoiceSalesTotal = () => {
        return invoices.reduce((acc, curr) => acc + Number(curr.total_paid), 0);
    };

    /**
     *  all invoices list && jsx
     */

    const onDateChange = (value) => {
        setFilterByDate(value);
        let [days, daydateType] = daysDateTypes(value);
        let endDate = new Date();
        let startDate = moment(endDate).subtract(days, daydateType);

        if (value === "Select") {
        } else {
            fetchInvoices({ variables: { filter_criteria: "By Date", unique_id: uuid(), start: startDate, end: endDate } });
        }
    };

    return (
        <Fragment>
            <Row style={{ margin: "0px" }}>
                <div class="card mb-3 widget-chart widget-chart2 text-left card-btm-border card-shadow-success border-success">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content text-center">
                            <span class="widget-subheading mb-0 opacity-5 ">Sales</span>
                            <div class="widget-chart-flex">
                                <div class="widget-numbers">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-2">
                                            <small class="opacity-5">INR </small>
                                            <span>{invoiceSalesTotal()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h6 class="widget-subheading mb-0 opacity-5 ">{filterByDate === "Select" ? "" : filterByDate}</h6>
                        </div>
                    </div>
                </div>
            </Row>

            <Row>
                <Col md="12">
                    <Card className="main-card mb-3 text-capitalize">
                        <Row className="card-header" style={{ margin: "0px" }}>
                            <Col md={10}>
                                <div>Invoices</div>
                            </Col>
                            <Col md={2}>
                                <div>
                                    <CustomSelect
                                        name="dosageForm"
                                        value={filterByDate}
                                        possible_values={["Select", "Today", "Last 7 Days", "Last 30 Days", "Last 3 Months", "Last Year"]}
                                        defaultValue={filterByDate}
                                        valuesChangeHandler={(value) => onDateChange(value)}
                                    />
                                </div>
                            </Col>
                        </Row>

                        {allInvoices.length > 0 ? (
                            <div className="table-responsive">
                                <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th className="">#</th>
                                            <th>Invoice Id</th>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Payment Mode</th>
                                            <th>Date</th>
                                            <th>Total Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <React.Fragment>{allInvoices}</React.Fragment>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState content="No invoices found" />
                        )}
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({ popUpModalContent: state.ThemeOptions.popUpModalContent });

const mapDispatchToProps = (dispatch) => ({
    setPopUpModal: (popUpModal) => dispatch(setPopUpModal(popUpModal)),
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceManager);
