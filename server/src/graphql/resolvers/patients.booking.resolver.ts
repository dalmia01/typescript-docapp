import { createHmac } from "crypto";
import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import logger from "../../configuration/logger.configuration";
import { sendSms } from "../../helpers/sms.helpers";
import { PatientSendOtpBookingInput, ConfirmPatientBookingInput } from "../schemas/patients.schema";
import { PatientCounterModel, PatientModel } from "../../model/patients.model";
import { AppointmentModel } from "../../model/appointments.model";

@Resolver()
export class PatientBookingResolver {
    @Query(() => String)
    async getPatientBookings(): Promise<string> {
        return "getting patient booking";
    }

    @Mutation(() => String)
    async sendOtpPatientBooking(
        @Arg("patientSendOtpBookingInput") patientSendOtpBookingInput: PatientSendOtpBookingInput
    ): Promise<string> {
        try {
            const { phone, first_name, last_name } = patientSendOtpBookingInput;
            const otp = Math.floor(100000 + Math.random() * 900000);
            const ttl = 2 * 60 * 1000;
            const expires = Date.now() + ttl;
            const data = `${first_name}.${last_name}.${phone}.${otp}.${expires}`;
            const hash = createHmac("sha256", process.env.SMS_SECRET_KEY).update(data).digest("hex");
            const fullHash = `${hash}.${expires}`;

            sendSms(`Thank you, Your One Time Password For Creating Booking is ${otp}`, `+91 ${phone}`);

            return fullHash;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => String)
    async confirmBookingByPatient(
        @Arg("confirmPatientBookingInput") confirmPatientBookingInput: ConfirmPatientBookingInput
    ): Promise<string> {
        try {
            const { first_name, last_name, phone, hash, otp, doctor_id, date, time } = confirmPatientBookingInput;

            let [hashValue, expires] = hash.split(".");

            let now = Date.now();
            if (now > parseInt(expires)) {
                throw new ApolloError("Timeout. Please try again");
            }
            let data = `${first_name}.${last_name}.${phone}.${otp}.${expires}`;
            let newCalculatedHash = createHmac("sha256", process.env.SMS_SECRET_KEY).update(data).digest("hex");
            if (newCalculatedHash === hashValue) {
                let findPatient = await PatientModel.findOne({
                    first_name: first_name.toLowerCase().trim(),
                    last_name: last_name.toLowerCase().trim(),
                    phone: phone.toLowerCase().trim(),
                });
                let patientCounterModelObj = await PatientCounterModel.findById("PatientCounterID");
                if (!findPatient) {
                    // checking patient counter existence , initialize if not

                    if (!patientCounterModelObj) {
                        patientCounterModelObj = new PatientCounterModel({ _id: "PatientCounterID", sequence_counter: 10001 });
                    } else {
                        patientCounterModelObj["sequence_counter"] += 1;
                    }

                    findPatient = new PatientModel({});
                    findPatient["first_name"] = first_name.toLowerCase().trim();
                    findPatient["last_name"] = last_name.toLowerCase().trim();
                    findPatient["phone"] = phone.toLowerCase().trim();

                    findPatient = await findPatient.save();
                }

                let findDoctor = await AppointmentModel.findOne({ user: doctor_id });

                [...findDoctor["booked"]].filter((booking) => {
                    if (booking.date === date && booking.time === time) {
                        throw new ApolloError("Sorry Slot is not available");
                    }
                });

                if (findDoctor) {
                    findDoctor["booked"] = [
                        ...findDoctor["booked"],
                        {
                            patient: findPatient["patient_id"],
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
                    await patientCounterModelObj.save();
                    return "Booking Success Done, otp verified";
                } else {
                    return "Some problem occured while booking.Please try again!";
                }
            } else {
                throw new ApolloError("incorrect otp provided");
            }
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }
}
