"use client";

import { authClient } from "@/lib/auth-client";
import { Component, Home, LogOut, Settings, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const items = [
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
	const { data: session, isPending } = authClient.useSession();

	const user = session?.user;

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
				<div className="flex items-center gap-3">
					<Image src="/logo.png" alt="Slidir" priority width={50} height={50} />
					<p className="font-medium text-3xl group-data-[collapsible=icon]:hidden">
						Slidir
					</p>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="gap-4 group-data-[collapsible=icon]:items-center">
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon className="!size-6" />
											<span className="!text-base">{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{isPending ? null : (
				<SidebarFooter className="flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarFallback>{fallbackName}</AvatarFallback>
							<AvatarImage src={profileImage} alt={fallbackName} />
						</Avatar>

						<div className="-mt-1 flex flex-col justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
							<span className="max-w-32 truncate font-semibold text-base">
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
