import { compare, genSalt, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import moment from "moment";

export const hashingPassword = async (password: string): Promise<string> => {
    const salt = await genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
};

export const comparingPassword = async (userPassword: string, hashedPassword: string): Promise<boolean> => {
    const isPasswordVerified = await compare(userPassword, hashedPassword);
    return isPasswordVerified;
};

export const convertToLower = (value: string) => value.toLowerCase();

export const verifyJWTAccessToken = (token: string) => {
    const isTokenVerified = verify(token, process.env.JWT_SECRET_KEY);
    return isTokenVerified;
};

export const generateJWTAccessToken = (id: string): string => {
    const jwtAccessToken = sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
    return jwtAccessToken;
};

export const generateRandomNumber = (num: number) => Math.floor(num + Math.random() * 900000);

export const determineDueDate = (dateOfBirth, range, filterByDate) => {
    switch (range) {
        case 0:
            return dateOfBirth < filterByDate;
        case 1:
            return moment(dateOfBirth).add(6, "weeks") < filterByDate;
        case 2:
            return moment(dateOfBirth).add(10, "weeks") < filterByDate;
        case 3:
            return moment(dateOfBirth).add(14, "weeks") < filterByDate;
        case 5:
            return moment(dateOfBirth).add(6, "months") < filterByDate;
        case 6:
            return moment(dateOfBirth).add(9, "months") < filterByDate;
        case 7:
            return moment(dateOfBirth).add(15, "months") < filterByDate;
        case 8:
            return moment(dateOfBirth).add(18, "months") < filterByDate;
        case 9:
            return moment(dateOfBirth).add(4, "years") < filterByDate;
        default:
            return false;
    }
};
