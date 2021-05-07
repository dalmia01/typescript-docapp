import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { InvoiceResponse, FetchInvoiceInput, SaveInvoiceInput, UpdateInvoiceInput } from "../schemas/invoices.schema";
import logger from "../../configuration/logger.configuration";
import { ApolloError } from "apollo-server-errors";
import { InvoiceCounterModel, InvoiceModel } from "../../model/invoices.model";

@Resolver()
export class InvoiceResolver {
    @Query(() => [InvoiceResponse])
    async fetchInvoices(@Arg("fetchInvoiceInput") fetchInvoiceInput: FetchInvoiceInput): Promise<InvoiceResponse[]> {
        try {
            const { filter_criteria, patient_id, start } = fetchInvoiceInput;
            if (filter_criteria === "specific patient") {
                let invoices = await InvoiceModel.find({ patient_id: patient_id }).populate("patient_id");

                return invoices;
            } else if (filter_criteria === "By Date") {
                const patientInvoices = await InvoiceModel.find({ updated_at: { $gte: new Date(start) } }).populate("patient_id");
                return patientInvoices;
            } else {
                let invoices = await InvoiceModel.find({}).populate("patient_id");
                return invoices;
            }
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError("Some Error Occured while fetching invoices !! Try Again ");
        }
    }

    @Mutation(() => InvoiceResponse)
    async saveInvoice(@Arg("saveInvoiceInput") saveInvoiceInput: SaveInvoiceInput): Promise<InvoiceResponse> {
        try {
            let { line_items, patient_id, payment_mode, tax_rate, total_paid } = saveInvoiceInput;

            let incrementedCounter: number;

            let findInvoiceCounter = await InvoiceCounterModel.findById("InvoiceCoutnerID");

            // checking invoice counter existence , initialize if not
            if (!findInvoiceCounter) {
                let initializeInvoiceCounter = new InvoiceCounterModel({ _id: "InvoiceCoutnerID", sequence_counter: 10001 });

                await initializeInvoiceCounter.save();

                incrementedCounter = 10001;
            } else {
                incrementedCounter = findInvoiceCounter["sequence_counter"] + 1;
            }

            // create invoice | adding new invoice

            let createInvoice = new InvoiceModel({});

            line_items = line_items.map((item) => {
                return {
                    input_id: item.id,
                    name: item.name,
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                };
            });

            createInvoice["serial_id"] = incrementedCounter;
            createInvoice["patient_id"] = patient_id;
            createInvoice["payment_mode"] = payment_mode;
            createInvoice["tax_rate"] = tax_rate;
            createInvoice["total_paid"] = total_paid;
            createInvoice["line_items"] = line_items;
            createInvoice["created_at"] = new Date();

            await createInvoice.save();

            //incremented coutner in invoice counter model
            findInvoiceCounter["sequence_counter"] = incrementedCounter;
            await findInvoiceCounter.save();

            return createInvoice;
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError("Some Error Occured while saving invoice !! Try Again ");
        }
    }

    @Mutation(() => InvoiceResponse)
    async updateInvoice(@Arg("updateInvoiceInput") updateInvoiceInput: UpdateInvoiceInput): Promise<InvoiceResponse> {
        try {
            const { serial_id, line_items, payment_mode, tax_rate, total_paid } = updateInvoiceInput;
            let findInvoice = await InvoiceModel.findOne({ serial_id });

            if (findInvoice) {
                let updated_line_items = line_items.map((item) => {
                    return {
                        input_id: item.input_id,
                        name: item.name,
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                    };
                });

                findInvoice["payment_mode"] = payment_mode;
                findInvoice["tax_rate"] = tax_rate;
                findInvoice["total_paid"] = total_paid;
                findInvoice["line_items"] = updated_line_items;

                let invoice = await findInvoice.save();
                return invoice;
            } else {
                throw new ApolloError("Invoice Does not exist  !! Try Again ");
            }
        } catch (err) {
            logger.log(err);
            throw new ApolloError("Some Error Occured while editing invoice !! Try Again ");
        }
    }

    @Mutation(() => String)
    async deleteInvoice(@Arg("serial_id", { nullable: true }) serial_id: number): Promise<string> {
        try {
            let findInvoice = await InvoiceModel.findOne({ serial_id });
            if (!findInvoice) throw new ApolloError("No invoice found");
            await findInvoice.delete();
            return "Invoice deleted successfully";
        } catch (err) {
            logger.log(err.message);
            throw new ApolloError("Some Error Occured while deleting invoice !! Try Again ");
        }
    }
}
