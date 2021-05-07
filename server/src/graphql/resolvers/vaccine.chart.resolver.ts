import { ApolloError } from "apollo-server-errors";
import { Arg, Query, Resolver } from "type-graphql";
import logger from "../../configuration/logger.configuration";
import { PatientModel } from "../../model/patients.model";
import { VaccineChartModel } from "../../model/vaccine.chart.model";
import { PatientResponse } from "../schemas/patients.schema";
import { VaccineChartResponse, VaccineChartDatesInput } from "../schemas/vaccine.chart.schema";
import moment from "moment";
import { vaccine_chart } from "../../constants/vaccine.range.constants";
import { determineDueDate } from "../../helpers/common.helpers";

@Resolver()
export class VaccineChartResolver {
    @Query(() => VaccineChartResponse)
    async chart(): Promise<VaccineChartResponse> {
        try {
            const chartAll = await VaccineChartModel.find({});
            return chartAll[0];
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Query(() => [PatientResponse])
    async getGivenVaccinePatients(@Arg("dates") dates: VaccineChartDatesInput): Promise<PatientResponse[]> {
        try {
            const { start, end } = dates;

            const filterPatients = await PatientModel.find({
                "vaccine.given_date": { $gte: new Date(start), $lt: new Date(end) },
            });

            let filteredPatients = [];

            filterPatients.filter((patient) => {
                let vaccines = [];
                patient["vaccine"].filter((patientVaccine: any) => {
                    if (patientVaccine.given_date) {
                        if (moment(patientVaccine.given_date).format("YYYY-MM-DD") === end) {
                            vaccines.push(patientVaccine);
                        }
                    }
                });

                if (vaccines.length > 0) {
                    filteredPatients.push({
                        id: patient._id,
                        first_name: patient["first_name"],
                        last_name: patient["last_name"],
                        phone: patient["phone"],
                        age: patient["age"],
                        dob: patient["dob"],
                        vaccine: [...vaccines],
                    });
                }
            });

            return filteredPatients;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Query(() => [PatientResponse])
    async getDueVaccinePatients(@Arg("date", { nullable: true }) date: string): Promise<PatientResponse[]> {
        try {
            const filterPatients = await PatientModel.find({
                $and: [{ $or: [{ "vaccine.due_date": { $lt: new Date(date) } }, { "vaccine.due_date": null }] }, { isTracked: true }],
            });

            let filteredPatients = [];

            filterPatients.filter((patient) => {
                let vaccines = [];

                vaccine_chart.map((vaccineItem) => {
                    vaccineItem.vaccines.map((vaccine, index) => {
                        let filteredVaccine = patient["vaccine"].find(
                            (vaccineName: any) => vaccineName.medicine_name === vaccine.medicine_name
                        );

                        if (filteredVaccine && filteredVaccine.given_date) {
                        } else if (filteredVaccine && moment(filteredVaccine.due_date) < moment(date)) {
                            vaccines.push(filteredVaccine);
                        } else {
                            let isDue = determineDueDate(patient["dob"], vaccine.range, moment(date));

                            if (isDue) {
                                vaccines.push(vaccine);
                            }
                        }
                    });
                });

                if (vaccines.length > 0) {
                    filteredPatients.push({
                        id: patient._id,
                        first_name: patient["first_name"],
                        last_name: patient["last_name"],
                        phone: patient["phone"],
                        age: patient["age"],
                        dob: patient["dob"],
                        vaccine: [...vaccines],
                    });
                }
            });

            return filteredPatients;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }
}
