"use client";

import { Canvas as FabricCanvas } from "fabric";
import { useEffect, useRef, useState } from "react";
import { usePresentationStore } from "../store/slide-store";

export function Canvas() {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fabricRef = useRef<FabricCanvas>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	const { setCanvas } = usePresentationStore();

	useEffect(() => {
		const canvasElement = canvasRef.current;
		const containerElement = containerRef.current;

		if (!canvasElement || !containerElement) return;

		const canvas = new FabricCanvas(canvasElement, {
			backgroundColor: "white",
			controlsAboveOverlay: true,
			preserveObjectStacking: true,
		});

		fabricRef.current = canvas;
		setCanvas(canvas);

		const resizeCanvas = () => {
			if (!containerRef.current || !canvasRef.current) return;

			const container = containerRef.current;
			const styles = getComputedStyle(container);

			const paddingX =
				Number.parseFloat(styles.paddingLeft) +
				Number.parseFloat(styles.paddingRight);
			const paddingY =
				Number.parseFloat(styles.paddingTop) +
				Number.parseFloat(styles.paddingBottom);

			const maxWidth = container.clientWidth - paddingX;
			const maxHeight = container.clientHeight - paddingY;

			let width = maxWidth * 0.85;
			let height = (width * 9) / 16;

			if (height > maxHeight) {
				height = maxHeight;
				width = (height * 16) / 9;
			}

			setSize({ width, height });
			canvas.setDimensions({ width, height });
			canvas.calcOffset();
			canvas.renderAll();
		};

		resizeCanvas();

		window.addEventListener("resize", resizeCanvas);
		const observer = new ResizeObserver(resizeCanvas);
		observer.observe(containerElement);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			observer.disconnect();
			setCanvas(null);
			fabricRef.current?.dispose();
			fabricRef.current = null;
		};
	}, [setCanvas]);

	return (
		<div
			ref={containerRef}
			className="flex h-full w-full flex-1 justify-center overflow-auto bg-gray-400 p-6"
		>
			<canvas
				ref={canvasRef}
				width={size.width}
				height={size.height}
				className="block max-h-full max-w-full border"
				style={{
					width: `${size.width}px`,
					height: `${size.height}px`,
				}}
			/>
		</div>
	);
}
