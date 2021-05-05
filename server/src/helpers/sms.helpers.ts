import { Twilio } from "twilio";
import { statusMessage } from "../constants/message.constants";

const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountsid, authtoken);
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

export const sendSms = async (message: string, phone: string): Promise<boolean> => {
    return client.messages
        .create({
            body: message,
            from: twilioPhone,
            to: phone,
        })
        .then((res) => {
            return true;
        })
        .catch((err) => {
            return false;
        });
};
