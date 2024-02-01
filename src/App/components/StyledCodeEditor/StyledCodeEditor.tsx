import { FC } from "react";

import ReactCodeMirror, {
	EditorView,
} from "@uiw/react-codemirror";

import "./styles.css";

type StyledCodeEditorProps = {
	value: string;
	onValueChange: (value: string) => void;
};
export const StyledCodeEditor: FC<
	StyledCodeEditorProps
> = (props) => {
	const { value, onValueChange } = props;

	return (
		<ReactCodeMirror
			value={value}
			onChange={onValueChange}
			theme="dark"
			extensions={[EditorView.lineWrapping]}
		/>
	);
};
