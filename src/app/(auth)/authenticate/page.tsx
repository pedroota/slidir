import { AuthenticateForm } from "@/components/authenticate-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Authenticate() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session?.user) {
		return redirect("/presentations");
	}

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
				<div className="flex items-center gap-2">
					<Image src="/logo.png" alt="Slidir" width={50} height={50} />
					<p className="font-medium text-2xl">Slidir</p>
				</div>

				<AuthenticateForm />
			</section>
		</main>
	);
}
