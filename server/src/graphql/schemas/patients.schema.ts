import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class FilterInputPatient {
    @Field({ nullable: true })
    name_phone?: string;
    @Field({ nullable: true })
    date?: string;
}

@ObjectType()
export class AddressResponse {
    @Field({ nullable: true })
    line_1?: string;
    @Field({ nullable: true })
    area?: string;
    @Field({ nullable: true })
    city?: string;
    @Field({ nullable: true })
    state?: string;
    @Field({ nullable: true })
    pincode?: string;
}

@ObjectType()
export class BookingsResponse {
    @Field({ nullable: true })
    doctor_id?: string;
    @Field({ nullable: true })
    date?: string;
    @Field({ nullable: true })
    time?: string;
}

@ObjectType()
export class VaccineResponse {
    @Field({ nullable: true })
    due_date?: Date;
    @Field({ nullable: true })
    given_date?: Date;
    @Field({ nullable: true })
    medicine_brand?: string;
    @Field({ nullable: true })
    medicine_name?: string;
    @Field({ nullable: true })
    notes?: string;
    @Field({ nullable: true })
    range?: number;
    @Field({ nullable: true })
    vaccine_group_name?: string;
}

@ObjectType()
export class MediaResponse {
    @Field({ nullable: true })
    original_name?: string;
    @Field({ nullable: true })
    filename?: string;
    @Field({ nullable: true })
    mimetype?: string;
}

@ObjectType()
export class MedicalHistoryDataResponse {
    @Field({ nullable: true })
    label?: string;
    @Field({ nullable: true })
    value?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    operator?: string;
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    possible_values?: string;
}

@ObjectType()
export class MedicalHistoryResponse {
    @Field({ nullable: true })
    defination?: string;
    @Field({ nullable: true })
    name?: string;
    @Field((type) => [MedicalHistoryDataResponse], { nullable: true })
    data?: MedicalHistoryDataResponse[];
}

@ObjectType()
export class PatientResponse {
    @Field({ nullable: true })
    id?: string;
    @Field({ nullable: true })
    first_name?: string;
    @Field({ nullable: true })
    last_name?: string;
    @Field({ nullable: true })
    email?: string;
    @Field({ nullable: true })
    patient_unique_id?: string;
    @Field({ nullable: true })
    patient_serial_id?: string;
    @Field({ nullable: true })
    phone?: string;
    @Field({ nullable: true })
    salutation?: string;
    @Field({ nullable: true })
    age?: number;
    @Field({ nullable: true })
    dob?: string;
    @Field({ nullable: true })
    patient_id?: string;
    @Field({ nullable: true })
    blood_grp?: string;
    @Field({ nullable: true })
    sex?: string;
    @Field({ nullable: true })
    address?: AddressResponse;
    @Field((type) => [BookingsResponse], { nullable: true })
    bookings?: [BookingsResponse];
    @Field(() => [VaccineResponse], { nullable: true })
    vaccine?: [VaccineResponse];
    @Field(() => [MediaResponse], { nullable: true })
    media?: [MediaResponse];
    @Field({ nullable: true })
    notes?: string;
    @Field({ nullable: true })
    follow_up_date?: Date;
    @Field(() => [MedicalHistoryResponse], { nullable: true })
    medical_history?: [MedicalHistoryResponse];
    @Field({ nullable: true })
    isTracked?: boolean;
}

@InputType()
export class PatientAddressInput {
    @Field({ nullable: true })
    line_1?: string;
    @Field({ nullable: true })
    area?: string;
    @Field({ nullable: true })
    city?: string;
    @Field({ nullable: true })
    state?: string;
    @Field({ nullable: true })
    pincode?: string;
}

@InputType()
export class CreateInputPatient {
    @Field({ nullable: true })
    first_name?: string;
    @Field({ nullable: true })
    last_name?: string;
    @Field({ nullable: true })
    email?: string;
    @Field({ nullable: true })
    patient_serial_id?: string;
    @Field()
    phone: string;
    @Field({ nullable: true })
    dob: string;
    @Field({ nullable: true })
    salutation?: string;
    @Field({ nullable: true })
    blood_grp?: string;
    @Field({ nullable: true })
    sex?: string;
    @Field({ nullable: true })
    address?: PatientAddressInput;
}

@InputType()
export class EditPatientInput extends CreateInputPatient {
    @Field()
    id: string;
}

@InputType()
export class MedicalHistoryDataInput {
    @Field({ nullable: true })
    label?: string;
    @Field({ nullable: true })
    value?: string;
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    operator?: string;
    @Field({ nullable: true })
    id?: string;
    @Field(() => [String], { nullable: true })
    possible_values?: string[];
}

@InputType()
export class MedicalHistoryInputType {
    @Field({ nullable: true })
    defination?: string;
    @Field({ nullable: true })
    name?: string;
    @Field((type) => [MedicalHistoryDataInput], { nullable: true })
    data?: MedicalHistoryDataResponse[];
}

@InputType()
export class MedicalHistoryInput {
    @Field()
    id: string;
    @Field(() => [MedicalHistoryInputType], { nullable: true })
    medical_history?: [MedicalHistoryInputType];
}

@InputType()
export class VaccineInput {
    @Field({ nullable: true })
    due_date?: Date;
    @Field({ nullable: true })
    given_date?: Date;
    @Field({ nullable: true })
    medicine_brand?: string;
    @Field({ nullable: true })
    medicine_name?: string;
    @Field({ nullable: true })
    notes?: string;
    @Field({ nullable: true })
    range?: number;
    @Field({ nullable: true })
    vaccine_group_name?: string;
}

@InputType()
export class VaccinePatientInput extends VaccineInput {
    @Field()
    id: string;
    @Field({ nullable: true })
    vaccine?: VaccineInput;
}
