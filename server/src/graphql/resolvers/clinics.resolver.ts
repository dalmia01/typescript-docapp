import { ApolloError } from "apollo-server-errors";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { statusMessage } from "../../constants/message.constants";
import ClinicsModel from "../../model/clinics.model";
import { ClinicEditInput, ClinicInput, ClinicResponse } from "../schemas/clinics.schema";
import { Types } from "mongoose";

@Resolver()
export class ClinicsResolver {
    @Query(() => [ClinicResponse])
    async fetchfilteredClinics(@Arg("filter") filter: string): Promise<ClinicResponse[]> {
        try {
            const users = await ClinicsModel.find({
                $or: [{ clinic_name: { $regex: new RegExp(filter, "i") } }, { address: { $regex: new RegExp(filter, "i") } }],
            });

            console.log(users);

            console.log("-------", filter);

            return users;
        } catch (err) {
            throw new ApolloError(statusMessage(404));
        }
    }

    @Query(() => [ClinicResponse])
    async fetchAllClinics(@Arg("role", { nullable: true }) role?: string): Promise<ClinicResponse[]> {
        try {
            const clinics = await ClinicsModel.find().select("id phone_num website address clinic_name");

            return clinics;
        } catch (err) {
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => ClinicResponse)
    async addClinic(@Arg("clinicInput") clinicInput: ClinicInput): Promise<ClinicResponse> {
        try {
            const clinic = new ClinicsModel({});

            for (let key in clinicInput) {
                clinic[key] = clinicInput[key];
            }
            await clinic.save();

            return clinic;
        } catch (err) {
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => ClinicResponse)
    async updateClinic(@Arg("clinicEditInput") clinicEditInput: ClinicEditInput): Promise<ClinicResponse> {
        try {
            const { id } = clinicEditInput;
            const clinic = await ClinicsModel.findById(Types.ObjectId(id));

            if (!clinic) throw new Error(statusMessage(404));

            for (let key in clinicEditInput) {
                clinic[key] = clinicEditInput[key];
            }

            await clinic.save();

            return clinic;
        } catch (err) {
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => String)
    async deleteClinic(@Arg("clinicId") clinicId: string): Promise<string> {
        try {
            const deletedUsers = await ClinicsModel.findByIdAndDelete(Types.ObjectId(clinicId));

            if (!deletedUsers) throw new Error(statusMessage(404));

            return deletedUsers.id;
        } catch (err) {
            throw new ApolloError(err.message);
        }
    }
}
