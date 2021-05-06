import { Route, Redirect } from "react-router-dom";
import React, { Suspense, lazy, Fragment } from "react";
import { ToastContainer } from "react-toastify";

import AuthRoute from "../Utils/authRoute";

import MasterLayout from "../Layout/MasterLayout";
import PlainLayout from "../Layout/PlainLayout";
import { routeConstants } from "../Utils/Constants/routeConstants";
import PasswordManager from "./PasswordManager";
import Logout from "./Login/logout";
import PatientBookings from "./PatientBookings";

const Home = lazy(() => import("./Home"));
const Prescription = lazy(() => import("./Prescription"));
const FileManager = lazy(() => import("./FileManager"));
const UserManager = lazy(() => import("./UserManager"));
const Login = lazy(() => import("./Login"));
const Appointments = lazy(() => import("./Appointments"));
const Bookings = lazy(() => import("./Bookings"));
// const PasswordManager = lazy(() => import("./PasswordManager"));
const Table = lazy(() => import("./Vaccination"));
const VaccinationDetails = lazy(() => import("./VaccinationDetails"));
const InvoiceManager = lazy(() => import("./InvoiceManager"));
const ClinicManager = lazy(() => import("./ClinicManager"));

const Routes = () => {
    return (
        <Fragment>
            {/* File Manager */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we loading file manager</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.FILE_MANAGER}
                    render={(matchProps) => (
                        <MasterLayout>
                            <FileManager {...matchProps} />
                        </MasterLayout>
                    )}
                />
            </Suspense>
            {/* Invoices Manager */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we loading invoices</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.INVOICES_MANAGER}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={InvoiceManager} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* Clinics Manager */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we loading clinics</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.CLINIC_MANAGER}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={ClinicManager} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* User Manager */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we loading user manager</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.USER_MANAGER}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={UserManager} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* Home */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we loading dashboard</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.HOME}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={Home} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* Prescription */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we load ...</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.PRESCRIPTION}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={Prescription} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* Appointmnets */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we load ...</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.APPOINTMENTS}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={Appointments} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* Bookings */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we load ...</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.BOOKINGS}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={Bookings} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* Patient bookings */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we loading bookings for patient</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.PATIENTS_BOOKING}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={PatientBookings} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* Login */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we loading dashboard</h6>
                        </div>
                    </div>
                }
            >
                <AuthRoute path={routeConstants.LOGIN} component={Login} />
            </Suspense>

            {/* Forgot password */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we loading forgot password screen</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.FORGOT_PASSWORD}
                    render={(matchProps) => (
                        <PlainLayout>
                            <PasswordManager.ForgotPassword {...matchProps} />
                        </PlainLayout>
                    )}
                />
            </Suspense>

            {/* Reset password */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we are loading screen</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.RESET_PASSWORD}
                    render={(matchProps) => (
                        <PlainLayout>
                            <PasswordManager.ResetPasswordWithToken {...matchProps} />
                        </PlainLayout>
                    )}
                />
            </Suspense>

            {/*Table */}
            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we are loading screen</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.VACCINATION}
                    render={(matchProps) => (
                        <PlainLayout>
                            <Table {...matchProps} />
                        </PlainLayout>
                    )}
                />
            </Suspense>

            {/* Vaccination Details*/}

            <Suspense
                fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">Please wait while we are loading screen</h6>
                        </div>
                    </div>
                }
            >
                <Route
                    path={routeConstants.VACCINATION_DETAILS}
                    render={(matchProps) => (
                        <MasterLayout>
                            <AuthRoute {...matchProps} component={VaccinationDetails} protected={true} />
                        </MasterLayout>
                    )}
                />
            </Suspense>

            {/* Logout*/}
            <Route
                path={routeConstants.LOGOUT}
                render={(matchProps) => (
                    <PlainLayout>
                        <Logout {...matchProps} />
                    </PlainLayout>
                )}
            />

            <Route
                exact
                path="/"
                render={() => (
                    <div>
                        <img
                            style={{ width: "100%" }}
                            alt="soon"
                            src="https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/122188813/original/ccb25a230ebf33bab077d9d4d0d1d2e4002eadf4/create-a-coming-soon-page-for-your-website.jpg"
                        />
                    </div>
                )}
            />

            <ToastContainer position="top-center" />
        </Fragment>
    );
};

export default Routes;
