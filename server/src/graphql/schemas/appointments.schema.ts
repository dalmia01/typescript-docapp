import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class AppointmentAllSlotsResponse {
    @Field(() => [String], { nullable: true })
    monday?: string[];
    @Field(() => [String], { nullable: true })
    tuesday?: string[];
    @Field(() => [String], { nullable: true })
    wednesday?: string[];
    @Field(() => [String], { nullable: true })
    thursday?: string[];
    @Field(() => [String], { nullable: true })
    friday?: string[];
    @Field(() => [String], { nullable: true })
    saturday?: string[];
    @Field(() => [String], { nullable: true })
    sunday?: string[];
}

@ObjectType()
export class AppointmentBookedResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    patient?: string;
    @Field({ nullable: true })
    date?: string;
    @Field({ nullable: true })
    time?: string;
}

@ObjectType()
export class AppointmentResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    user?: string;
    @Field(() => AppointmentAllSlotsResponse, { nullable: true })
    slots?: AppointmentAllSlotsResponse;
    @Field(() => [AppointmentBookedResponse], { nullable: true })
    booked?: AppointmentBookedResponse[];
}

@InputType()
export class AppointmentDaySlotInput {
    @Field()
    id: string;
    @Field()
    day: string;
    @Field()
    date: string;
}

@InputType()
export class AppointmentAllSlotsInput {
    @Field(() => [String], { nullable: true })
    monday?: string[];
    @Field(() => [String], { nullable: true })
    tuesday?: string[];
    @Field(() => [String], { nullable: true })
    wednesday?: string[];
    @Field(() => [String], { nullable: true })
    thursday?: string[];
    @Field(() => [String], { nullable: true })
    friday?: string[];
    @Field(() => [String], { nullable: true })
    saturday?: string[];
    @Field(() => [String], { nullable: true })
    sunday?: string[];
}

@InputType()
export class SetAppointmentSlotInput {
    @Field()
    user_id: string;
    @Field(() => AppointmentAllSlotsInput, { nullable: true })
    slots?: AppointmentAllSlotsInput;
}

@InputType()
export class BookAppointmentInput {
    @Field({ nullable: true })
    doctor_id?: string;
    @Field({ nullable: true })
    date?: string;
    @Field({ nullable: true })
    time?: string;
    @Field({ nullable: true })
    patient_id?: string;
}
