// Base URL
export const API_BASE_URL = "http://localhost:2000/api";

// API URLs
export const LOGIN_USER = `${API_BASE_URL}/user/login`;
export const LOGOUT_USER = `${API_BASE_URL}/user/logout`;
export const VERIFY_OTP = `${API_BASE_URL}/user/loginotpverify`;
export const RESEND_OTP = `${API_BASE_URL}/user/resendotp`;

export const FORGOT_PASSWORD = `${API_BASE_URL}/user/forgotpassword`;
export const RESET_PASSWORD = `${API_BASE_URL}/user/resetpassword`;
