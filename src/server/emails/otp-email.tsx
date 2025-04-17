import {
	Body,
	Container,
	Font,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
	render,
} from "@react-email/components";

interface OtpEmailProps {
	otpCode: string;
}

const OtpEmail = ({ otpCode }: OtpEmailProps) => (
	<Html>
		<Head>
			<Font
				fontFamily="Roboto"
				fallbackFontFamily="Verdana"
				webFont={{
					url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
					format: "woff2",
				}}
				fontWeight={400}
				fontStyle="normal"
			/>
		</Head>
		<Preview>Your Slidir verification code</Preview>
		<Tailwind>
			<Body className="bg-white">
				<Container className="mx-auto px-8 pt-5 pb-12">
					<Img
						src="https://hospitable-grace-production.up.railway.app/logo.svg"
						width="170"
						height="50"
						alt="Slidir"
						className="mx-auto"
					/>

					<Hr className="my-8 text-gray-400 text-xs" />

					<Text className="text-[15px] text-gray-600 leading-7">Hi,</Text>

					<Text className="text-[15px] text-gray-600 leading-7">
						Use the code below to complete your login or verification. This code
						expires in 5 minutes.
					</Text>

					<Section className="my-8 w-full text-center">
						<Text className="inline-block rounded-md bg-slate-100 px-6 py-4 text-center font-bold text-3xl tracking-[0.3em]">
							{otpCode}
						</Text>
					</Section>

					<Text className="text-[15px] text-gray-600 leading-7">
						If you didn't request this code, you can safely ignore this email.
					</Text>

					<br />

					<Text className="text-[15px] text-gray-600 leading-7">
						Best regards,
						<br />
						The Slidir Team
					</Text>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

export async function otpEmailHtml(otpCode: string): Promise<string> {
	return await render(<OtpEmail otpCode={otpCode} />);
}

OtpEmail.PreviewProps = {
	otpCode: "123456",
} as OtpEmailProps;

export default OtpEmail;
