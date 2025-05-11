import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditorLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return redirect("/authenticate");
	}

	return <main className="h-dvh w-full">{children}</main>;
}
