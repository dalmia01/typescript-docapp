import { Schema, model } from "mongoose";

const VaccineSchema: Schema = new Schema(
    {
        ranges: [
            {
                start_range: Number,
                end_range: Number,
                range_unit: String,
                range_label: String,
            },
        ],
        vaccine_group: [
            {
                vaccine_group_name: String,
                schedule: [
                    {
                        range: Number,
                        medicine_name: String,
                        medicine_brands: [String],
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

export const VaccineChartModel = model("vaccine_schema", VaccineSchema, "vaccine_schema");

// ------------- Sample --------------------
// [
//     {
//         "vaccine_group_name": "Typhoid",
//         "schedule": [
//             {
//                 "group_start_range": "0"
//                 "group_end_range": "6"
//                 "group_range_unit": "months"
//                 "group_label": "0 to 6 months"
//                 "medicine_name": "Typhoid vac 1"
//                 "medicine_brands": [{"name": "brand 1"}, {"name": "brand 2"}]
//             },
//             {
//                 "group_start_range": "1"
//                 "group_end_range": "2"
//                 "group_range_unit": "years"
//                 "group_label": "1 to 2 years"
//                 "medicine_name": "Typhoid vac 2"
//                 "medicine_brands": [{"name": "brand 1"}, {"name": "brand 2"}]
//             }
//         ]
//     },
//     {
//         "vaccine_group_name": "Rabies",
//         "schedule": [
//             {
//                 "group_start_range": "0"
//                 "group_end_range": "6"
//                 "group_range_unit": "months"
//                 "group_label": "0 to 6 months"
//                 "medicine_name": "Rabies vac 1"
//                 "medicine_brands": [{"name": "brand 1"}, {"name": "brand 2"}]
//             },
//             {
//                 "group_start_range": "1"
//                 "group_end_range": "2"
//                 "group_range_unit": "years"
//                 "group_label": "1 to 2 years"
//                 "medicine_name": "Rabies vac 2"
//                 "medicine_brands": [{"name": "brand 1"}, {"name": "brand 2"}]
//             }
//         ]
//     },
// ]
