import * as actions from "../actions/paymentActions";

export const initialState = {
    invoices: [],
    invoiceLoading: false,
    hasErrors: false,
    viewInvoice: {},
};

export default function paymentReducer(state = initialState, action) {
    switch (action.type) {
        case actions.SET_INVOICES_LOADING:
            return { ...state, invoiceLoading: true };
        case actions.SET_INVOICES:
            return { ...state, invoiceLoading: false, invoices: action.payload };
        case actions.SET_VIEW_INVOICE:
            return { ...state, viewInvoice: action.payload };
        default:
            return state;
    }
}
