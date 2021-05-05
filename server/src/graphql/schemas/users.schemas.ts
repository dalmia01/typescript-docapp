import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class Address {
    @Field({ nullable: true })
    line?: string;
    @Field({ nullable: true })
    area?: string;
    @Field({ nullable: true })
    city?: string;
    @Field({ nullable: true })
    state?: string;
    @Field({ nullable: true })
    pincode?: number;
}

@InputType()
export class AddressInput {
    @Field({ nullable: true })
    line?: string;
    @Field({ nullable: true })
    area?: string;
    @Field({ nullable: true })
    city?: string;
    @Field({ nullable: true })
    state?: string;
    @Field({ nullable: true })
    pincode?: number;
}

@ObjectType()
export class User {
    @Field({ nullable: true })
    title?: string;
    @Field({ nullable: true })
    gender?: string;
    @Field({ nullable: true })
    age?: number;
    @Field({ nullable: true })
    first_name?: string;
    @Field({ nullable: true })
    last_name?: string;
    @Field({ nullable: true })
    phone?: number;
    @Field({ nullable: true })
    designation?: string;
    @Field({ nullable: true })
    role?: string;
    @Field({ nullable: true })
    email?: string;
    @Field({ nullable: true })
    address?: Address;
}

@ObjectType()
export class UserResponse extends User {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    active_status?: boolean;
    @Field({ nullable: true })
    clinic?: string;
    @Field({ nullable: true })
    created_at?: string;
    @Field({ nullable: true })
    updated_at?: Date;
}

@InputType()
export class UserInput {
    @Field({ nullable: true })
    title?: string;
    @Field({ nullable: true })
    gender?: string;
    @Field({ nullable: true })
    age?: number;
    @Field({ nullable: true })
    first_name?: string;
    @Field({ nullable: true })
    last_name?: string;
    @Field()
    phone: number;
    @Field()
    password: string;
    @Field({ nullable: true })
    designation?: string;
    @Field({ nullable: true })
    role?: string;
    @Field({ nullable: true })
    email?: string;
    @Field({ nullable: true })
    address?: AddressInput;
}

@InputType()
export class UserEditInput {
    @Field({ nullable: true })
    title?: string;
    @Field({ nullable: true })
    gender?: string;
    @Field({ nullable: true })
    age?: number;
    @Field({ nullable: true })
    first_name?: string;
    @Field({ nullable: true })
    last_name?: string;
    @Field()
    phone: number;
    @Field({ nullable: true })
    designation?: string;
    @Field({ nullable: true })
    role?: string;
    @Field({ nullable: true })
    email?: string;
    @Field({ nullable: true })
    address?: AddressInput;
}

@InputType()
export class SignInInput {
    @Field()
    phone: number;
    @Field()
    password: string;
}

@InputType()
export class UserResetInput {
    @Field()
    phone: number;
    @Field()
    password: string;
    @Field()
    new_password: string;
}

@ObjectType()
export class SignInResponse {
    @Field()
    id: string;
    @Field()
    phone: number;
    @Field()
    token: string;
}

@ObjectType()
export class SendOtpResponse {
    @Field()
    message: string;
    @Field()
    hash: string;
}

@InputType()
export class ConfirmUserOtpInput {
    @Field()
    phone: number;
    @Field()
    otp: number;
    @Field()
    hash: string;
    @Field()
    new_password: string;
}
