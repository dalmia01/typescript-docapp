import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/react-hooks";

import { isValidResponse } from "../../Utils/Apis/common";
import { safeGet } from "../../Utils/dataUtil";
import { isEmailValid, isValidPhoneNumber } from "../../Utils/validation";
import WelcomeBackModal from "../../Components/WelcomeBackModal";
import { DEFAULT_API_ERROR } from "../../Utils/Constants/messageConstants";
import { FORGET_PASSWORD } from "../../Utils/Graphql/usersGraphql";

const ForgotPassword = (props) => {
    let [forgetPassValues, setForgetPassValues] = React.useState({
        email: "",
        isEmailInvalid: false,
        invalidEmailMsg: "",
        phone: "",
        isPhoneValid: false,
        invalidPhoneMsg: "",
    });

    let [sendForget] = useMutation(FORGET_PASSWORD, {
        variables: forgetPassValues,
        update: (_, data) => {},
        onError: (err) => {
            if (err.graphQLErrors[0].extensions.errors)
                try {
                    if (err.graphQLErrors[0].extensions.errors) {
                        setForgetPassValues({
                            phone: "",
                            isPhoneValid: true,
                            invalidPhoneMsg: err.graphQLErrors[0].extensions.errors.phone,
                        });
                    }
                } catch (errs) {
                    toast.error(DEFAULT_API_ERROR);
                }
        },
    });

    /**
     * Forgot password form logic
     */

    const submitResetLinkBtn = async () => {
        sendForget();
    };

    const isForgotFormValid = () => {
        if (!isEmailValid(forgetPassValues.email)) {
            setForgetPassValues({ isEmailInvalid: true, invalidEmailMsg: "Invalid Email" });

            return false;
        }
        return true;
    };

    const handleForgotPassAPIResponse = (response) => {
        if (!isValidResponse(response)) {
            toast.error(DEFAULT_API_ERROR);
            return;
        }
        if (!response.isSuccess) {
            toast.error(safeGet(response, "error.errorMsg", DEFAULT_API_ERROR));
            return;
        }
        setForgetPassValues({ email: "" });
        toast.success(response.data);
    };

    /**
     * RENDER LOGIC STARTS
     */

    const onInputFieldChange = (e) => {
        const inputFieldChanged = e.target.getAttribute("data-field-name");
        const value = e.target.value;
        switch (inputFieldChanged) {
            case "email":
                setForgetPassValues({
                    email: value,
                    invalidEmailMsg: "",
                    isEmailInvalid: false,
                });
                break;
            case "phone":
                setForgetPassValues({
                    phone: value.replace(/\D/, ""),
                    invalidPhoneMsg: "",
                    isPhoneValid: false,
                });
                break;
            default:
                break;
        }
    };

    const onInputFieldBlur = (e) => {
        const inputFieldChanged = e.target.getAttribute("data-field-name");
        const value = e.target.value;
        switch (inputFieldChanged) {
            case "email":
                if (!isEmailValid(value)) {
                    setForgetPassValues({
                        invalidEmailMsg: "Invalid Email",
                        isEmailInvalid: true,
                    });
                }
                break;
            case "phone":
                if (!isValidPhoneNumber(value)) {
                    setForgetPassValues({
                        invalidPhoneMsg: "Invalid phone number, must contain 10 or more digits",
                        isPhoneValid: true,
                    });
                }
                break;
            default:
                break;
        }
    };

    const renderForm = () => {
        return (
            <Fragment>
                <FormGroup>
                    <a href="javascript:void()" onClick={gotoLoginForm} className="back-icon">
                        <i className="lnr-arrow-left"></i>
                        Go to Login
                    </a>
                </FormGroup>
                <FormGroup>
                    <Label for="otp">Enter Phone</Label>
                    <Input
                        type="tel"
                        pattern="[0-9]*"
                        value={forgetPassValues.phone}
                        onChange={onInputFieldChange}
                        onBlur={onInputFieldBlur}
                        data-field-name="phone"
                        invalid={forgetPassValues.isPhoneValid}
                    />
                    <FormFeedback>{forgetPassValues.invalidPhoneMsg}</FormFeedback>
                </FormGroup>
            </Fragment>
        );
    };

    const gotoLoginForm = () => {
        props.history.goBack();
    };

    return (
        <WelcomeBackModal
            renderForm={renderForm()}
            renderFooter={
                <div className="float-right">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={submitResetLinkBtn}
                        disabled={forgetPassValues.isPhoneValid || forgetPassValues.phone.trim().length < 10}
                    >
                        Send Reset Link
                    </button>
                </div>
            }
        />
    );

    /**
     * RENDER LOGIC ENDS
     */
};

export default withRouter(ForgotPassword);
