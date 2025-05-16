import { Canvas } from "@/features/editor/components/canvas";
import { Header } from "@/features/editor/components/header";
import { SlideList } from "@/features/editor/components/slide-list";
import { Toolbar } from "@/features/editor/components/toolbar";

export default function Editor() {
	return (
		<section className="flex h-full flex-col">
			<Header />

			<div className="flex flex-1">
				<Toolbar />

				<Canvas />

				<SlideList />
			</div>
		</section>
	);
}
