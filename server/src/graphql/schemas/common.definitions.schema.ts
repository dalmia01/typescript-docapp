import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class CommonDefinitionFields {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    operator?: string;
    @Field({ nullable: true })
    label?: string;
    @Field(() => [String], { nullable: true })
    possible_values?: string[];
    @Field({ nullable: true })
    value?: string;
}

@ObjectType()
export class CommonDefintionsResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    category?: string;
    @Field({ nullable: true })
    description?: string;
    @Field({ nullable: true })
    dosageForm?: string;
    @Field(() => [CommonDefinitionFields], { nullable: true })
    fields?: CommonDefinitionFields[];
    @Field({ nullable: true })
    is_fav?: boolean;
}

@InputType()
export class FetchFilterDefinitionInput {
    @Field({ nullable: true })
    filteredValue?: string;
    @Field({ nullable: true })
    category?: string;
    @Field({ nullable: true })
    someId: string;
}

@InputType()
export class SpecificDefintionInput {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    category?: string;
}

@InputType()
export class CommonDefinitonInput {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    patient_id?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    category?: string;
    @Field({ nullable: true })
    fields?: string;
}

@InputType()
export class AddMedicineDefinationInput {
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    description?: string;
    @Field({ nullable: true })
    dosageForm?: string;
    @Field({ nullable: true })
    category?: string;
    @Field({ nullable: true })
    fields?: string;
}
