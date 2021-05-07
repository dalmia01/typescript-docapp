import { model, Schema } from "mongoose";
import { convertToLower } from "../helpers/common.helpers";

const UserSchema: Schema = new Schema(
    {
        title: String,
        gender: String,
        age: Number,
        first_name: { type: String, set: convertToLower },
        last_name: { type: String, set: convertToLower },
        phone: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        designation: String,
        role: String,
        email: String,
        address: {
            line: String,
            area: String,
            city: String,
            state: String,
            pincode: Number,
        },
        old_passwords: [{ value: String, updated_at: String }],
        active_status: { type: Boolean, default: true },
        clinic: { type: Schema.Types.ObjectId, ref: "clinics" },
    },
    { timestamps: true }
);

export default model("User", UserSchema);
