import { Field, InputType, ObjectType } from "type-graphql";
import { PatientResponse } from "./patients.schema";

@ObjectType()
export class LineItemResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    input_id?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    description?: string;
    @Field({ nullable: true })
    quantity?: string;
    @Field({ nullable: true })
    price?: string;
}

@ObjectType()
export class InvoiceResponse {
    @Field({ nullable: true })
    id?: string;
    @Field(() => [LineItemResponse], { nullable: true })
    line_items?: LineItemResponse[];
    @Field({ nullable: true })
    serial_id?: number;
    @Field({ nullable: true })
    patient_id?: PatientResponse;
    @Field({ nullable: true })
    payment_mode?: string;
    @Field({ nullable: true })
    tax_rate?: string;
    @Field({ nullable: true })
    total_paid?: string;
    @Field({ nullable: true })
    created_at?: string;
    @Field({ nullable: true })
    updated_at?: string;
}

@InputType()
export class FetchInvoiceInput {
    @Field({ nullable: true })
    filter_criteria?: string;
    @Field({ nullable: true })
    unique?: string;
    @Field({ nullable: true })
    patient_id?: string;
    @Field({ nullable: true })
    start?: string;
}

@InputType()
export class LineItemsInput {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    description?: string;
    @Field({ nullable: true })
    quantity?: string;
    @Field({ nullable: true })
    price?: string;
}

@InputType()
export class UpdateLineItemsInput {
    @Field({ nullable: true })
    input_id?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    description?: string;
    @Field({ nullable: true })
    quantity?: string;
    @Field({ nullable: true })
    price?: string;
}

@InputType()
export class SaveInvoiceInput {
    @Field({ nullable: true })
    patient_id?: string;
    @Field({ nullable: true })
    payment_mode?: string;
    @Field({ nullable: true })
    tax_rate?: string;
    @Field({ nullable: true })
    total_paid?: string;
    @Field(() => [LineItemsInput], { nullable: true })
    line_items?: LineItemsInput[];
}

@InputType()
export class UpdateInvoiceInput {
    @Field({ nullable: true })
    serial_id?: number;
    @Field(() => [UpdateLineItemsInput], { nullable: true })
    line_items?: UpdateLineItemsInput[];
    @Field({ nullable: true })
    payment_mode?: string;
    @Field({ nullable: true })
    tax_rate?: string;
    @Field({ nullable: true })
    total_paid?: string;
}
