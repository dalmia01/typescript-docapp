import { Schema, model } from "mongoose";

const PrescriptionSchema: Schema = new Schema(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "patient",
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        is_fav: { type: Boolean, default: false },
        fav_name: { type: String, default: "" },
        symptoms: [
            {
                defination: {
                    type: Schema.Types.ObjectId,
                    ref: "common_defination",
                },
                name: String,
                data: [
                    {
                        label: String,
                        value: Schema.Types.Mixed,
                        name: String,
                        operator: String,
                        id: String,
                        possible_values: [String],
                    },
                ],
            },
        ],
        findings: [
            {
                defination: {
                    type: Schema.Types.ObjectId,
                    ref: "common_defination",
                },
                name: String,
                data: [
                    {
                        label: String,
                        value: Schema.Types.Mixed,
                        name: String,
                        operator: String,
                        id: String,
                        possible_values: [String],
                    },
                ],
            },
        ],
        investigations: [
            {
                defination: {
                    type: Schema.Types.ObjectId,
                    ref: "common_defination",
                },
                name: String,
                data: [
                    {
                        label: String,
                        value: Schema.Types.Mixed,
                        name: String,
                        operator: String,
                        id: String,
                        possible_values: [String],
                    },
                ],
            },
        ],
        instructions: [
            {
                defination: {
                    type: Schema.Types.ObjectId,
                    ref: "common_defination",
                },
                name: String,
                data: [
                    {
                        label: String,
                        value: Schema.Types.Mixed,
                        name: String,
                        operator: String,
                        id: String,
                        possible_values: [String],
                    },
                ],
            },
        ],
        diagnosis: [
            {
                defination: {
                    type: Schema.Types.ObjectId,
                    ref: "common_defination",
                },
                name: String,
                data: [
                    {
                        label: String,
                        value: Schema.Types.Mixed,
                        name: String,
                        operator: String,
                        id: String,
                        possible_values: [String],
                    },
                ],
            },
        ],
        vitals: {
            defination: {
                type: Schema.Types.ObjectId,
                ref: "common_defination",
            },
            name: String,
            data: [
                {
                    label: String,
                    value: Schema.Types.Mixed,
                    name: String,
                    operator: String,
                    id: String,
                    possible_values: [String],
                },
            ],
        },
        medicines: [
            {
                defination: {
                    type: Schema.Types.ObjectId,
                    ref: "common_defination",
                },
                name: String,
                data: [
                    {
                        label: String,
                        value: Schema.Types.Mixed,
                        name: String,
                        operator: String,
                        id: String,
                        possible_values: [String],
                    },
                ],
            },
        ],
        additional_notes: String,
    },
    { timestamps: true }
);

export const PrescriptionModel = model("prescription", PrescriptionSchema);
