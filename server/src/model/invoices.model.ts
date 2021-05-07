import { model, Schema } from "mongoose";

const InvoiceSchema: Schema = new Schema(
    {
        serial_id: Number,
        patient_id: {
            type: Schema.Types.ObjectId,
            ref: "patient",
        },
        payment_mode: String,
        tax_rate: String,
        total_paid: String,
        line_items: [
            {
                input_id: String,
                name: String,
                description: String,
                quantity: String,
                price: String,
            },
        ],
    },
    { timestamps: true }
);

const InvoiceCounterSchema = new Schema({
    _id: { type: String, required: true },
    sequence_counter: { type: Number, default: 0 },
});

export const InvoiceModel = model("invoice", InvoiceSchema);
export const InvoiceCounterModel = model("invoiceCounter", InvoiceCounterSchema);
