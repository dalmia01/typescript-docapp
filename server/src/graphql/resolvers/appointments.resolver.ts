import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import logger from "../../configuration/logger.configuration";
import { AppointmentModel } from "../../model/appointments.model";
import { PatientModel } from "../../model/patients.model";
import {
    AppointmentResponse,
    AppointmentDaySlotInput,
    SetAppointmentSlotInput,
    BookAppointmentInput,
} from "../schemas/appointments.schema";

@Resolver()
export class AppointmentResolver {
    @Query(() => AppointmentResponse)
    async getAppointmentsSlots(@Arg("id", { nullable: true }) id: string): Promise<AppointmentResponse> {
        try {
            const slots = await AppointmentModel.findOne({ user: id });
            return slots;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Query(() => [String])
    async getAvailableSlots(@Arg("appointmentDaySlotInput") appointmentDaySlotInput: AppointmentDaySlotInput): Promise<string[]> {
        try {
            const { id, day, date } = appointmentDaySlotInput;

            let findSlots = await AppointmentModel.findOne({ user: id });
            let slots = findSlots["slots"][day];

            [...findSlots["booked"]].filter((booking) => {
                if (booking.date === date) {
                    let foundSlotIndex = findSlots["slots"][day].indexOf(booking.time);

                    slots = foundSlotIndex >= 0 ? slots.filter((time: string) => time !== booking.time) : findSlots["slots"][day];
                }
            });

            return slots;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => String)
    async setApointmentSlots(@Arg("setAppointmentSlotInput") setAppointmentSlotInput: SetAppointmentSlotInput): Promise<string> {
        try {
            const { user_id, slots } = setAppointmentSlotInput;
            let findSlots = await AppointmentModel.findOne({ user: user_id });

            if (findSlots) {
                findSlots["slots"] = slots;
                await findSlots.save();
                return "Slot edited successfully";
            } else {
                let newAppointment = new AppointmentModel({
                    user: user_id,
                });

                newAppointment["slots"] = slots;
                await newAppointment.save();

                return "Slot added successfully";
            }
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError("Some Error Occured while setting appointment slots, Try Again ");
        }
    }

    @Mutation(() => String)
    async bookAppointment(@Arg("bookAppointmentInput") bookAppointmentInput: BookAppointmentInput): Promise<string> {
        try {
            const { doctor_id, date, time, patient_id } = bookAppointmentInput;
            let findDoctor = await AppointmentModel.findOne({ user: doctor_id });

            [...findDoctor["booked"]].filter((booking) => {
                if (booking.date === date && booking.time === time) {
                    throw new ApolloError("Sorry Slot is not available");
                }
            });

            let findPatient = await PatientModel.findOne({ _id: patient_id });

            if (findDoctor) {
                findDoctor["booked"] = [
                    ...findDoctor["booked"],
                    {
                        patient: patient_id,
                        date: date,
                        time: time,
                    },
                ];

                if (findPatient["bookings"]) {
                    findPatient["bookings"] = [
                        ...findPatient["bookings"],
                        {
                            doctor_id: doctor_id,
                            date: date,
                            time: time,
                        },
                    ];
                } else {
                    findPatient["bookings"] = [
                        {
                            doctor_id: doctor_id,
                            date: date,
                            time: time,
                        },
                    ];
                }

                await findDoctor.save();
                await findPatient.save();

                return "Booking Success Done";
            } else {
                throw new ApolloError("Some problem occured while booking.Please try again!");
            }
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError("Some Error Occured while booking appointment , Try Again ");
        }
    }
}
