import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import type { ISearchable } from "@gemunion/types-collection";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";

import { validationSchema } from "./validation";

export interface IWaitListListEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ISearchable, form: any) => Promise<void>;
  initialValues: ISearchable;
  message: string;
  testId: string;
}

export const WaitListListEditDialog: FC<IWaitListListEditDialogProps> = props => {
  const { initialValues, message, ...rest } = props;

  const { id, title, description, item } = initialValues;
  const fixedValues = { id, title, description, item };

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TemplateAssetInput autoSelect multiple prefix="item" />
    </FormDialog>
  );
};
