import gql from "graphql-tag";

const FETCH_INVOICES = gql`
    query($patient_id: String, $unique: String, $filter_criteria: String, $start: Date) {
        invoices: fetchInvoices(patient_id: $patient_id, unique: $unique, filter_criteria: $filter_criteria, start: $start) {
            serial_id
            patient_id {
                first_name
                last_name
                phone
            }
            payment_mode
            created_at
            updated_at
            tax_rate
            total_paid
            line_items {
                input_id
                name
                description
                quantity
                price
            }
        }
    }
`;

const SAVE_INVOICE = gql`
    mutation($patient_id: String, $payment_mode: String, $tax_rate: String, $line_items: String, $total_paid: String) {
        invoice: saveInvoice(
            patient_id: $patient_id
            payment_mode: $payment_mode
            tax_rate: $tax_rate
            line_items: $line_items
            total_paid: $total_paid
        ) {
            serial_id
            payment_mode
            created_at
            updated_at
            tax_rate
            total_paid
            line_items {
                input_id
                name
                description
                quantity
                price
            }
        }
    }
`;

const UPDATE_INVOICE = gql`
    mutation($serial_id: Int, $payment_mode: String, $tax_rate: String, $line_items: String, $total_paid: String) {
        invoice: updateInvoice(
            serial_id: $serial_id
            payment_mode: $payment_mode
            tax_rate: $tax_rate
            line_items: $line_items
            total_paid: $total_paid
        ) {
            serial_id
            payment_mode
            created_at
            updated_at
            tax_rate
            total_paid
            line_items {
                input_id
                name
                description
                quantity
                price
            }
        }
    }
`;

const DELETE_INVOICE = gql`
    mutation($serial_id: Int) {
        deleteInvoice(serial_id: $serial_id)
    }
`;

export { SAVE_INVOICE, UPDATE_INVOICE, DELETE_INVOICE, FETCH_INVOICES };
