"use client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Point, StaticCanvas } from "fabric";
import { useEffect, useState } from "react";
import { type Slide, usePresentationStore } from "../store/slide-store";

interface SlideWithPreview extends Slide {
	previewUrl?: string;
}

/**
 * Gera previews para uma lista de slides.
 * @param slides Array de slides da store.
 * @param options Opções para a geração do preview (ex: dimensões).
 * @returns Promise que resolve para um array de slides com seus respectivos previewUrls.
 */
async function generateSlidePreviews(
	slides: Slide[],
	options?: { width?: number; height?: number },
): Promise<SlideWithPreview[]> {
	const slidesWithPreviews: SlideWithPreview[] = [];

	for (const slide of slides) {
		if (!slide.content) {
			slidesWithPreviews.push({ ...slide, previewUrl: undefined });
			continue;
		}

		const offscreenCanvasEl = document.createElement("canvas");
		const previewWidth = options?.width || 160;
		const previewHeight = options?.height || 90;

		const staticCanvas = new StaticCanvas(offscreenCanvasEl, {
			width: previewWidth,
			height: previewHeight,
			renderOnAddRemove: false,
		});

		try {
			const canvasJSON = JSON.parse(slide.content);

			await new Promise<void>((resolve, reject) => {
				staticCanvas.loadFromJSON(canvasJSON, () => {
					// renderAll() é crucial para garantir que as aCoords dos objetos sejam calculadas/atualizadas.
					staticCanvas.renderAll();

					const objects = staticCanvas.getObjects();
					if (objects.length === 0) {
						staticCanvas.renderAll(); // Garante que o canvas esteja limpo se não houver objetos
						resolve();
						return;
					}

					let minX = Number.POSITIVE_INFINITY;
					let minY = Number.POSITIVE_INFINITY;
					let maxX = Number.NEGATIVE_INFINITY;
					let maxY = Number.NEGATIVE_INFINITY;
					let hasValidCoords = false;

					for (const obj of objects) {
						if (obj.aCoords) {
							hasValidCoords = true;
							const { tl, tr, bl, br } = obj.aCoords; // Top-Left, Top-Right, Bottom-Left, Bottom-Right
							minX = Math.min(minX, tl.x, tr.x, bl.x, br.x);
							minY = Math.min(minY, tl.y, tr.y, bl.y, br.y);
							maxX = Math.max(maxX, tl.x, tr.x, bl.x, br.x);
							maxY = Math.max(maxY, tl.y, tr.y, bl.y, br.y);
						}
					}

					const contentWidth = maxX - minX;
					const contentHeight = maxY - minY;

					if (!hasValidCoords || contentWidth <= 0 || contentHeight <= 0) {
						// Não foi possível determinar os limites ou conteúdo sem dimensões
						staticCanvas.renderAll(); // Renderiza como está (provavelmente vazio ou muito pequeno)
						resolve();
						return;
					}

					if (contentWidth <= 0 || contentHeight <= 0) {
						staticCanvas.renderAll();
						resolve();
						return;
					}

					// Calcula o fator de escala para caber o conteúdo no preview
					const scaleXFactor = previewWidth / contentWidth;
					const scaleYFactor = previewHeight / contentHeight;
					// Usa a menor escala para manter a proporção e não estourar.
					// Math.min(..., 1) impede que a imagem seja ampliada além de seu tamanho original no preview.
					const scale = Math.min(scaleXFactor, scaleYFactor, 1);

					staticCanvas.setZoom(scale);

					// Calcula o pan (deslocamento da viewport) para centralizar o conteúdo.
					// Centro do conteúdo (em coordenadas originais, antes do zoom):
					const contentCenterX = minX + contentWidth / 2;
					const contentCenterY = minY + contentHeight / 2;

					// O ponto (panX, panY) será o novo canto superior esquerdo da viewport
					// nas coordenadas originais do canvas.
					// Queremos que o centro do conteúdo mapeie para o centro do canvas de preview.
					// (contentCenterX - panX) * scale = previewWidth / 2  => panX = contentCenterX - (previewWidth / (2 * scale))
					const panX = contentCenterX - previewWidth / (2 * scale);
					const panY = contentCenterY - previewHeight / (2 * scale);
					const point = new Point(panX, panY);

					staticCanvas.absolutePan(point);
					staticCanvas.renderAll(); // Renderiza final com zoom e pan aplicados
					resolve();
				});
			});

			const previewUrl = staticCanvas.toDataURL({
				format: "png",
				quality: 0.7,
				multiplier: 2,
			});
			slidesWithPreviews.push({ ...slide, previewUrl });
		} catch (error) {
			console.error(`Erro ao gerar preview para o slide ${slide.id}:`, error);
			slidesWithPreviews.push({ ...slide, previewUrl: undefined });
		} finally {
			staticCanvas.dispose();
		}
	}
	return slidesWithPreviews;
}

export function SlideList() {
	const slides = usePresentationStore((state) => state.slides);
	const changeActiveSlide = usePresentationStore(
		(state) => state.changeActiveSlide,
	);
	const currentSlideId = usePresentationStore((state) => state.currentSlideId);
	const addNewSlide = usePresentationStore((state) => state.addNewSlide);
	const [slidesWithPreviews, setSlidesWithPreviews] = useState<
		SlideWithPreview[]
	>([]);
	const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);

	useEffect(() => {
		const generatePreviews = async () => {
			if (!slides.length) {
				setSlidesWithPreviews([]);
				return;
			}

			setIsLoadingPreviews(true);
			try {
				// Defina dimensões desejadas para os previews
				const previews = await generateSlidePreviews(slides, {
					width: 160,
					height: 90,
				});
				setSlidesWithPreviews(previews);
			} catch (error) {
				console.error("Falha ao gerar previews:", error);
				// Opcionalmente, defina um estado de erro
			} finally {
				setIsLoadingPreviews(false);
			}
		};
		generatePreviews();
	}, [slides]); // Regenera os previews se os slides da store mudarem

	if (isLoadingPreviews) {
		return <p>Gerando previews...</p>;
	}

	console.log(slides);

	return (
		<div>
			<Button
				onClick={() => addNewSlide()}
				variant="outline"
				className="w-full"
			>
				<Plus size={16} />
				Add slide
			</Button>

			<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
				{slidesWithPreviews.map((slide) => (
					<div
						key={slide.id}
						onClick={() => changeActiveSlide(slide.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								changeActiveSlide(slide.id);
							}
						}}
					>
						{slide.previewUrl ? (
							<img
								src={slide.previewUrl}
								alt={`Preview do Slide ${slide.id}`}
								style={{ width: "160px", height: "90px", objectFit: "contain" }}
							/>
						) : (
							<div
								style={{
									width: "160px",
									height: "90px",
									backgroundColor: "#f0f0f0",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<span>Sem preview</span>
							</div>
						)}
						<p style={{ margin: "5px 0 0", fontSize: "12px" }}>
							Slide ID: {slide.id.substring(0, 6)}...
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
