import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { connect } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";

import EmptyState from "../../Components/Common/EmptyState";
import { FETCH_USERS } from "../../Utils/Graphql/usersGraphql";
import { SET_APPOINTMENT_SLOTS, GET_APPOINTMENTS_SLOTS } from "../../Utils/Graphql/appointmentsGraphql";
import {
    getDoctors,
    getDoctorsSuccess,
    getDoctorsFailure,
    getAppointmentsSlots,
    getAppointmentsSlotsSuccess,
    getAppointmentsSlotsFailure,
} from "../../actions/userActions";
import { TableHead, TimePickers } from "../../Components/Appointments/TableContent";
import { DEFAULT_CREATED_SUCCESS } from "../../Utils/Constants/messageConstants";
import { handleCommonError } from "../../Utils/validation";
import SelectBox from "../../Components/Common/SelectBox";
import { setAuthLogout } from "../../actions/authActions";

const Appointments = (props) => {
    // setting initial time slots && intial doctor to set weekly time slots
    let [timeSlots, setTimeSlots] = React.useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    });

    let [doctor, setDoctor] = React.useState({ id: "-1" });

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

    // set save time slots fro graphql mutation type
    const [setAppointmentsSlots] = useMutation(SET_APPOINTMENT_SLOTS, {
        update(_, data) {
            toast.success(DEFAULT_CREATED_SUCCESS);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // on save button click set tiem slots for particular doctor in database using graphql mutation
    const appointmentsSlotsHandler = () => {
        Object.keys(timeSlots).length > 0 &&
            Object.keys(timeSlots).filter((day) => {
                timeSlots[day] = Array.from(new Set([...timeSlots[day]]));
                timeSlots[day] = timeSlots[day].filter(Boolean).sort();
                return null;
            });

        setTimeSlots(timeSlots);

        setAppointmentsSlots({
            variables: {
                data: JSON.stringify({
                    user_id: doctor.id,
                    slots: timeSlots,
                }),
            },
        });
    };

    // get time slots for particular doctor graphql query type
    const [getAppointmentsSlots] = useLazyQuery(GET_APPOINTMENTS_SLOTS, {
        variables: { id: doctor.id },
        onCompleted(data) {
            if (doctor.id !== "-1") {
                let setSlots = data.slots && { ...data.slots.slots };
                if (setSlots) {
                    delete setSlots["__typename"];
                    Object.keys(setSlots).length > 0 &&
                        Object.keys(setSlots).filter((day) => {
                            setSlots[day] = Array.from(new Set([...setSlots[day]]));
                            setSlots[day] = setSlots[day].filter(Boolean).sort();
                            return null;
                        });
                    props.getAppointmentsSlotsSuccess(setSlots);
                    setTimeSlots(setSlots);
                } else {
                    props.getAppointmentsSlotsSuccess({});
                    setTimeSlots({
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                        sunday: [],
                    });
                }
            } else {
                props.getAppointmentsSlotsSuccess({});
                setTimeSlots({
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: [],
                    saturday: [],
                    sunday: [],
                });
            }
        },
        onError(err) {
            props.getAppointmentsSlotsFailure({});
            handleCommonError(err, props.setAuthLogout);
        },
    });
    // on change doctor set set doctor state and call graphql getAppointment slots
    const selectDoctorHandler = (e) => {
        setDoctor({ id: e.target.value });
        if (e.target.value === "-1" || e.target.value === -1) {
        } else {
            getAppointmentsSlots();
            props.getAppointmentsSlots();
        }
    };

    // on change time set time slot value
    const changeTime = (e, day, index) => {
        if (e) {
            const hour = e._d.getHours();
            const minutes = e._d.getMinutes();
            let timeSlotsValue = { ...timeSlots };
            timeSlotsValue[day][index] = `${hour > 9 ? hour : "0" + hour}:${minutes > 9 ? minutes : "0" + minutes}`;
            timeSlotsValue[day] = timeSlotsValue[day];

            setTimeSlots(timeSlotsValue);
        } else {
            let timeSlotsValue = { ...timeSlots };
            timeSlotsValue[day][index] = ``;
            setTimeSlots(timeSlotsValue);
        }
    };

    // add new time picker for particular day
    const addTime = (day) => {
        let timeSlotsValue = { ...timeSlots };
        timeSlotsValue[day] = timeSlotsValue[day].concat("");
        setTimeSlots(timeSlotsValue);
    };

    // delete time picker for particular day
    const deleteTime = (day, index) => {
        let timeSlotsValue = { ...timeSlots };
        timeSlotsValue[day].splice(index, 1);
        setTimeSlots(timeSlotsValue);
    };

    // initlal doctors fetch
    React.useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="TabsAnimation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
        >
            <div className="row">
                <div className="col-md-12">
                    <div className="main-card mb-3 card">
                        <div className="card-body">
                            <div className="mb-2 center-align pe-lg ">
                                <b>Set Weekly Appointments Time Slots</b>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card-title">
                                        <div className="mb-2">Select Doctor </div>

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
                            </div>
                            {doctor.id !== "-1" && Object.keys(timeSlots).length > 0 ? (
                                <div>
                                    <table className="mb-2 table table-bordered">
                                        <thead>
                                            <tr>
                                                <TableHead timeSlots={timeSlots} addTime={addTime} />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {props.loading ? (
                                                    <td>
                                                        <span>Please wait while we load ... </span>
                                                    </td>
                                                ) : (
                                                    <TimePickers timeSlots={timeSlots} changeTime={changeTime} deleteTime={deleteTime} />
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button
                                        className="mb-2 mr-2 btn btn-info"
                                        disabled={doctor.id === "-1" || doctor.id === undefined}
                                        onClick={appointmentsSlotsHandler}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <EmptyState content="No slots found" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ReactCSSTransitionGroup>
    );
};

const mapStateToProps = (state) => ({
    doctors: state.UserReducer.doctors,
    slots: state.UserReducer.slots,
    loading: state.UserReducer.loading,
});

const mapDispatchToProps = (dispatch) => ({
    getDoctors: () => dispatch(getDoctors()),
    setAuthLogout: () => dispatch(setAuthLogout()),
    getDoctorsSuccess: (data) => dispatch(getDoctorsSuccess(data)),
    getDoctorsFailure: () => dispatch(getDoctorsFailure()),
    getAppointmentsSlots: () => dispatch(getAppointmentsSlots()),
    getAppointmentsSlotsSuccess: (setSlots) => dispatch(getAppointmentsSlotsSuccess(setSlots)),
    getAppointmentsSlotsFailure: (data) => dispatch(getAppointmentsSlotsFailure(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Appointments);
