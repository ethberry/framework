import React, {FC} from "react";
import {Editor, EditorState, convertFromRaw, ContentBlock} from "draft-js";
import {TCustomControl, atomicBlockExists} from "@trejgun/mui-rte";

export interface IRichTextDisplayProps {
  data: any;
}

const customControls: Array<TCustomControl> = [];

export const RichTextDisplay: FC<IRichTextDisplayProps> = props => {
  const {data} = props;

  const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(data)));

  const handleChange = () => {};

  const blockRenderer = (contentBlock: ContentBlock) => {
    const blockType = contentBlock.getType();
    if (blockType === "atomic") {
      const contentState = editorState.getCurrentContent();
      const entity = contentBlock.getEntityAt(0);
      if (entity) {
        const type = contentState.getEntity(entity).getType();
        const block = atomicBlockExists(type.toLowerCase(), customControls);
        if (block) {
          return {
            component: block.atomicComponent,
            editable: false,
            props: contentState.getEntity(contentBlock.getEntityAt(0)).getData(),
          };
        }
      }
    }
    return null;
  };

  return <Editor blockRendererFn={blockRenderer} editorState={editorState} readOnly={true} onChange={handleChange} />;
};
