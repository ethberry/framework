import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import type { ISearchable } from "@gemunion/types-collection";

import { validationSchema } from "./validation";

export interface IWaitlistListEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ISearchable, form: any) => Promise<void>;
  initialValues: ISearchable;
  message: string;
  testId: string;
}

export const WaitlistListEditDialog: FC<IWaitlistListEditDialogProps> = props => {
  const { initialValues, message, ...rest } = props;

  const { id, title, description } = initialValues;
  const fixedValues = { id, title, description };

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
    </FormDialog>
  );
};
