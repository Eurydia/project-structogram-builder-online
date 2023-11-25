import { FC } from "react";

import ReactCodeMirror from "@uiw/react-codemirror";

type StructogramEditorProps = {
	content: string;
	onContentChange: (content: string) => void;
};
export const StructogramEditor: FC<
	StructogramEditorProps
> = (props) => {
	const { content, onContentChange } = props;

	return (
		<ReactCodeMirror
			value={content}
			onChange={onContentChange}
			theme="light"
			placeholder="for ( i = 1..3 ) {	x := x + 1; }"
		/>
	);
};
