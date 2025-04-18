import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export enum SWR_KEYS {
	SendVerifyEmailOtp = "send-verify-email-otp",
	VerifyEmailOtp = "verify-email-otp",
	SignInWithGoogle = "sign-in-with-google",
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
