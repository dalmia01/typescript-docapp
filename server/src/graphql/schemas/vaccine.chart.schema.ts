import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class RangesResponse {
    @Field({ nullable: true })
    start_range?: number;
    @Field({ nullable: true })
    end_range?: number;
    @Field({ nullable: true })
    range_unit?: string;
    @Field({ nullable: true })
    range_label?: string;
}

@ObjectType()
export class VaccinesSchedule {
    @Field({ nullable: true })
    range?: number;
    @Field({ nullable: true })
    medicine_name?: string;
    @Field(() => [String], { nullable: true })
    medicine_brands?: string[];
}

@ObjectType()
export class VaccinesResponse {
    @Field({ nullable: true })
    vaccine_group_name?: string;
    @Field(() => [VaccinesSchedule], { nullable: true })
    schedule?: VaccinesSchedule[];
}

@ObjectType()
export class VaccineChartResponse {
    @Field({ nullable: true })
    id?: string;
    @Field(() => [RangesResponse], { nullable: true })
    ranges?: RangesResponse[];
    @Field(() => [VaccinesResponse], { nullable: true })
    vaccine_group?: VaccinesResponse[];
}

@InputType()
export class VaccineChartDatesInput {
    @Field({ nullable: true })
    start?: string;
    @Field({ nullable: true })
    end?: string;
}
