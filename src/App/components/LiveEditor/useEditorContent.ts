/**
 * This module implements a custom hook for controlling editor content
 */
// ---------------------------------------------

import { useState } from "react";

/**
 * The "useEditorContent" hook provides functions for controlling the editor content.
 * It initializes and manages the state of the editor content and saves it to local storage.
 *
 * Based on the the given URL, the hook checks if the "content" parameter is present.
 * If it is, the hook sets the editor content to the value of the "content" parameter and sync local storage to the new content.
 * If the "content" parameter is not present, the hook checks if there is a saved content in local storage.
 * If there is, the hook sets the editor content to the saved content.
 *
 * As such, content from the URL takes precedence over content from local storage.
 */
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
				try {
					return JSON.parse(savedContent);
				} catch {
					return savedContent;
				}
			}
			return "Hello World;";
		});

	const setEditorContent = (content: string) => {
		setEditorContentInner(content);
		window.localStorage.setItem(
			localStorageKey,
			JSON.stringify(content),
		);
	};

	return { editorContent, setEditorContent };
};
