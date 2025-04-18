import { authClient } from "@/lib/auth-client";
import { ChevronsUpDown, CreditCard, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarFooter, SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export function AppSidebarFooter() {
	const { isMobile } = useSidebar();
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const user = session?.user;

	const fallbackShortName = user?.name
		? user.name.slice(0, 2)?.toUpperCase()
		: user?.email
			? user.email.slice(0, 2)?.toUpperCase()
			: "SL";

	const fallbackName = user?.name
		? user.name
		: user?.email
			? user.email.split("@")[0]
			: "No name available";

	const profileImage = session?.user?.image ?? undefined;

	const handleSignout = async () => {
		await authClient.signOut();
		router.replace("/authenticate");
	};

	return (
		<>
			{isPending ? (
				<div className="h-16 w-full px-5 pb-2">
					<Skeleton className="h-14 w-full" />
				</div>
			) : (
				<SidebarFooter>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-11 w-11 rounded-full">
									<AvatarImage src={profileImage} alt={fallbackShortName} />
									<AvatarFallback className="rounded-full">
										{fallbackShortName}
									</AvatarFallback>
								</Avatar>

								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{fallbackName}</span>
									<span className="truncate text-xs">{user?.email}</span>
								</div>

								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-11 w-11 rounded-full">
										<AvatarImage src={profileImage} alt={fallbackShortName} />
										<AvatarFallback className="rounded-full">
											{fallbackShortName}
										</AvatarFallback>
									</Avatar>

									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{fallbackName}
										</span>
										<span className="truncate text-xs">{user?.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<CreditCard />
									Billing
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
								>
									{theme === "dark" ? <Sun /> : <Moon />}
									{theme === "dark" ? "Light" : "Dark"}
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignout}>
								<LogOut />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarFooter>
			)}
		</>
	);
}
