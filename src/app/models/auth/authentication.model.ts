export interface VerifyEmailModel {
    otpCode: string;
}

export interface ForgotPasswordModel {
    email: string;
}

export interface ResetPasswordModel {
    otpCode: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ResendEmailConfirmModel {
    email: string;
}


