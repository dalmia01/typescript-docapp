import { model, Schema } from "mongoose";

const AppointmentSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        slots: {
            monday: [String],
            tuesday: [String],
            wednesday: [String],
            thursday: [String],
            friday: [String],
            saturday: [String],
            sunday: [String],
        },
        booked: [
            {
                patient: {
                    type: Schema.Types.ObjectId,
                    ref: "patient",
                },
                date: String,
                time: String,
            },
        ],
    },
    { timestamps: true }
);

export const AppointmentModel = model("appointments", AppointmentSchema);
