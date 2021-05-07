import { Arg, Mutation, Query, Resolver } from "type-graphql";
import logger from "../../configuration/logger.configuration";
import { CommonDefinitionModel } from "../../model/common.definition.model";
import { PrescriptionModel } from "../../model/prescriptions.model";
import { PrescriptionResponse, GetPrescriptionInput } from "../schemas/prescriptions.schema";
import { COMMON_DEF_CONSTANTS } from "../../constants/common.defintions.constants";
import { PatientModel } from "../../model/patients.model";
import { sendSms } from "../../helpers/sms.helpers";

@Resolver()
export class PrescriptionResolver {
    @Query(() => [PrescriptionResponse])
    async getPrescriptions(@Arg("getPrescriptionInput") getPrescriptionInput: GetPrescriptionInput): Promise<PrescriptionResponse[]> {
        try {
            const { id } = getPrescriptionInput;
            let prescriptions = await PrescriptionModel.find({ patient: id }).populate("doctor");

            return prescriptions;
        } catch (err) {
            logger.log(err.message);
            throw new Error("Some Error Occured while fetching prescriptions, Try Again ");
        }
    }

    @Query(() => [PrescriptionResponse])
    async getFavouritePrescriptions(): Promise<PrescriptionResponse[]> {
        try {
            let prescriptions = await PrescriptionModel.find({ is_fav: true });
            return prescriptions;
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while fetching favourite prescriptions, Try Again ");
        }
    }

    @Mutation(() => String)
    async prescription(@Arg("data", { nullable: true }) data: string): Promise<string> {
        try {
            data = JSON.parse(data);

            // edit case
            if (data["precription_id"]) {
                let prescription = await PrescriptionModel.findById(data["precription_id"]);

                let CommonDefinitionData = {
                    symptoms: [],
                    findings: [],
                    investigations: [],
                    instructions: [],
                    diagnosis: [],
                };

                COMMON_DEF_CONSTANTS.map((comDef) => {
                    data[comDef.property].map(async (item) => {
                        let findDefination = await CommonDefinitionModel.findOne({ name: item.name, category: comDef.category });
                        findDefination["usage_count"] = findDefination["usage_count"] ? findDefination["usage_count"] + 1 : 1;
                        await findDefination.save();
                        CommonDefinitionData[comDef.property].push({
                            defination: item.id,
                            name: item.name,
                            data: item.fields,
                        });
                    });
                });

                // data["symptoms"].map(async (item) => {
                //     let findDefination = await CommonDefinitionModel.findOne({ name: item.name, category: "Symptoms" });
                //     findDefination["usage_count"] = findDefination["usage_count"] ? findDefination["usage_count"] + 1 : 1;
                //     await findDefination.save();
                //     symptoms.push({
                //         defination: item.id,
                //         name: item.name,
                //         data: item.fields,
                //     });
                // });

                let medicines = [];

                data["medicines"].map((item) => {
                    medicines.push({
                        defination: item.id,
                        name: item.name,
                        data: item.fields,
                    });
                });

                prescription["symptoms"] = CommonDefinitionData.symptoms;
                prescription["findings"] = CommonDefinitionData.findings;
                prescription["diagnosis"] = CommonDefinitionData.diagnosis;
                prescription["medicines"] = medicines; //some
                prescription["investigations"] = CommonDefinitionData.investigations;
                prescription["instructions"] = CommonDefinitionData.instructions;
                prescription["vitals"] = {
                    defination: data["vitals"].id,
                    name: data["vitals"].name,
                    data: data["vitals"].fields,
                };
                prescription["additional_notes"] =
                    (data["others"] && data["others"].length > 0 && data["others"][0].fields.additionalNotes) || "";

                if (data["is_fav"] === true) {
                    prescription["is_fav"] = true;
                    prescription["fav_name"] = data["fav_name"];
                }

                await prescription.save();

                if (data["patient_id"]) {
                    const findPatient = await PatientModel.findById(data["patient_id"]);
                    findPatient["notes"] = (data["others"] && data["others"].length > 0 && data["others"][0].fields.patientNotes) || "";
                    findPatient["follow_up_date"] =
                        (data["others"] && data["others"].length > 0 && data["others"][0].fields.followUpDate) || "";
                    await findPatient.save();
                }

                return "Prescription edited successfully";
            } else {
                //  create case
                let createPrescription = new PrescriptionModel({
                    patient: data["patient_id"],
                });

                COMMON_DEF_CONSTANTS.map((comDef) => {
                    data[comDef.property].map(async (item) => {
                        let findDefination = await CommonDefinitionModel.findOne({ name: item.name, category: comDef.category });
                        findDefination["usage_count"] = findDefination["usage_count"] ? findDefination["usage_count"] + 1 : 1;
                        await findDefination.save();
                        createPrescription[comDef.property].push({
                            defination: item.id,
                            name: item.name,
                            data: item.fields,
                        });
                    });
                });

                data["medicines"].map((item) => {
                    createPrescription["medicines"].push({
                        defination: item.id,
                        name: item.name,
                        data: item.fields,
                    });
                });

                createPrescription["additional_notes"] =
                    (data["others"] && data["others"].length > 0 && data["others"][0].fields.additionalNotes) || "";

                createPrescription["vitals"] = {
                    defination: data["vitals"].id,
                    name: data["vitals"].name,
                    data: data["vitals"].fields,
                };

                createPrescription["doctor"] = data["user_id"];

                let findPatient;

                if (data["is_fav"] === true) {
                    createPrescription["is_fav"] = true;
                    createPrescription["fav_name"] = data["fav_name"];
                } else {
                    findPatient = await PatientModel.findById(data["patient_id"]);

                    findPatient["notes"] = (data["others"] && data["others"].length > 0 && data["others"][0].fields.patientNotes) || "";
                    findPatient["follow_up_date"] =
                        (data["others"] && data["others"].length > 0 && data["others"][0].fields.followUpDate) || "";
                    await findPatient.save();
                }

                createPrescription = await createPrescription.save();

                if (data["smsEnabled"]) {
                    sendSms(
                        `Thank you, ${findPatient.first_name} ${findPatient.last_name} for visiting and consulting.`,
                        findPatient.phone
                    );
                }

                return "Prescription saved successfully";
            }
        } catch (err) {
            logger.log(err.message);
            throw new Error("Some Error Occured while saving or editing  prescription, Try Again ");
        }
    }

    @Mutation(() => String)
    async deletePrescription(@Arg("id", { nullable: true }) id: string): Promise<string> {
        try {
            let prescription = await PrescriptionModel.findById(id);
            await prescription.deleteOne();
            return prescription.id;
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while deleting  prescription, Try Again ");
        }
    }

    @Mutation(() => [PrescriptionResponse])
    async removeFavouritePrescription(@Arg("id", { nullable: true }) id: string): Promise<PrescriptionResponse[]> {
        try {
            let prescription = await PrescriptionModel.findById(id);
            prescription["is_fav"] = false;
            prescription["fav_name"] = "";
            await prescription.save();
            let prescriptions = await PrescriptionModel.find({ is_fav: true });
            return prescriptions;
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while removing favourite  prescription, Try Again ");
        }
    }
}
