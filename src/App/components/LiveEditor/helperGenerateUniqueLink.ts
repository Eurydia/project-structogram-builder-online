// Custom hook for building dynamic link for a diagram

export const generateUniqueLink = (
	editorContent: string,
) => {
	const url = new URL(window.location.href);
	url.searchParams.set("preview", "true");
	url.searchParams.set("content", editorContent);
	return url.href;
};
