import React, { Fragment, useRef, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { connect } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";

import WelcomeBackModal from "../../Components/WelcomeBackModal";
import { isValidPhoneNumber } from "../../Utils/validation";
import { routeConstants } from "../../Utils/Constants/routeConstants";

import { LOGIN_MUTATION } from "../../Utils/Graphql/usersGraphql";
import { DEFAULT_API_ERROR } from "../../Utils/Constants/messageConstants";
import { setAuthLogin } from "../../actions/authActions";

import "./_index.scss";

const Login = (props) => {
    const [formValues, setFormValues] = React.useState({
        phone: "",
        password: "",
        otp: "",
        isPhoneInvalid: false,
        invalidPhoneMsg: "",
        isPasswordInvalid: false,
        invalidPasswordMsg: "",
        isOtpInvalid: false,
        invalidOtpMsg: "",
        showOtpForm: false,
        loginButtonText: "Login",
    });

    let [sigInError, setSignInError] = React.useState("");

    const phoneElement = useRef(null);

    useEffect(() => {
        if (phoneElement.current) {
            phoneElement.current.focus();
        }
    }, []);

    const [loginUser] = useMutation(LOGIN_MUTATION, {
        variables: { phone: formValues.phone, password: formValues.password },
        update(_, data) {
            //  props.setAuthLogin(data.data.sigInUser);
            props.dispatch(setAuthLogin(data.data.sigInUser));
        },
        onError(err) {
            try {
                if (err.graphQLErrors[0].extensions.errors) {
                    setSignInError(err.graphQLErrors[0].extensions.errors);
                }
            } catch (err) {
                toast.error(DEFAULT_API_ERROR);
            }
        },
    });

    /**
     * Login form logic start
     */

    const submitLoginBtn = async () => {
        loginUser();
    };

    /**
     * RENDER LOGIC STARTS
     */

    const onInputFieldChange = (e) => {
        const inputFieldChanged = e.target.getAttribute("data-field-name");
        const value = e.target.value;
        switch (inputFieldChanged) {
            case "phone":
                setFormValues({
                    ...formValues,
                    phone: e.target.value.replace(/\D/, ""),
                    invalidPhoneMsg: "",
                    isPhoneInvalid: false,
                });

                setSignInError("");
                break;
            case "password":
                setFormValues({
                    ...formValues,
                    password: value,
                    isPasswordInvalid: false,
                    invalidPasswordMsg: "",
                });
                break;
            case "otp":
                setFormValues({
                    ...formValues,
                    otp: value,
                    isOtpInvalid: false,
                    invalidOtpMsg: "",
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
            case "phone":
                if (!isValidPhoneNumber(value)) {
                    setFormValues({
                        ...formValues,
                        invalidPhoneMsg: "Invalid phone number, must contain 10 or more digits",
                        isPhoneInvalid: true,
                    });
                }
                break;
            case "password":
                if (!value) {
                    setFormValues({
                        ...formValues,
                        invalidPasswordMsg: "Invalid Password",
                        isPasswordInvalid: true,
                    });
                }
                break;
            case "otp":
                if (!value && formValues.showOtpForm) {
                    setFormValues({
                        ...formValues,
                        invalidOtpMsg: "Invalid OTP",
                        isOtpInvalid: true,
                    });
                }
                break;
            default:
                break;
        }
    };

    const renderRecoveryPasswordLink = () => {
        if (formValues.showOtpForm) {
            return null;
        }
        return (
            <div className="float-left">
                <Link to={routeConstants.FORGOT_PASSWORD}>Recover Password</Link>
            </div>
        );
    };

    const renderPasswordField = () => {
        return (
            <FormGroup>
                <Label for="password">Password</Label>
                <Input
                    type="password"
                    value={formValues.password}
                    onChange={onInputFieldChange}
                    onBlur={onInputFieldBlur}
                    data-field-name="password"
                    invalid={formValues.isPasswordInvalid}
                />
                <FormFeedback>{formValues.invalidPasswordMsg}</FormFeedback>
            </FormGroup>
        );
    };

    const renderLoginForm = () => {
        return (
            <Fragment>
                <div className="errors">
                    {Object.keys(sigInError).map((error, index) => (
                        <div key={"error" + index}>{sigInError[error]}</div>
                    ))}
                </div>
                <FormGroup>
                    <Label for="name">Phone number</Label>
                    <Input
                        type="text"
                        pattern="[0-9]*"
                        value={formValues.phone}
                        onChange={onInputFieldChange}
                        onBlur={onInputFieldBlur}
                        data-field-name="phone"
                        invalid={formValues.isPhoneInvalid}
                        autoFocus
                        ref={phoneElement}
                    />
                    <FormFeedback>{formValues.invalidPhoneMsg}</FormFeedback>
                </FormGroup>
                {renderPasswordField()}
            </Fragment>
        );
    };

    const renderOtpForm = () => {
        return (
            <Fragment>
                <FormGroup>
                    <Link onClick={gotoLoginForm} className="back-icon">
                        <i className="lnr-arrow-left"></i>
                        Back
                    </Link>
                </FormGroup>
                <FormGroup>
                    <Label for="otp">Enter OTP</Label>
                    <Input
                        type="number"
                        value={formValues.otp}
                        onChange={onInputFieldChange}
                        onBlur={onInputFieldBlur}
                        data-field-name="otp"
                        invalid={formValues.isOtpInvalid}
                    />
                    <FormFeedback>{formValues.invalidOtpMsg}</FormFeedback>
                </FormGroup>
            </Fragment>
        );
    };

    const renderForm = () => {
        return formValues.showOtpForm ? renderOtpForm() : renderLoginForm();
    };

    const gotoLoginForm = () => {
        setFormValues({ ...formValues, showOtpForm: false });
    };

    const triggerResendOtp = (e) => {
        e.preventDefault();
    };

    const submitVerifyOtpBtn = () => {};

    const renderSubmitBtn = () => {
        if (formValues.showOtpForm) {
            // render verify OTP button and resend link.
            return (
                <Fragment>
                    <a href="" onClick={triggerResendOtp} className="resend-link">
                        Resend
                    </a>
                    <button className="btn btn-primary btn-lg" onClick={submitVerifyOtpBtn}>
                        Verify OTP
                    </button>
                </Fragment>
            );
        }
        // render login button (Login | Login with SSO)
        return (
            <button
                className="btn btn-primary btn-lg"
                onClick={submitLoginBtn}
                disabled={
                    formValues.isPhoneInvalid ||
                    formValues.isPasswordInvalid ||
                    formValues.phone.trim().length < 10 ||
                    formValues.password.trim().length < 1
                }
            >
                {formValues.loginButtonText}
            </button>
        );
    };

    return (
        <WelcomeBackModal
            renderForm={renderForm()}
            renderFooter={
                <Fragment>
                    {renderRecoveryPasswordLink()}
                    <div className="float-right">{renderSubmitBtn()}</div>
                </Fragment>
            }
        />
    );

    /**
     * RENDER LOGIC ENDS
     */
};

const mapStateToProps = (state) => ({});

export default withRouter(connect(mapStateToProps)(Login));
