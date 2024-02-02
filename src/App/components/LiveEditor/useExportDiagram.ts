/**
 * This module implements a custom hook for exporting diagrams
 */

import { saveAs } from "file-saver";
import {
	toJpeg,
	toPng,
	toSvg,
} from "html-to-image";

/**
 * The "useExportDiagram" hook provides functions for exporting diagrams as SVG, PNG, and JPEG files based from an element with a given id.
 *
 * The process of exporting diagrams is done by converting the HTML element to a blob using functions provided by the "html-to-image" library.
 * The blob is then saved as a file using the "file-saver" library.
 */
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
