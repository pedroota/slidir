"use client";

import { cn } from "@/lib/utils";
import {
	Component,
	Headphones,
	Home,
	Settings,
	Star,
	Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar";
import { AppSidebarFooter } from "./app-sidebar-footer";

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
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="px-5 pt-4 group-data-[collapsible=icon]:items-center">
				<div className="-ml-1 flex items-center gap-2">
					<Image src="/logo.png" alt="Slidir" priority width={50} height={50} />
					<p className="font-medium text-2xl group-data-[collapsible=icon]:hidden">
						Slidir
					</p>
				</div>
			</SidebarHeader>

			<SidebarContent className="justify-between py-4">
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

			<AppSidebarFooter />
		</Sidebar>
	);
}
