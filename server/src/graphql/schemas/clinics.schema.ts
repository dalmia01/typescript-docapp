import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class ClinicResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    clinic_name?: string;
    @Field({ nullable: true })
    address?: string;
    @Field({ nullable: true })
    phone_num?: number;
    @Field({ nullable: true })
    website?: string;
    @Field({ nullable: true })
    created_at?: string;
    @Field({ nullable: true })
    updated_at?: Date;
}

@InputType()
export class ClinicInput {
    @Field()
    clinic_name: string;
    @Field({ nullable: true })
    address?: string;
    @Field({ nullable: true })
    phone_num?: number;
    @Field({ nullable: true })
    website?: string;
}

@InputType()
export class ClinicEditInput {
    @Field()
    id: string;
    @Field({ nullable: true })
    clinic_name?: string;
    @Field({ nullable: true })
    address?: string;
    @Field({ nullable: true })
    phone_num?: number;
    @Field({ nullable: true })
    website?: string;
}
