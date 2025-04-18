"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
	Component,
	Headphones,
	Home,
	LogOut,
	Settings,
	Star,
	Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

const sidebarItems = [
	{
		title: "Home",
		url: "/presentations",
		icon: Home,
	},
	{
		title: "Templates",
		url: "/templates",
		icon: Component,
	},
	{
		title: "Trash",
		url: "/trash",
		icon: Trash,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
	},
];

export function AppSidebar() {
	const router = useRouter();
	const pathname = usePathname();
	const { data: session, isPending } = authClient.useSession();

	const user = session?.user;

	console.log(pathname);

	const fallbackName = user?.name
		? user.name.slice(0, 2)?.toUpperCase()
		: user?.email
			? user.email.slice(0, 2)?.toUpperCase()
			: "SL";

	const profileImage = session?.user?.image ?? undefined;

	const handleSignout = async () => {
		await authClient.signOut();
		router.replace("/authenticate");
	};

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="px-5 group-data-[collapsible=icon]:items-center">
				<div className="-ml-1 flex items-center gap-2">
					<Image src="/logo.png" alt="Slidir" priority width={50} height={50} />
					<p className="font-medium text-2xl group-data-[collapsible=icon]:hidden">
						Slidir
					</p>
				</div>
			</SidebarHeader>

			<SidebarContent className="justify-between py-8">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="gap-4 px-2 text-muted-foreground group-data-[collapsible=icon]:items-center">
							{sidebarItems.map((sidebarItem) => {
								const isActive = pathname === sidebarItem.url;

								return (
									<SidebarMenuItem
										key={sidebarItem.title}
										className={cn("rounded-md", {
											"before:-translate-y-1/2 before:-left-4 bg-foreground/5 before:absolute before:top-1/2 before:h-5 before:w-1 before:rounded-r-lg before:bg-primary before:content-[''] group-data-[collapsible=icon]:before:hidden":
												isActive,
										})}
									>
										<SidebarMenuButton className="py-5" asChild>
											<Link
												href={sidebarItem.url}
												className="flex items-center gap-4"
											>
												<sidebarItem.icon
													className={cn("!size-6", {
														"text-primary": isActive,
													})}
												/>
												<span className="!text-base font-medium">
													{sidebarItem.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="gap-4 px-2 text-muted-foreground group-data-[collapsible=icon]:items-center">
							<SidebarMenuItem>
								<SidebarMenuButton asChild className="hover:bg-transparent">
									<Link href="#" className="flex items-center gap-4">
										<Headphones className="!size-6" />
										<span className="!text-base font-medium">Support</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild className="hover:bg-transparent">
									<Link href="#" className="flex items-center gap-4">
										<Star className="!size-6" />
										<span className="!text-base font-medium">
											Feature request
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{isPending ? (
				<div className="w-full px-5 pb-1">
					<Skeleton className="h-14 w-full" />
				</div>
			) : (
				<SidebarFooter className="flex flex-row items-center justify-between px-5 group-data-[collapsible=icon]:justify-center">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarFallback>{fallbackName}</AvatarFallback>
							<AvatarImage src={profileImage} alt={fallbackName} />
						</Avatar>

						<div className="-mt-1 flex flex-col justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
							<span className="max-w-32 truncate font-medium text-base">
								{user?.name?.length ? user?.name : user?.email?.split("@")[0]}
							</span>

							<span className="max-w-26 truncate text-muted-foreground text-xs">
								{user?.email}
							</span>
						</div>
					</div>

					<Button
						variant="ghost"
						onClick={handleSignout}
						className="text-destructive hover:bg-destructive/20 hover:text-destructive group-data-[collapsible=icon]:hidden"
						size="icon"
					>
						<LogOut />
					</Button>
				</SidebarFooter>
			)}
		</Sidebar>
	);
}
