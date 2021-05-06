import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { toast } from "react-toastify";
import api from "./api";
import { isValidResponse } from "../../Utils/Apis/common";
import { safeGet } from "../../Utils/dataUtil";
import WelcomeBackModal from "../../Components/WelcomeBackModal";
import { DEFAULT_API_ERROR } from "../../Utils/Constants/messageConstants";
import { routeConstants } from "../../Utils/Constants/routeConstants";

class ResetPasswordWithToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",
            token: props.match.params.token || "",
            isPasswordInvalid: false,
            invalidPasswordMsg: "",
            isConfirmPasswordInvalid: false,
            invalidConfirmPasswordMsg: "",
            isPasswordResetDone: false,
        };
        this.isResetPasswordInProgress = false;
    }

    /**
     * Reset password form logic
     */

    submitResetPasswordBtn = async () => {
        if (this.isResetPasswordInProgress) {
            return;
        }
        if (!this.isResetPasswordFormValid()) {
            return;
        }
        this.isResetPasswordInProgress = true;
        const response = await api.makeResetPasswordCall({
            token: this.state.token,
            newPassword: this.state.password,
        });
        this.isResetPasswordInProgress = false;
        this.handleResetPassAPIResponse(response);
    };

    isResetPasswordFormValid = () => {
        if (!this.state.password) {
            this.setState({
                isPasswordInvalid: true,
                invalidPasswordMsg: "Invalid Password",
            });
            return false;
        }
        if (!this.state.confirmPassword) {
            this.setState({
                isConfirmPasswordInvalid: true,
                invalidConfirmPasswordMsg: "Invalid Confirm Password",
            });
            return false;
        }
        if (this.state.confirmPassword !== this.state.password) {
            this.setState({
                isConfirmPasswordInvalid: true,
                invalidConfirmPasswordMsg: "Password not matched",
            });
            return false;
        }
        return true;
    };

    handleResetPassAPIResponse = (response) => {
        if (!isValidResponse(response)) {
            toast.error(DEFAULT_API_ERROR);
            return;
        }
        if (!response.isSuccess) {
            toast.error(safeGet(response, "error.errorMsg", DEFAULT_API_ERROR));
            return;
        }
        this.setState({
            isPasswordResetDone: true,
        });
    };

    /**
     * RENDER LOGIC STARTS
     */

    onInputFieldChange = (e) => {
        const inputFieldChanged = e.target.getAttribute("data-field-name");
        const value = e.target.value;
        switch (inputFieldChanged) {
            case "password":
                this.setState({
                    password: value,
                    invalidPasswordMsg: "",
                    isPasswordInvalid: false,
                });
                break;
            case "confirmPassword":
                this.setState({
                    confirmPassword: value,
                    invalidConfirmPasswordMsg: "",
                    isConfirmPasswordInvalid: false,
                });
                break;
            default:
                break;
        }
    };

    onInputFieldBlur = (e) => {
        const inputFieldChanged = e.target.getAttribute("data-field-name");
        const value = e.target.value;
        switch (inputFieldChanged) {
            case "password":
                if (!value) {
                    this.setState({
                        invalidPasswordMsg: "Invalid Password",
                        isPasswordInvalid: true,
                    });
                }
                break;
            case "confirmPassword":
                if (!value) {
                    this.setState({
                        invalidConfirmPasswordMsg: "Invalid Confirm Password",
                        isConfirmPasswordInvalid: true,
                    });
                    break;
                }
                if (value !== this.state.password) {
                    this.setState({
                        invalidConfirmPasswordMsg: "Password not matched",
                        isConfirmPasswordInvalid: true,
                    });
                }
                break;
            default:
                break;
        }
    };

    renderResetBtn = () => {
        return (
            <div className="float-right">
                <button className="btn btn-primary btn-lg" onClick={this.submitResetPasswordBtn}>
                    Reset password
                </button>
            </div>
        );
    };

    renderLoginBtn = () => {
        return (
            <div className="float-right">
                <button className="btn btn-primary btn-lg" onClick={() => this.props.history.replace(routeConstants.LOGIN)}>
                    Go to Login
                </button>
            </div>
        );
    };

    renderSuccessMessage = () => {
        return <h4>Your password has been reset successfully.</h4>;
    };

    renderForm = () => {
        return (
            <Fragment>
                <FormGroup>
                    <Label for="otp">Enter Password</Label>
                    <Input
                        type="password"
                        value={this.state.password}
                        onChange={this.onInputFieldChange}
                        onBlur={this.onInputFieldBlur}
                        data-field-name="password"
                        invalid={this.state.isPasswordInvalid}
                    />
                    <FormFeedback>{this.state.invalidPasswordMsg}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="otp">Confirm Password</Label>
                    <Input
                        type="password"
                        value={this.state.email}
                        onChange={this.onInputFieldChange}
                        onBlur={this.onInputFieldBlur}
                        data-field-name="confirmPassword"
                        invalid={this.state.isConfirmPasswordInvalid}
                    />
                    <FormFeedback>{this.state.invalidConfirmPasswordMsg}</FormFeedback>
                </FormGroup>
            </Fragment>
        );
    };

    render() {
        return (
            <WelcomeBackModal
                renderForm={this.state.isPasswordResetDone ? this.renderSuccessMessage() : this.renderForm()}
                renderFooter={this.state.isPasswordResetDone ? this.renderLoginBtn() : this.renderResetBtn()}
            />
        );
    }
    /**
     * RENDER LOGIC ENDS
     */
}

export default withRouter(ResetPasswordWithToken);
