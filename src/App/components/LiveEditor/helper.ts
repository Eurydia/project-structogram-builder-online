export const generateUniqueLink = (
	editorContent: string,
	locationHref: string,
) => {
	const url = new URL(locationHref);
	url.searchParams.set("preview", "true");
	url.searchParams.set("content", editorContent);
	return url.href;
};

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
