/**
 * This module provides helper functions for the "LiveEditor" component.
 */
// ---------------------------------------------

/**
 * The "generateUniqueLink" function generates a unique link based the current editor content and the current location href.
 */
export const generateUniqueLink = (
	editorContent: string,
	locationHref: string,
) => {
	const url = new URL(locationHref);
	url.searchParams.set("preview", "true");
	url.searchParams.set("content", editorContent);
	return url.href;
};

/**
 * The "getPreviewState" function returns a boolean indicating whether the current location href is in preview mode.
 */
export const getPreviewState = (
	locationHref: string,
): boolean => {
	const url = new URL(locationHref);
	const previewParam =
		url.searchParams.get("preview");
	return (
		previewParam !== null &&
		previewParam === "true"
	);
};
