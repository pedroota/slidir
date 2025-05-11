import { Button } from "@/components/ui/button";
import {
	ChartColumnBig,
	ChevronLeft,
	HelpCircle,
	Image,
	Play,
	Shapes,
	Share2,
	Table,
	Type,
	Video,
} from "lucide-react";
import Link from "next/link";

export default function Editor() {
	return (
		<section className="flex h-full flex-col">
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

			<div className="flex flex-1">
				<aside className="flex h-full w-18 flex-col justify-between border-r">
					<div className="flex flex-1 flex-col gap-3 py-5">
						<Button
							variant="ghost"
							className="hover:!bg-transparent flex h-auto flex-col gap-2"
						>
							<Type className="size-4" />
							<span className="text-xs">Text</span>
						</Button>

						<Button
							variant="ghost"
							className="hover:!bg-transparent flex h-auto flex-col gap-2"
						>
							<Image className="size-4" />
							<span className="text-xs">Image</span>
						</Button>

						<Button
							variant="ghost"
							className="hover:!bg-transparent flex h-auto flex-col gap-2"
						>
							<Video className="size-4" />
							<span className="text-xs">Video</span>
						</Button>

						<Button
							variant="ghost"
							className="hover:!bg-transparent flex h-auto flex-col gap-2"
						>
							<Shapes className="size-4" />
							<span className="text-xs">Shapes</span>
						</Button>

						<Button
							variant="ghost"
							className="hover:!bg-transparent flex h-auto flex-col gap-2"
						>
							<ChartColumnBig className="size-4" />
							<span className="text-xs">Charts</span>
						</Button>

						<Button
							variant="ghost"
							className="hover:!bg-transparent flex h-auto flex-col gap-2"
						>
							<Table className="size-4" />
							<span className="text-xs">Tables</span>
						</Button>
					</div>

					<div className="flex h-16 items-center justify-center border-t">
						<Link href="/presentations" className="rounded-full">
							<HelpCircle size={24} />
						</Link>
					</div>
				</aside>

				<div className="flex-1">container</div>

				<aside className="min-w-64 border-l">aside</aside>
			</div>
		</section>
	);
}
