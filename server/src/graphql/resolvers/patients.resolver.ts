import { ApolloError } from "apollo-server-errors";
import moment from "moment";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import logger from "../../configuration/logger.configuration";
import { statusMessage } from "../../constants/message.constants";
import { PatientCounterModel, PatientModel } from "../../model/patients.model";
import {
    VaccinePatientInput,
    CreateInputPatient,
    EditPatientInput,
    FilterInputPatient,
    MedicalHistoryInput,
    PatientResponse,
    PatientResponseVaccine,
} from "../schemas/patients.schema";

@Resolver()
export default class PatientResolver {
    @Query(() => [PatientResponse])
    async getPatient(@Arg("filterInputPatient") filterInputPatient: FilterInputPatient): Promise<PatientResponse[]> {
        try {
            const { name_phone, date } = filterInputPatient;

            if (name_phone) {
                const patients = await PatientModel.find({
                    $or: [
                        { first_name: { $regex: new RegExp(name_phone, "i") } },
                        { last_name: { $regex: new RegExp(name_phone, "i") } },
                        { phone: { $regex: new RegExp(name_phone, "i") } },
                    ],
                });
                return patients;
            }

            if (date) {
                let patients = await PatientModel.find();

                patients = patients.filter((patient) => {
                    if (patient["bookings"] && patient["bookings"].length > 0) {
                        const patientBookings = patient["bookings"].find((booking: any) => booking.date === date);

                        if (patientBookings) return patient;
                    }
                });

                return patients;
            }

            return [];
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Query(() => PatientResponse)
    async getPatientMedia(@Arg("id", { nullable: true }) id: string): Promise<PatientResponse> {
        try {
            const patient = await PatientModel.findById(id).select("id media");

            if (!patient) throw new Error(statusMessage(404));

            return patient;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Query(() => [PatientResponseVaccine])
    async vaccineChart(@Arg("id", { nullable: true }) id?: string): Promise<PatientResponseVaccine[]> {
        try {
            const patient = await PatientModel.findById(id).select("vaccine");

            if (!patient) throw new Error(statusMessage(404));

            return [...patient["vaccine"]];
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => PatientResponse)
    async createPatient(@Arg("createInputPatient") createInputPatient: CreateInputPatient): Promise<PatientResponse> {
        try {
            const { first_name, last_name, phone, patient_serial_id } = createInputPatient;

            const patient = await PatientModel.findOne({ first_name, last_name, phone });

            if (patient) throw new Error(statusMessage(406));

            let patientCounterModelObj = await PatientCounterModel.findById("PatientCounterID");

            if (!patient_serial_id || patient_serial_id === "") {
                if (!patientCounterModelObj) {
                    patientCounterModelObj = new PatientCounterModel({ _id: "PatientCounterID", sequence_counter: 10001 });
                } else {
                    patientCounterModelObj["sequence_counter"] += 1;
                    createInputPatient.patient_serial_id = patientCounterModelObj["sequence_counter"];
                }
                await patientCounterModelObj.save();
            } else {
                const findPatientByOldID = await PatientModel.findOne({
                    patient_serial_id,
                });

                if (findPatientByOldID) {
                    logger.error("findPatientByOldID exist, patient", patient);
                    throw new ApolloError("Patient Already exists");
                }
            }

            const newPatient = new PatientModel();

            for (let key in createInputPatient) {
                if (key === "address") {
                    newPatient[key] = {};
                    for (let innerKey in createInputPatient[key]) {
                        newPatient[key][innerKey] = createInputPatient[key][innerKey];
                    }
                } else if (key === "dob") {
                    newPatient["age"] = createInputPatient[key]
                        ? new Date().getFullYear() - new Date(createInputPatient[key]).getFullYear()
                        : -1;
                    newPatient[key] = createInputPatient[key];
                } else {
                    newPatient[key] = createInputPatient[key];
                }
            }

            newPatient["bookings"] = [
                {
                    doctor_id: "",
                    date: moment().format("L"),
                    time: "walk-in",
                },
            ];

            await newPatient.save();

            return newPatient;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => PatientResponse)
    async editPatient(@Arg("editPatientInput") editPatientInput: EditPatientInput): Promise<PatientResponse> {
        try {
            const { id, patient_serial_id } = editPatientInput;
            const findPatient = await PatientModel.findById(id);

            if (!findPatient) throw new Error("No patient Found");

            if (findPatient && patient_serial_id && findPatient["patient_serial_id"] != patient_serial_id) {
                const isSerialNoExist = await PatientModel.findOne({
                    patient_serial_id: patient_serial_id,
                    id: { $ne: id },
                });
                if (isSerialNoExist) {
                    throw new Error("Another patient exist by this patient ID. Please use another");
                }
            }

            let patientCounterModelObj = await PatientCounterModel.findById("PatientCounterID");

            if (!patient_serial_id || patient_serial_id === "") {
                patientCounterModelObj["sequence_counter"] += 1;
                editPatientInput["patient_serial_id"] = patientCounterModelObj["sequence_counter"];

                await patientCounterModelObj.save();
            }

            for (let key in editPatientInput) {
                if (key === "address") {
                    findPatient[key] = findPatient[key] || {};
                    for (let innerKey in editPatientInput[key]) {
                        findPatient[key][innerKey] = editPatientInput[key][innerKey];
                    }
                } else if (key === "dob") {
                    let year = new Date(editPatientInput["dob"]).getFullYear();
                    findPatient["age"] = new Date().getFullYear() - year;
                    findPatient[key] = editPatientInput[key];
                } else {
                    findPatient[key] = editPatientInput[key];
                }
            }

            await findPatient.save();
            return findPatient;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => String)
    async deletePatient(@Arg("id", { nullable: true }) id: string): Promise<string> {
        try {
            const findPatient = await PatientModel.findById(id);
            await findPatient.delete();
            return "Patient Deleted Successfully";
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => PatientResponse)
    async saveMedicalHistory(@Arg("medicalHistoryInput") medicalHistoryInput: MedicalHistoryInput): Promise<PatientResponse> {
        try {
            const { id, medical_history } = medicalHistoryInput;

            const patient = await PatientModel.findById(id);
            let medicalHistory = [];
            medical_history.map((item) => {
                medicalHistory.push({
                    defination: item["id"],
                    name: item.name,
                    data: item["data"],
                });
            });
            patient["medical_history"] = medicalHistory;

            await patient.save();
            return patient;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => PatientResponse)
    async updateVaccineChart(@Arg("vaccinePatientInput") vaccinePatientInput: VaccinePatientInput): Promise<PatientResponse> {
        try {
            const { id, vaccine } = vaccinePatientInput;
            vaccine["updated_at"] = moment().format();
            const user = await PatientModel.findById(id).select("id vaccine");
            const updateVaccineDetails = user["vaccine"] && user["vaccine"].length ? [...user["vaccine"]] : [];
            const existingEntry = updateVaccineDetails.find((item) => {
                return item && item.range === vaccine.range && item.medicine_name === vaccine.medicine_name;
            });

            if (existingEntry) {
                existingEntry.given_date = vaccine.given_date || "";
                existingEntry.due_date = vaccine.due_date || "";
                existingEntry.medicine_brand = vaccine.medicine_brand || "";
                existingEntry.notes = vaccine.notes;
                existingEntry.updated_at = moment().format();
            } else {
                updateVaccineDetails.push({ ...vaccine });
            }
            user["vaccine"] = updateVaccineDetails.filter(Boolean);
            await user.save();
            return user;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => String)
    async updatePatientVaccineTrack(@Arg("id", { nullable: true }) id: string): Promise<string> {
        try {
            const findPatient = await PatientModel.findById(id);

            if (findPatient) {
                findPatient["isTracked"] = !findPatient["isTracked"];
                await findPatient.save();
                return "succcesfully updated vaccine status of patient";
            }

            return "No patient found";
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }
}
