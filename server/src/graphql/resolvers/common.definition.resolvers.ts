import { ApolloError } from "apollo-server-errors";
import { Query, Arg, Resolver, Mutation } from "type-graphql";
import logger from "../../configuration/logger.configuration";
import { CommonDefinitionModel } from "../../model/common.definition.model";
import { v4 as uuidv4 } from "uuid";
import {
    CommonDefintionsResponse,
    FetchFilterDefinitionInput,
    SpecificDefintionInput,
    CommonDefinitonInput,
    AddMedicineDefinationInput,
} from "../schemas/common.definitions.schema";
import { COM_DEF_DURATION_POSSIBLE_VALUES } from "../../constants/common.defintions.constants";
import { MEDICINE_FIELDS } from "../../constants/medicinefields.commondefinitions.constants";

@Resolver()
export class CommonDefinitionResolver {
    /** Fetch limited definations for when no filter implemented */
    @Query(() => [CommonDefintionsResponse])
    async fetchDefinations(@Arg("category", { nullable: true }) category: string): Promise<CommonDefintionsResponse[]> {
        try {
            let allDefinations = await CommonDefinitionModel.find({ category: category }).sort({ usage_count: -1 }).limit(20);
            return allDefinations;
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while fetching definations, Try Again ");
        }
    }

    /** Fetch definations for particular filter implemented */
    @Query(() => [CommonDefintionsResponse])
    async fetchFilteredDefinations(
        @Arg("fetchFilterDefinitionInput") fetchFilterDefinitionInput: FetchFilterDefinitionInput
    ): Promise<CommonDefintionsResponse[]> {
        try {
            const { filteredValue, category } = fetchFilterDefinitionInput;

            let allDefinations = await CommonDefinitionModel.find({
                $and: [
                    {
                        name: { $regex: new RegExp(filteredValue, "i") },
                    },
                    { category: category },
                ],
            });

            return allDefinations;
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while fetching filtered definations, Try Again ");
        }
    }

    @Query(() => CommonDefintionsResponse)
    async specificDefination(
        @Arg("specificDefintionInput") specificDefintionInput: SpecificDefintionInput
    ): Promise<CommonDefintionsResponse> {
        try {
            const { id, category } = specificDefintionInput;
            let defination: CommonDefintionsResponse;
            if (id === "") {
                defination = await CommonDefinitionModel.findOne({ category: category });
            } else {
                defination = await CommonDefinitionModel.findOne({ category: category, _id: id });
            }

            return defination;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError(err.message);
        }
    }

    @Mutation(() => CommonDefintionsResponse)
    async commonDefinition(@Arg("commonDefinitonInput") commonDefinitonInput: CommonDefinitonInput): Promise<CommonDefintionsResponse> {
        try {
            const { name, category, fields } = commonDefinitonInput;

            let editDefinition = await CommonDefinitionModel.findOne({ name: name, category: category });

            let newFields = JSON.parse(fields);

            if (editDefinition) {
                newFields.map((item) => {
                    editDefinition["fields"].push(item);
                });
            } else {
                editDefinition = new CommonDefinitionModel({
                    name: name,
                    category: category,
                    fields: newFields,
                });
            }

            editDefinition = await editDefinition.save();

            editDefinition = await CommonDefinitionModel.findOne({ name: name, category: category });

            return editDefinition;
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while saving common defination, Try Again ");
        }
    }

    @Mutation(() => CommonDefintionsResponse)
    async editCommonDefination(@Arg("defination", { nullable: true }) defination: string): Promise<CommonDefintionsResponse> {
        try {
            defination = JSON.parse(defination);

            let editDefinition = await CommonDefinitionModel.findOne({
                _id: defination["id"],
                name: defination["name"],
                category: defination["category"],
                "fields._id": defination["field"].id,
            });

            [...editDefinition["fields"]].map((item) => {
                if (item._id == defination["field"].id) {
                    item.label = defination["field"].label;
                    item.possible_values = defination["field"].possible_values.filter((item) => {
                        return item.trim() !== "";
                    });
                }
            });

            editDefinition = await editDefinition.save();

            return editDefinition;
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while editing common defination, Try Again ");
        }
    }

    @Mutation(() => CommonDefintionsResponse)
    async deleteCommonDefinationField(@Arg("defination", { nullable: true }) defination: string): Promise<CommonDefintionsResponse> {
        try {
            defination = JSON.parse(defination);
            let definationName = defination["category"] === "Vitals" ? "vitals" : defination["name"];

            let deleteDefinition = await CommonDefinitionModel.findOne({
                _id: defination["id"],
                name: definationName,
                category: defination["category"],
                "fields._id": defination["field"].id,
            });

            let newFields = deleteDefinition["fields"].filter((item) => {
                if (String(item._id) !== defination["field"].id) {
                    return item._id !== defination["field"].id;
                } else return undefined;
            });

            await CommonDefinitionModel.updateOne(
                {
                    _id: defination["id"],
                    name: definationName,
                    category: defination["category"],
                    "fields._id": defination["field"].id,
                },
                { fields: newFields }
            );

            let modDefination = await CommonDefinitionModel.findOne({
                _id: defination["id"],
                name: definationName,
                category: defination["category"],
            });

            return modDefination;
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while deleting common defination field, Try Again ");
        }
    }

    @Mutation(() => CommonDefintionsResponse)
    async addDefinationName(
        @Arg("addDefinationNameInput") addDefinationNameInput: CommonDefinitonInput
    ): Promise<CommonDefintionsResponse> {
        try {
            const { name, category } = addDefinationNameInput;

            let findDefination = await CommonDefinitionModel.find({ name: name, category: category });

            if (findDefination.length > 0) {
                throw new Error(`${category} Already exists`);
            } else if (findDefination.length <= 0 && category !== "Medicines") {
                let setFields = ["Symptoms", "Findings", "Diagnosis", "Investigations"].includes(category)
                    ? [
                          {
                              label: "Notes",
                              operator: "textarea",
                              name: uuidv4(),
                          },
                          {
                              label: "Duration",
                              operator: "select",
                              possible_values: COM_DEF_DURATION_POSSIBLE_VALUES,
                              name: uuidv4(),
                          },
                      ]
                    : {
                          label: "Notes",
                          operator: "textarea",
                          name: uuidv4(),
                      };

                let addDefination = new CommonDefinitionModel({
                    name: name,
                    category: category,
                    fields: setFields,
                });

                await addDefination.save();

                let addedDefinition = await CommonDefinitionModel.findOne({ name: name, category: category });

                return addedDefinition;
            }
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while adding common defination name or medicine, Try Again ");
        }
    }

    @Mutation(() => String)
    async deleteCommonDefination(@Arg("id", { nullable: true }) id: string): Promise<string> {
        try {
            let defination = await CommonDefinitionModel.findById(id);
            await defination.deleteOne();
            return "Defination Deleted successfully";
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while deleting common defination , Try Again ");
        }
    }

    @Mutation(() => String)
    async favouriteMedicineValues(@Arg("defination", { nullable: true }) defination: string): Promise<string> {
        try {
            defination = JSON.parse(defination);
            let findDefination = await CommonDefinitionModel.findById(defination["id"]);
            findDefination["is_fav"] = true;
            findDefination["fields"] = defination["fields"];

            findDefination = await findDefination.save();
            return "favourite medicine saved";
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while saving medicine values as favourite, Try Again ");
        }
    }

    @Mutation(() => String)
    async removeFavouriteMedicineValues(@Arg("defination_id", { nullable: true }) defination_id: string): Promise<string> {
        try {
            let findDefination = await CommonDefinitionModel.findById(defination_id);
            [...findDefination["fields"]].map((item) => {
                item.value = "";
            });
            findDefination["is_fav"] = false;
            await findDefination.save();
            return "removed from favourites";
        } catch (err) {
            logger.log(err);
            throw new Error("Some Error Occured while removing medicine values as favourite, Try Again ");
        }
    }

    @Mutation(() => CommonDefintionsResponse)
    async addMedicineDefinationName(
        @Arg("addMedicineDefinationInput") addMedicineDefinationInput: AddMedicineDefinationInput
    ): Promise<CommonDefintionsResponse> {
        try {
            const { name, category, description, dosageForm } = addMedicineDefinationInput;

            let findDefination = await CommonDefinitionModel.find({ name: name, category: category });

            if (findDefination.length > 0) {
                throw new Error("User Input Error");
            }

            let addDefination = new CommonDefinitionModel({
                name: name,
                category: category,
                description: description,
                dosageForm: dosageForm || "",
                is_fav: false,
                fields: [...MEDICINE_FIELDS],
            });

            await addDefination.save();

            let addedDefinition = await CommonDefinitionModel.findOne({ name: name, category: category });

            return addedDefinition;
        } catch (err) {
            logger.log(err.message);
            throw new Error("Some Error Occured while adding medicine defination name, Try Again ");
        }
    }

    @Mutation(() => CommonDefintionsResponse)
    async editMedicineDefinationName(
        @Arg("editCommonDefinitonInput") editCommonDefinitonInput: AddMedicineDefinationInput
    ): Promise<CommonDefintionsResponse> {
        try {
            const { name, category, description, dosageForm } = editCommonDefinitonInput;

            let findDefination = await CommonDefinitionModel.findOne({ name: name, category: category });

            if (findDefination) {
                findDefination["description"] = description;
                findDefination["dosageForm"] = dosageForm;

                await findDefination.save();

                return findDefination;
            } else {
                throw new Error(`${category} does not exists`);
            }
        } catch (err) {
            logger.log(err.message);
            throw new Error("Some Error Occured while editing medicine defination name, Try Again ");
        }
    }
}
