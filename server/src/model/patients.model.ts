import { model, Schema } from "mongoose";

const PatientSchema: Schema = new Schema(
    {
        first_name: String,
        last_name: String,
        email: String,
        patient_unique_id: String,
        patient_serial_id: String,
        phone: {
            type: String,
            required: true,
        },
        salutation: { type: String, default: "mrs" },
        age: {
            type: Number,
        },
        dob: String,
        patient_id: String,
        blood_grp: String,
        sex: {
            type: String,
            default: "female",
        },
        address: {
            line_1: String,
            line_2: String,
            area: String,
            state: String,
            city: String,
            pincode: String,
        },
        bookings: [
            {
                doctor_id: String,
                date: String,
                time: String,
            },
        ],
        vaccine: [
            {
                updated_at: { type: Date, default: Date.now },
                due_date: Date,
                given_date: Date,
                medicine_brand: String,
                medicine_name: String,
                notes: String,
                range: Number,
                vaccine_group_name: String,
            },
        ],
        media: [
            {
                created_at: { type: Date, default: Date.now },
                original_name: String,
                filename: String,
                mimetype: String,
            },
        ],
        notes: String,
        follow_up_date: Date,
        medical_history: [
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
        isTracked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const PatientCounterSchema: Schema = new Schema({
    _id: { type: String, required: true },
    sequence_counter: { type: Number },
});

export const PatientModel = model("patient", PatientSchema);
export const PatientCounterModel = model("patientCounter", PatientCounterSchema);
