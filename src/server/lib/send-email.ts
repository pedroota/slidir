import { env } from "@/env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailProps = {
	to: string;
	subject: string;
	html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailProps) {
	try {
		const response = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>", // TODO: change to slidir.com email
			to,
			subject,
			html,
		});
		return response;
	} catch (error) {
		console.error("Error sending email:", error);
	}
}
