import { compare, genSalt, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

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
    const jwtAccessToken = sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    return jwtAccessToken;
};
