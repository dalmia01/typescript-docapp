export const SET_INVOICES_LOADING = "SET_INVOICES_LOADING";
export const SET_INVOICES = "SET_INVOICES";
export const SET_VIEW_INVOICE = "SET_VIEW_INVOICE";

export const setInvoicesLoading = () => ({
    type: SET_INVOICES_LOADING,
});

export const setInvoicesSuccess = (invoices) => ({
    type: SET_INVOICES,
    payload: invoices,
});

export const setViewInvoice = (invoice) => ({
    type: SET_VIEW_INVOICE,
    payload: invoice,
});

/**
 * fetch invoices
 * @param {[Object]} invoices - all invoices
 * @return {function} dispatch - setting invoices dispatcher
 */
export function setInvoices(invoices) {
    return async (dispatch) => {
        try {
            await dispatch(setInvoicesSuccess(invoices));
        } catch (err) {}
    };
}
