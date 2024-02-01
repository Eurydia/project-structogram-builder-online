// Custom hooks for exporting diagrams

import { saveAs } from "file-saver";
import {
	toJpeg,
	toPng,
	toSvg,
} from "html-to-image";

export const useExportDiagram = (
	targetElementId: string,
) => {
	const exportSVG = async () => {
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
	};

	const exportPNG = async () => {
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
	};

	const exportJPEG = async () => {
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
	};

	return {
		exportSVG,
		exportJPEG,
		exportPNG,
	};
};
