import { env } from "@/env";
import { otpEmailHtml } from "@/server/emails/otp-email";
import { sendEmail } from "@/server/lib/send-email";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { emailHarmony } from "better-auth-harmony";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, openAPI } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";
import { db } from "../server/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [
		openAPI(), // /api/auth/reference
		emailHarmony(),
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
				const otpEmail = await otpEmailHtml(otp);

				await sendEmail({
					to: email,
					subject: "Verify your email",
					html: otpEmail,
				});
			},
			sendVerificationOnSignUp: true,
			allowedAttempts: 5,
			otpLength: 6,
			expiresIn: 5 * 60, // 5 minutes
		}),
	],
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	rateLimit: {
		window: 60, // time window in seconds
		max: 5, // max requests in the window
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	account: {
		accountLinking: {
			enabled: true,
		},
	},
} satisfies BetterAuthOptions);

export const getServerSession = cache(
	async () =>
		await auth.api.getSession({
			headers: await headers(),
		}),
);

export type Session = typeof auth.$Infer.Session;
export type AuthUserType = Session["user"];
