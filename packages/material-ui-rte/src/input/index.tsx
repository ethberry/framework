import React, { FC, Fragment, Ref, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { InputBaseComponentProps } from "@material-ui/core/InputBase";
import { EditorState } from "draft-js";
import { IRichTextEditorRef, RichTextEditor, TToolbarControl } from "@gemunion/mui-rte";

export interface IRichTextInputProps extends Omit<InputBaseComponentProps, "value"> {
  inputRef?: Ref<unknown>;
  doFocus?: boolean;
  onStateChange?: (state: EditorState) => void;
  controls?: Array<TToolbarControl>;
}

export const RichTextInput: FC<IRichTextInputProps> = props => {
  const { inputRef, doFocus, onStateChange, ...rest } = props;

  const acquireFocus = doFocus ?? false;

  // Setup ref for the rich text editor
  const ref = useRef<IRichTextEditorRef>(null);

  // Attempts to focus the rich text editor reference
  const focusRichText = useCallback(() => {
    ref.current?.focus();
  }, [ref]);

  // Pass on the focus event of the input ref to the rich text ref
  useImperativeHandle(inputRef, () => ({ focus: () => focusRichText }));

  // If the `acquireFocus` is changed and its value is `true`, focus the editor
  useEffect(() => {
    if (acquireFocus) {
      // focusRichText();
    }
  }, [acquireFocus, focusRichText]);

  return (
    <Fragment>
      <RichTextEditor {...rest} onChange={onStateChange} ref={ref} />
    </Fragment>
  );
};
