import { createHmac } from "crypto";
import { Query, Mutation, Resolver, Arg } from "type-graphql";
import UserModel from "../../model/users.models";
import {
    SignInInput,
    SignInResponse,
    UserInput,
    UserResponse,
    UserResetInput,
    UserEditInput,
    SendOtpResponse,
    ConfirmUserOtpInput,
} from "../schemas/users.schemas";
import { statusMessage } from "../../constants/message.constants";
import { ApolloError } from "apollo-server-errors";
import { comparingPassword, generateJWTAccessToken, hashingPassword, sixDigitRandomNumber } from "../../helpers/common.helpers";
import { sendSms } from "../../helpers/sms.helpers";

@Resolver()
export default class UserResolver {
    @Query(() => [UserResponse])
    async fetchAllUsers(@Arg("role", { nullable: true }) role?: string): Promise<UserResponse[]> {
        const users = role ? await UserModel.find({ role }) : await UserModel.find();

        if (!users) throw new ApolloError(statusMessage(500));

        if (users.length < 1) throw new ApolloError(statusMessage(404));

        return users;
    }

    @Mutation(() => SignInResponse)
    async sigInUser(@Arg("signInInput") signInInput: SignInInput): Promise<SignInResponse> {
        const { phone, password } = signInInput;

        const user = await UserModel.findOne({ phone });

        if (!user) throw new ApolloError(statusMessage(422), "422");

        const isPasswordVerified = await comparingPassword(password, user["password"]);

        if (!isPasswordVerified) throw new ApolloError(statusMessage(422), "422");

        const jwtAccessToken = generateJWTAccessToken(user.id);

        return {
            id: user.id,
            phone: user["phone"],
            token: jwtAccessToken,
        };
    }

    @Mutation(() => String)
    async resetUserPassword(@Arg("userResetInput") userResetInput: UserResetInput): Promise<string> {
        const { phone, password, new_password } = userResetInput;

        let user = await UserModel.findOne({ phone });

        if (!user) throw new ApolloError(statusMessage(422), "422");

        const isPasswordVerified = await comparingPassword(password, user["password"]);

        if (!isPasswordVerified) throw new ApolloError(statusMessage(422), "422");

        const hashedPassword = await hashingPassword(new_password);

        if (!hashedPassword) throw new ApolloError(statusMessage(410), "410");

        user["password"] = hashedPassword;
        await user.save();

        return "password reset successfully";
    }

    @Mutation(() => SendOtpResponse)
    async sendOtpUserForgetPassword(@Arg("phone") phone: number): Promise<SendOtpResponse> {
        const user = await UserModel.findOne({ phone });

        if (!user) throw new ApolloError(statusMessage(420));

        const otp = sixDigitRandomNumber();
        const ttl = 2 * 60 * 1000;
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = createHmac("sha256", process.env.SMS_SECRET_KEY).update(data).digest("hex");
        const fullHash = `${hash}.${expires}`;

        const isVerified = await sendSms(`Your OTP Verification Code is ${otp}. Do not disclose it to anyone.`, `+91 ${phone}`);

        if (!isVerified) throw new ApolloError(statusMessage(410));

        return { message: "Otp is sent to your mobile number", hash: fullHash };
    }

    @Mutation(() => String)
    async confirmOtpUserForgetpassword(@Arg("confirmUserOtpInput") confirmUserOtpInput: ConfirmUserOtpInput): Promise<string> {
        const { phone, otp, hash, new_password } = confirmUserOtpInput;
        const [hashValue, expires] = hash.split(".");

        let now = Date.now();
        if (now > parseInt(expires)) throw new ApolloError(statusMessage(409));

        const data = `${phone}.${otp}.${expires}`;

        const newCalculatedhash = createHmac("sha256", process.env.SMS_SECRET_KEY).update(data).digest("hex");

        if (newCalculatedhash !== hashValue) throw new ApolloError(statusMessage(422));

        const hashedPassword = await hashingPassword(new_password);

        await UserModel.findOneAndUpdate({ phone }, { password: hashedPassword });

        return "otp confirm and password set successfully";
    }

    @Mutation(() => UserResponse)
    async createUser(@Arg("userinput") userinput: UserInput): Promise<UserResponse> {
        const { phone } = userinput;

        let isUser = await UserModel.findOne({ phone });

        if (isUser) throw new ApolloError(statusMessage(406));

        let newUser = new UserModel();
        for (let key in userinput) {
            if (key === "address") {
                newUser[key] = {};
                for (let newKey in userinput[key]) {
                    newUser[key][newKey] = userinput[key][newKey];
                }
            } else if (key === "password") {
                const hashedPassword = await hashingPassword(userinput[key]);
                if (!hashedPassword) throw new ApolloError(statusMessage(410), "410");
                newUser[key] = hashedPassword;
            } else {
                newUser[key] = userinput[key];
            }
        }

        let user = await newUser.save();

        if (!user) throw new ApolloError(statusMessage(410), "410");

        return user;
    }

    @Mutation(() => UserResponse)
    async editUser(@Arg("userEditInput") userEditInput: UserEditInput): Promise<UserResponse> {
        const { phone } = userEditInput;

        let user = await UserModel.findOne({ phone });

        if (!user) throw new Error(statusMessage(400));

        for (let key in userEditInput) {
            if (key === "address") {
                user[key] = user[key] || {};
                for (let innerKey in userEditInput[key]) {
                    user[key][innerKey] = userEditInput[key][innerKey];
                }
            } else {
                user[key] = userEditInput[key];
            }
        }

        await user.save();

        return { id: "modification successfull is done" };
    }

    @Mutation(() => String)
    async deleteUser(@Arg("phone") phone: number): Promise<string> {
        const user = await UserModel.deleteOne({ phone });
        if (user.deletedCount < 1) throw new ApolloError(statusMessage(404), "404");
        return "user deleted successfully";
    }

    @Mutation(() => UserResponse)
    async userActiveStatus(@Arg("phone") phone: number): Promise<UserResponse> {
        let user = await UserModel.findOne({ phone });

        if (!user) throw new ApolloError(statusMessage(404));

        user["active_status"] = !user["active_status"];
        user = await user.save();

        return user;
    }
}
