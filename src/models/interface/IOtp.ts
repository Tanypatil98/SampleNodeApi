export interface IOtp {
    otp: number;
    mobileNumber: string;
    isDeleted: boolean;
    created_at: Date;
}