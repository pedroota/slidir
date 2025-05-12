"use client";

import { Canvas as FabricCanvas } from "fabric";
import { useEffect, useRef } from "react";

export function Canvas() {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current || !containerRef.current) {
			return;
		}

		const canvas = new FabricCanvas(canvasRef.current, {
			backgroundColor: "white",
		});

		const resizeCanvas = () => {
			if (!canvasRef.current || !containerRef.current || !canvas) {
				return;
			}

			const containerWidth = containerRef.current.offsetWidth;
			const width = containerWidth;
			const height = (containerWidth * 9) / 16;

			canvasRef.current.width = width;
			canvasRef.current.height = height;

			canvas.setDimensions({ height, width });
		};

		resizeCanvas();

		return () => {
			canvas.dispose();
		};
	}, []);

	return (
		<div ref={containerRef} className="flex flex-1 justify-center p-6">
			<canvas ref={canvasRef} className="block" />
		</div>
	);
}
