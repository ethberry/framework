import React, {FC, Fragment, Ref, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {InputBaseComponentProps} from "@material-ui/core/InputBase";
import {EditorState} from "draft-js";
import {IRichTextEditorRef, RichTextEditor, TToolbarControl} from "@paktolus/mui-rte";

import {Image} from "@material-ui/icons";

import {ImageUploadPopover} from "../image-upload/popover";
import {ImageUpload} from "../image-upload";

export interface IRichTextInputProps extends Omit<InputBaseComponentProps, "value"> {
  inputRef?: Ref<unknown>;
  doFocus?: boolean;
  onStateChange?: (state: EditorState) => void;
  controls?: Array<TToolbarControl>;
}

export const RichTextInput: FC<IRichTextInputProps> = props => {
  const {inputRef, doFocus, onStateChange, controls = [], ...rest} = props;

  const [anchor2, setAnchor2] = useState<HTMLElement | null>(null);

  const acquireFocus = doFocus ?? false;

  // Setup ref for the rich text editor
  const ref = useRef<IRichTextEditorRef>(null);

  // Attempts to focus the rich text editor reference
  const focusRichText = useCallback(() => {
    ref.current?.focus();
  }, [ref]);

  // Pass on the focus event of the input ref to the rich text ref
  useImperativeHandle(inputRef, () => ({focus: () => focusRichText}));

  // If the `acquireFocus` is changed and its value is `true`, focus the editor
  useEffect(() => {
    if (acquireFocus) {
      // focusRichText();
    }
  }, [acquireFocus, focusRichText]);

  return (
    <Fragment>
      <ImageUploadPopover
        anchor={anchor2}
        onSubmit={(data, insert) => {
          if (insert) {
            ref.current?.insertAtomicBlockSync("my-image", data);
          }
          setAnchor2(null);
        }}
      />
      <RichTextEditor
        {...rest}
        onChange={onStateChange}
        ref={ref}
        controls={controls.concat(["add-card", "image-upload", "protected-resource"])}
        customControls={[
          {
            name: "my-image",
            type: "atomic",
            atomicComponent: ImageUpload,
          },
          {
            name: "image-upload",
            icon: <Image />,
            type: "callback",
            onClick: (_editorState, _name, anchor) => {
              setAnchor2(anchor);
            },
          },
        ]}
      />
    </Fragment>
  );
};
