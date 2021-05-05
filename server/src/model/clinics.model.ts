import { model, Schema } from "mongoose";

const ClinicSchema: Schema = new Schema(
    {
        clinic_name: String,
        phone_num: Number,
        address: String,
        website: String,
    },
    { timestamps: true }
);

export default model("Clinic", ClinicSchema);
