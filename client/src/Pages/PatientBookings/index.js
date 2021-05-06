import React from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import DatePicker from "react-datepicker";
import { Input } from "reactstrap";
import { connect } from "react-redux";

import { REVERSE_WEEK_DAYS } from "../../Utils/Constants/commonConstants";
import { FETCH_USERS } from "../../Utils/Graphql/usersGraphql";
import { GET_AVAILABLE_SLOTS } from "../../Utils/Graphql/appointmentsGraphql";
import { getDoctorsSuccess, getDoctorsFailure, setPatientToAppoint } from "../../actions/userActions";
import SelectBox from "../../Components/Common/SelectBox";
import { SEND_OTP_BOOKING, BOOK_APPOINTMENT_BY_PATIENT } from "../../Utils/Graphql/patientBookingsGraphql";

class DateView extends React.Component {
    render() {
        let value = this.props.value === "" ? "Please Select Date" : this.props.value;

        return (
            <Input
                type="button"
                value={this.props.disabled ? this.props.placeholderText : value}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
                placeholder="Please Select Date"
            />
        );
    }
}

const PatientBookings = (props) => {
    let [patient, setPatient] = React.useState({ firstName: "", lastName: "", phone: "" });
    let [doctor, setDoctor] = React.useState({ id: "-1" });
    const [bookingDate, setBookingDate] = React.useState("");
    let [availableslots, setAvailableSlots] = React.useState([]);
    let [selectedSlot, setSelectedSlot] = React.useState("-1");
    let [otpSendAlready, setOtpSendAlready] = React.useState(false);
    let [hash, setHash] = React.useState("");
    let [otp, setOtp] = React.useState("");

    // setting local states to defaults
    const setDefaulStates = () => {
        setPatient({ firstName: "", lastName: "", phone: "" });
        setDoctor({ id: "-1" });
        setBookingDate("");
        setAvailableSlots([]);
        setSelectedSlot("-1");
        setOtpSendAlready(false);
        setOtp("");
        setHash("");
    };

    // fetch doctors graphql query
    const [fetchDoctors] = useLazyQuery(FETCH_USERS, {
        variables: { filter: "doctor" },
        onCompleted(data) {
            props.getDoctorsSuccess(data);
        },
        onError(err) {
            props.getDoctorsFailure();
        },
    });

    // graphql  query to fetch available slots for particular doctor on particular date
    const [fetchAvailableSlots] = useLazyQuery(GET_AVAILABLE_SLOTS, {
        onCompleted(data) {
            if (data.slots) {
                setAvailableSlots(data.slots);
            } else {
                setAvailableSlots([]);
            }
        },
        onError(err) {
            setAvailableSlots([]);
        },
    });

    // on change doctor set set doctor state and call graphql getAppointment slots
    const selectDoctorHandler = (e) => {
        setDoctor({ id: e.target.value });
        setBookingDate("");
        setAvailableSlots([]);
        setSelectedSlot("-1");
    };

    const settingModifiedDate = (date) => {
        let day = date.getDay();
        day = REVERSE_WEEK_DAYS[day];

        let dayDate = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        let month = date.getMonth() + 1;
        month = month > 9 ? month : "0" + month;
        let year = date.getFullYear();
        let modifiedDate = `${dayDate}/${month}/${year}`;

        return {
            day,
            modifiedDate,
        };
    };

    // booking date handler
    const settingBookingDateHandler = (date) => {
        const modifiedDateDetails = settingModifiedDate(date);
        setBookingDate(date);
        fetchAvailableSlots({
            variables: {
                id: doctor.id,
                day: modifiedDateDetails.day,
                date: modifiedDateDetails.modifiedDate,
            },
        });
    };

    // set slot handler
    const setSelectedSlotHandler = (e) => {
        setSelectedSlot(e.target.value);
    };

    // send otp handler

    // make a booking appointment graphql mutation request
    let [sendOtpBooking] = useMutation(SEND_OTP_BOOKING, {
        update(_, data) {
            console.log("data::", data.data.patientBooking);
            setHash(data.data.patientBooking);
        },
        onError(err) {},
    });

    const sendOtpHandler = () => {
        setOtpSendAlready(true);
        let otpDetails = {
            first_name: patient.firstName,
            last_name: patient.lastName,
            phone: patient.phone,
        };
        sendOtpBooking({
            variables: otpDetails,
        });
    };

    // make a booking appointment graphql mutation request
    let [bookAppointementByPatient] = useMutation(BOOK_APPOINTMENT_BY_PATIENT, {
        update(_, data) {
            setDefaulStates();
            //toast.success(DEFAULT_CREATED_SUCCESS);
        },
        onError(err) {
            setDefaulStates();
        },
    });

    // const confirm patient booking
    const bookAppointementByPatientHandler = () => {
        const modifiedDateDetails = settingModifiedDate(bookingDate);
        let bookingDetails = {
            first_name: patient.firstName,
            last_name: patient.lastName,
            phone: patient.phone,
            doctor_id: doctor.id,
            date: modifiedDateDetails.modifiedDate,
            time: selectedSlot,
            day: modifiedDateDetails.day,
            otp: otp,
            hash: hash,
        };

        console.log("booking details :: ", bookingDetails);

        bookAppointementByPatient({
            variables: bookingDetails,
        });
    };

    // on first time load fetch patients and doctors using graphql query request
    React.useEffect(() => {
        fetchDoctors();
    }, []);
    return (
        <div className="container-fluid" style={{ width: "60%" }}>
            <div className="card-hover-shadow-2x mb-3 card">
                <div className="card-header-tab card-header">
                    <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                        <i className="header-icon lnr-calendar-full icon-gradient bg-amy-crisp"> </i>Book an appointment
                    </div>
                </div>

                <div className="d-block  card-footer">
                    <div className="form-row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="patientFirstName" className="">
                                    First Name
                                </label>
                                <input
                                    readOnly={otpSendAlready}
                                    name="patientFirstName"
                                    id="patientFirstName"
                                    placeholder="first name of the patient"
                                    type="text"
                                    className="form-control"
                                    value={patient.firstName}
                                    onChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="exampleEmail11" className="">
                                    Last Name
                                </label>
                                <input
                                    readOnly={otpSendAlready}
                                    name="patientLastName"
                                    id="patientLastName"
                                    placeholder="last name of the patient"
                                    type="text"
                                    className="form-control"
                                    value={patient.patientLastName}
                                    onChange={(e) => setPatient({ ...patient, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="examplePassword11" className="">
                                    Phone Number
                                </label>
                                <input
                                    readOnly={otpSendAlready}
                                    name="patientPhone"
                                    id="patientPhone"
                                    placeholder="patient phone number"
                                    type="text"
                                    className="form-control"
                                    value={patient.phone}
                                    onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="" style={{ display: "flex", width: "100%" }}>
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="exampleEmail11" className="">
                                        Choose a Doctor
                                    </label>
                                    <SelectBox
                                        disabled={otpSendAlready}
                                        selectHandler={selectDoctorHandler}
                                        value={doctor.id || "-1"}
                                        defaultText="Select Doctor"
                                        options={
                                            props.doctors.users &&
                                            props.doctors.users.length > 0 &&
                                            props.doctors.users.map((user) => {
                                                return {
                                                    id: user.id,
                                                    key: `doctors-${user.id}`,
                                                    value: user.id,
                                                    text: `${user.first_name} ${user.last_name}`,
                                                };
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="">
                                <div className="form-group">
                                    <label htmlFor="examplePassword11" className="">
                                        Select Date
                                    </label>
                                    <div>
                                        <DatePicker
                                            selected={bookingDate}
                                            onChange={(date) => settingBookingDateHandler(date)}
                                            customInput={
                                                <DateView
                                                    disabled={doctor.id === "-1" || otpSendAlready}
                                                    placeholderText="Select doctor to enable"
                                                    className="flex-content"
                                                />
                                            }
                                            className="flex-content"
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()}
                                            showYearDropdown
                                            showMonthDropdown
                                            disabled={doctor.id === "-1" || otpSendAlready}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="exampleAddress" className="">
                                        Available Slots
                                    </label>

                                    <SelectBox
                                        selectHandler={setSelectedSlotHandler}
                                        value={selectedSlot || "-1"}
                                        defaultText={
                                            doctor.id === "-1" || availableslots.length > 0
                                                ? "Select Slot"
                                                : availableslots.length <= 0 &&
                                                  bookingDate !== "" &&
                                                  "No slots Available - choose another date"
                                        }
                                        options={
                                            availableslots.length > 0 &&
                                            availableslots.map((slot, index) => {
                                                return {
                                                    id: index,
                                                    key: `slots-${index}`,
                                                    value: slot,
                                                    text: slot,
                                                };
                                            })
                                        }
                                        disabled={doctor.id === "-1" || availableslots.length <= 0 || otpSendAlready}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {otpSendAlready ? (
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="examplePassword11" className="">
                                    Type Otp
                                </label>
                                <div>
                                    <input
                                        name="otp"
                                        id="otp"
                                        placeholder="type otp"
                                        type="text"
                                        className="form-control"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn-shadow btn-wide btn-pill btn btn-focus"
                                onClick={bookAppointementByPatientHandler}
                                disabled={!(otp !== "")}
                            >
                                Get Booking
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn-shadow btn-wide btn-pill btn btn-focus"
                            disabled={
                                !(
                                    doctor.id !== "-1" &&
                                    bookingDate !== "" &&
                                    selectedSlot !== "-1" &&
                                    patient.firstName !== "" &&
                                    patient.lastName !== "" &&
                                    patient.phone !== ""
                                )
                            }
                            onClick={sendOtpHandler}
                        >
                            Get Otp
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    doctors: state.UserReducer.doctors,
    patient: state.UserReducer.patient,
});

const mapDispatchToProps = (dispatch) => ({
    getDoctorsSuccess: (data) => dispatch(getDoctorsSuccess(data)),
    getDoctorsFailure: () => dispatch(getDoctorsFailure()),
    setPatientToAppoint: (patient) => dispatch(setPatientToAppoint(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientBookings);
