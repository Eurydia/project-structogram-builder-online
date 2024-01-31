// Custom hooks for exporting diagrams

import { useCallback } from "react";
import { saveAs } from "file-saver";
import {
	toJpeg,
	toPng,
	toSvg,
} from "html-to-image";

export const useExportDiagram = (
	targetElementId: string,
) => {
	const exportSVG = useCallback(async () => {
		const HTMLNode = document.getElementById(
			targetElementId,
		);
		if (HTMLNode === null) {
			return false;
		}
		return toSvg(HTMLNode).then((blob) => {
			if (blob === null) {
				return false;
			}
			saveAs(blob, "structogram");
			return true;
		});
	}, [targetElementId]);

	const exportPNG = useCallback(async () => {
		const HTMLNode = document.getElementById(
			targetElementId,
		);
		if (HTMLNode === null) {
			return false;
		}
		return toPng(HTMLNode).then((blob) => {
			if (blob === null) {
				return false;
			}
			saveAs(blob, "structogram");
			return true;
		});
	}, [targetElementId]);

	const exportJPEG = useCallback(async () => {
		const HTMLNode = document.getElementById(
			targetElementId,
		);
		if (HTMLNode === null) {
			return false;
		}
		return toJpeg(HTMLNode).then((blob) => {
			if (blob === null) {
				return false;
			}
			saveAs(blob, "structogram");
			return true;
		});
	}, [targetElementId]);

	return {
		exportSVG,
		exportJPEG,
		exportPNG,
	};
};
