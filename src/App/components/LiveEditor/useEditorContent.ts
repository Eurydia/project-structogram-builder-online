// Custom hook for editor content

import { useState } from "react";

export const useEditorContent = (
	hrefURL: string,
	localStorageKey: string,
) => {
	const [editorContent, setEditorContentInner] =
		useState(() => {
			const url = new URL(hrefURL);

			const content =
				url.searchParams.get("content");
			if (content !== null) {
				window.localStorage.setItem(
					localStorageKey,
					content,
				);
				return content;
			}

			const savedContent =
				window.localStorage.getItem(
					localStorageKey,
				);
			if (savedContent !== null) {
				return savedContent;
			}
			return "";
		});

	const setEditorContent = (content: string) => {
		setEditorContentInner(content);
		window.localStorage.setItem(
			localStorageKey,
			content,
		);
	};

	return { editorContent, setEditorContent };
};
