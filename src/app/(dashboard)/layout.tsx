import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return redirect("/authenticate");
	}

	return (
		<SidebarProvider>
			<AppSidebar />

			<main>{children}</main>
		</SidebarProvider>
	);
}
