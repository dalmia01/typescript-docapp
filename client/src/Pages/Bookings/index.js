import React from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import { Input } from "reactstrap";
import { toast } from "react-toastify";

import { REVERSE_WEEK_DAYS } from "../../Utils/Constants/commonConstants";
import { DEFAULT_CREATED_SUCCESS } from "../../Utils/Constants/messageConstants";
import { FETCH_USERS } from "../../Utils/Graphql/usersGraphql";
import { FILTER_PATIENT } from "../../Utils/Graphql/patientsGraphql";
import { GET_AVAILABLE_SLOTS, BOOK_APPOINTMENT } from "../../Utils/Graphql/appointmentsGraphql";
import { getDoctorsSuccess, getDoctorsFailure, setPatientToAppoint } from "../../actions/userActions";
import SelectBox from "../../Components/Common/SelectBox";
import "./_index.scss";

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

const Bookings = (props) => {
    // all local states
    let [doctor, setDoctor] = React.useState({ id: "-1" });
    const [bookingDate, setBookingDate] = React.useState("");
    let [availableslots, setAvailableSlots] = React.useState([]);
    let [selectedSlot, setSelectedSlot] = React.useState("-1");
    let [allowSubmit, setAllowSubmit] = React.useState(false);
    let [patients, setPatients] = React.useState([]);
    let [filterPatient, setFilterPatient] = React.useState("");
    let [filterPatientFocus, setFilterPatientFocus] = React.useState(false);

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
    // fetch patients graphql query
    const [fetchPatients] = useLazyQuery(FILTER_PATIENT, {
        onCompleted(data) {
            setPatients(data.patient);
        },
        onError(err) {},
    });

    // on first time load fetch patients and doctors using graphql query request
    React.useEffect(() => {
        fetchDoctors();
        fetchPatients();
    }, []);

    // search again for patient on input search text change
    React.useEffect(() => {
        if (filterPatient.trim().length > 3) {
            fetchPatients({
                variables: { filter: JSON.stringify({ name_phone: filterPatient }) },
            });
        }
    }, [filterPatient]);

    // on change doctor set set doctor state and call graphql getAppointment slots
    const selectDoctorHandler = (e) => {
        setDoctor({ id: e.target.value });
        setBookingDate("");
        setAvailableSlots([]);
        setSelectedSlot("-1");
    };

    //select patient handler and set redux userreducer patient state
    const selectPatientHandler = (patientItem, patientName) => {
        props.setPatientToAppoint({
            id: patientItem.id,
            name: patientName,
        });
        setFilterPatient("");
    };

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

    /**
     * setting modified date
     * @param {String} date - booking date
     * @return {Object} date, day - modified date and day of week
     */

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

    // setting local states to defaults
    const setDefaulStates = () => {
        setDoctor({ id: "-1" });
        setBookingDate("");
        setAvailableSlots([]);
        setSelectedSlot("-1");
        setAllowSubmit(false);
    };

    // make a booking appointment graphql mutation request
    let [bookAppointment] = useMutation(BOOK_APPOINTMENT, {
        update(_, data) {
            setDefaulStates();
            props.setPatientToAppoint();
            toast.success(DEFAULT_CREATED_SUCCESS);
        },
        onError(err) {
            setDefaulStates();
        },
    });

    // book appointment handler
    const bookAppointmentHandler = (e) => {
        e.preventDefault();

        const modifiedDateDetails = settingModifiedDate(bookingDate);

        let bookingDetails = {
            patient_id: props.patient.id,
            doctor_id: doctor.id,
            date: modifiedDateDetails.modifiedDate,
            time: selectedSlot,
            day: modifiedDateDetails.day,
        };

        bookAppointment({
            variables: bookingDetails,
        });
    };

    return (
        <div className="container-fluid">
            <div className="main-card mb-3 card">
                <div className="card-body">
                    <div className="card-title">Schedule an appointment</div>
                    <form className="" onSubmit={bookAppointmentHandler}>
                        <div className="form-row">
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label htmlFor="exampleEmail11" className="">
                                        Select a Patient
                                    </label>
                                    <Input
                                        type="text"
                                        value={filterPatient}
                                        onChange={(e) => setFilterPatient(e.target.value)}
                                        placeholder="select patient"
                                        className="mb-2"
                                        onFocus={() => setFilterPatientFocus(true)}
                                    />
                                    <div className="main-card mb-3 card">
                                        <div className="">
                                            {filterPatient.trim().length > 0 && filterPatientFocus ? (
                                                <ul className="list-group max-ht-200 flow-auto">
                                                    {patients &&
                                                        patients.length > 0 &&
                                                        patients.map((patientItem) => {
                                                            let patientName = `${patientItem.first_name} ${patientItem.last_name}`;
                                                            return (
                                                                patientName.trim().toLowerCase().includes(filterPatient.toLowerCase()) && (
                                                                    <li
                                                                        className="list-group-item selct-single-item"
                                                                        style={{ padding: 10 }}
                                                                        key={"patient" + patientItem.id}
                                                                        onClick={() => selectPatientHandler(patientItem, patientName)}
                                                                    >
                                                                        {patientName} {patientItem.phone ? "| " + patientItem.phone : ""}
                                                                    </li>
                                                                )
                                                            );
                                                        })}
                                                </ul>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="exampleEmail11" className="">
                                        Patient Name
                                    </label>

                                    <Input
                                        type="text"
                                        disabled
                                        placeholder="No patient selected yet"
                                        value={props.patient && Object.keys(props.patient).length > 0 ? props.patient.name : ""}
                                    />
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="exampleEmail11" className="">
                                        Choose a Doctor
                                    </label>
                                    <SelectBox
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
                            <div className="col-md-2">
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
                                                    disabled={doctor.id === "-1"}
                                                    placeholderText="Select doctor to enable"
                                                    className="flex-content"
                                                />
                                            }
                                            className="flex-content"
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()}
                                            showYearDropdown
                                            showMonthDropdown
                                            disabled={doctor.id === "-1"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
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
                                        disabled={doctor.id === "-1" || availableslots.length <= 0}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-check">
                            <input
                                name="check"
                                id="exampleCheck"
                                type="checkbox"
                                className="form-check-input"
                                value={allowSubmit}
                                checked={allowSubmit}
                                onChange={() => setAllowSubmit(!allowSubmit)}
                            />
                            <label htmlFor="exampleCheck" className="form-check-label">
                                Please check to allow booking
                            </label>
                        </div>
                        <button
                            className="mt-2 btn btn-primary"
                            disabled={!(doctor.id !== "-1" && bookingDate !== "" && allowSubmit && props.patient && props.patient.id)}
                        >
                            Submit
                        </button>
                    </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Bookings);
