import { AuthenticateForm } from "@/components/authenticate-form";
import Image from "next/image";

export default function Authenticate() {
	return (
		<main className="flex max-h-dvh min-h-dvh overflow-hidden">
			<section className="hidden w-full max-w-1/2 lg:block">
				<Image
					src="/marketing-image.png"
					alt="Marketing presentation"
					width={580}
					height={784}
					priority
					className="h-full w-full object-cover"
				/>
			</section>

			<section className="flex w-full flex-col items-center justify-center gap-12 lg:max-w-1/2">
				<Image src="/logo.png" alt="Slidir" priority width={116} height={50} />

				<AuthenticateForm />
			</section>
		</main>
	);
}
