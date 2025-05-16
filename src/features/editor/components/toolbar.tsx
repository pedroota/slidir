"use client";

import { Button } from "@/components/ui/button";
import { IText } from "fabric";
import {
	ChartColumnBig,
	HelpCircle,
	Image,
	Shapes,
	Table,
	Type,
	Video,
} from "lucide-react";
import Link from "next/link";
import { usePresentationStore } from "../store/slide-store";

export function Toolbar() {
	const { canvas } = usePresentationStore();

	const addText = () => {
		if (!canvas) return;

		const randomLeft = Math.floor(Math.random() * canvas.width - 100);
		const randomTop = Math.floor(Math.random() * canvas.height - 100);

		const text = new IText("Edit text", {
			left: randomLeft,
			top: randomTop,
			fontSize: 24,
			fill: "#000",
		});

		canvas.add(text);
		canvas.setActiveObject(text);
		canvas.renderAll();
		text.enterEditing();
		text.selectAll();
	};

	return (
		<aside className="flex h-full w-18 min-w-18 flex-col justify-between border-r">
			<div className="flex flex-1 flex-col gap-3 py-5">
				<Button
					variant="ghost"
					className="hover:!bg-transparent flex h-auto flex-col gap-2"
					onClick={addText}
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
	);
}
