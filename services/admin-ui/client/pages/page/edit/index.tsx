import React, { FC } from "react";

import { FormDialog } from "@gemunionstudio/material-ui-dialog-form";
import { SelectInput, TextInput } from "@gemunionstudio/material-ui-inputs-core";
import { RichTextEditor } from "@gemunionstudio/framework-material-ui-rte";
import { IPage, PageStatus } from "@gemunionstudio/framework-types";

import { validationSchema } from "./validation";

export interface IEditPageDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPage>, formikBag: any) => Promise<void>;
  initialValues: IPage;
}

export const EditPageDialog: FC<IEditPageDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, slug, pageStatus } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    slug,
    pageStatus,
  };

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="slug" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {id ? <SelectInput name="pageStatus" options={PageStatus} /> : null}
    </FormDialog>
  );
};
