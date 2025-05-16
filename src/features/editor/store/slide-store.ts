import { createId } from "@paralleldrive/cuid2";
import type { Canvas } from "fabric";
import { create } from "zustand";

interface Slide {
	id: string;
	content: string;
}

interface PresentationStore {
	currentSlideId: string;
	canvas: Canvas | null;
	slides: Slide[];
	addNewSlide: () => void;
	setCanvas: (canvas: Canvas | null) => void;
	changeActiveSlide: (slideId: string) => void;
	updateSlide: (slideId: string, update: Partial<Slide>) => void;
	setSlides: (slides: Slide[]) => void;
}

export const usePresentationStore = create<PresentationStore>((set, get) => ({
	currentSlideId: "",
	canvas: null,
	slides: [],

	setCanvas: (canvas: Canvas | null) => set({ canvas }),

	updateSlide: (slideId, update) =>
		set((state) => ({
			slides: state.slides.map((slide) =>
				slide.id === slideId ? { ...slide, ...update } : slide,
			),
		})),

	addNewSlide: () => {
		const { slides, canvas, currentSlideId, updateSlide } = get();

		if (canvas && currentSlideId) {
			updateSlide(currentSlideId, { content: JSON.stringify(canvas.toJSON()) });
		}

		const newSlideId = createId();

		const newSlide: Slide = {
			id: newSlideId,
			content: "",
		};

		set({
			slides: [...slides, newSlide],
			currentSlideId: newSlideId,
		});

		if (canvas) {
			canvas.clear();
			canvas.renderAll();
		}
	},

	changeActiveSlide: (slideId: string) => {
		const { canvas, currentSlideId, slides, updateSlide } = get();

		if (!canvas || !currentSlideId || currentSlideId === slideId) return;

		updateSlide(currentSlideId, { content: JSON.stringify(canvas.toJSON()) });

		const targetSlide = slides.find((slide) => slide.id === slideId);

		if (targetSlide?.content) {
			try {
				canvas.loadFromJSON(JSON.parse(targetSlide.content), () => {
					canvas.renderAll();
				});
			} catch {
				canvas.clear();
				canvas.renderAll();
			}
		} else {
			canvas.clear();
			canvas.renderAll();
		}

		set({
			currentSlideId: slideId,
		});
	},

	setSlides: (slides: Slide[]) => set({ slides }),
}));
