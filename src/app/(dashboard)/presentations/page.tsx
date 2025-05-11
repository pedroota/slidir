import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default function Presentations() {
	const data = [];

	return (
		<section>
			<header className="flex items-center justify-between p-4">
				<div className="flex items-center gap-2">
					<SidebarTrigger />

					<div className="relative">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
						<Input
							placeholder="Search presentation by title"
							className="h-11 min-w-72 pl-10"
						/>
					</div>
				</div>

				<Link href="/editor" className={buttonVariants()}>
					<Plus />
					New presentation
				</Link>
			</header>

			{data?.length ? null : (
				<div className="mx-auto mt-24 flex h-full max-w-96 flex-col items-center justify-center gap-2 text-center">
					<span className="font-bold text-muted-foreground">
						You don't have any presentations yet.
					</span>

					<span className="text-muted-foreground text-sm">
						To create your first AI presentation is pretty simple,{" "}
						<span className="font-bold underline">
							just click the button on the top right corner
						</span>
					</span>
				</div>
			)}
		</section>
	);
}
