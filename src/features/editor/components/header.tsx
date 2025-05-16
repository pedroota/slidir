import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, Share2 } from "lucide-react";
import Link from "next/link";

export function Header() {
	return (
		<header className="flex h-16 w-full items-center justify-between border-b">
			<div className="flex items-center gap-5">
				<div className="flex h-16 w-18 items-center justify-center border-r">
					<Link href="/presentations" className="rounded-full">
						<ChevronLeft size={24} />
					</Link>
				</div>

				<div className="flex flex-col gap-0.5">
					<p>New Pitch Deck For Sales</p>
					<span className="text-muted-foreground text-sm">Workspace</span>
				</div>
			</div>

			<div className="flex items-center gap-2 pr-5">
				<Button variant="secondary" className="min-w-26">
					<span>Share</span>
					<Share2 />
				</Button>

				<Button className="min-w-26">
					<span>Present</span>
					<Play />
				</Button>
			</div>
		</header>
	);
}
