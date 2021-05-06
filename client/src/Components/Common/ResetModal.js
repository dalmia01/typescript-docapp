import React from "react";
import { Modal, Input } from "reactstrap";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { connect } from "react-redux";

import { RESET_PASSWORD } from "../../Utils/Graphql/usersGraphql";
import { setAuthLogout } from "../../actions/authActions";

let initalResetValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const ResetModal = (props) => {
    let [resetButtonAbility, setResetButtonAbility] = React.useState(false);
    let [resetValues, setResetValues] = React.useState(Object.assign({}, initalResetValues));
    let [sigInError, setSignInError] = React.useState("");

    let [resetPassword] = useMutation(RESET_PASSWORD, {
        variables: {
            oldPassword: resetValues.oldPassword,
            newPassword: resetValues.newPassword,
        },
        update(_, data) {
            toast.success("Password Reset Successfully done !!!");
            setTimeout(() => {
                props.setAuthLogout();
            }, 3000);
        },
        onError(err) {
            setSignInError(err.graphQLErrors[0].extensions.errors);
        },
    });

    // reset form values on change handler - setting local state
    const valuesChangeHandler = (e) => {
        setResetValues({ ...resetValues, [e.target.name]: e.target.value });
    };

    // reset form values to inital values and close reset modal
    const closeHandler = () => {
        setResetValues(Object.assign({}, initalResetValues));
        props.setConfirmPassword({ visibility: false });
    };

    React.useEffect(() => {
        // checking the resetFromValues validation criteria - diabing / able reset button
        if (
            resetValues.oldPassword.trim().length !== "" &&
            resetValues.newPassword.trim().length >= 3 &&
            resetValues.confirmPassword.trim() === resetValues.newPassword.trim()
        ) {
            setResetButtonAbility(true);
        } else {
            setResetButtonAbility(false);
        }
    }, [resetValues]);

    return (
        <Modal isOpen={props.isOpen}>
            <div className="modal-header">
                <h5 className="modal-title">Reset Password</h5>
                <button className="close" onClick={closeHandler}>
                    ×
                </button>
            </div>
            <div className="modal-body">
                <div className="errors">
                    {Object.keys(sigInError).map((error, index) => (
                        <div key={"error" + index}>{sigInError[error]}</div>
                    ))}
                </div>

                <form className="">
                    <div className="form-row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="oldPassword" className="">
                                    Old Password
                                </label>
                                <Input
                                    type="password"
                                    name="oldPassword"
                                    placeholder="old password"
                                    value={resetValues.oldPassword}
                                    onChange={valuesChangeHandler}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="newPassword" className="">
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    name="newPassword"
                                    placeholder="new password"
                                    value={resetValues.newPassword}
                                    onChange={valuesChangeHandler}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="">
                                    Confirm Password
                                </label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="confirm password"
                                    value={resetValues.confirmPassword}
                                    onChange={valuesChangeHandler}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-link" onClick={closeHandler}>
                    Cancel
                </button>
                <button type="button" className="btn btn-success" disabled={!resetButtonAbility} onClick={resetPassword}>
                    Reset
                </button>
            </div>
        </Modal>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetModal);
