import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class GetPrescriptionInput {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    unique?: string;
}

@ObjectType()
export class DoctorResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    first_name?: string;
    @Field({ nullable: true })
    last_name?: string;
    @Field({ nullable: true })
    title?: string;
    @Field({ nullable: true })
    designation?: string;
}

@ObjectType()
export class CommonDefsDataResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    defination?: string;
    @Field({ nullable: true })
    label?: string;
    @Field({ nullable: true })
    value?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    operator?: string;
    @Field(() => [String], { nullable: true })
    possible_values?: string[];
}

@ObjectType()
export class CommonDefsResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    defination?: string;
    @Field({ nullable: true })
    name?: string;
    @Field(() => [CommonDefsDataResponse], { nullable: true })
    data?: CommonDefsDataResponse[];
}

@ObjectType()
export class PrescriptionResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    patient?: string;
    @Field({ nullable: true })
    doctor?: DoctorResponse;
    @Field({ nullable: true })
    updatedAt?: Date;
    @Field({ nullable: true })
    fav_name?: string;
    @Field(() => [CommonDefsResponse], { nullable: true })
    symptoms?: CommonDefsResponse[];
    @Field(() => [CommonDefsResponse], { nullable: true })
    findings?: CommonDefsResponse[];
    @Field(() => [CommonDefsResponse], { nullable: true })
    diagnosis?: CommonDefsResponse[];
    @Field(() => [CommonDefsResponse], { nullable: true })
    investigations?: CommonDefsResponse[];
    @Field(() => [CommonDefsResponse], { nullable: true })
    instructions?: CommonDefsResponse[];
    @Field(() => [CommonDefsResponse], { nullable: true })
    medicines?: CommonDefsResponse[];
    @Field(() => CommonDefsResponse, { nullable: true })
    vitals?: CommonDefsResponse;
    @Field({ nullable: true })
    additional_notes?: string;
}
