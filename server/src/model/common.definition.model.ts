import { Schema, model } from "mongoose";
const CommonDefinitionSchema: Schema = new Schema(
    {
        category: String,
        name: String,
        description: String,
        dosageForm: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        fields: [
            {
                label: {
                    type: String,
                    required: true,
                },
                operator: {
                    type: String,
                    required: true,
                },
                possible_values: [String],
                name: String,
                value: Schema.Types.Mixed,
            },
        ],
        is_fav: { type: Boolean, default: false },
        usage_count: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const CommonDefinitionModel = model("common_defination", CommonDefinitionSchema);
