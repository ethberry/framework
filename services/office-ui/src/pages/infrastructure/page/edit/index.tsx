import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import type { IPage } from "@framework/types";
import { PageStatus } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEditPageDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<IPage>, formikBag: any) => Promise<void>;
  initialValues: IPage;
}

export const PageEditDialog: FC<IEditPageDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, slug, pageStatus } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    slug,
    pageStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PageEditForm"
      {...rest}
    >
      <TextInput name="slug" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {id ? <SelectInput name="pageStatus" options={PageStatus} /> : null}
    </FormDialog>
  );
};
