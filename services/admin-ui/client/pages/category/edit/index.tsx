import React, { FC } from "react";

import { EntityInput } from "@gemunionstudio/material-ui-inputs-entity";
import { FormDialog } from "@gemunionstudio/material-ui-dialog-form";
import { TextInput } from "@gemunionstudio/material-ui-inputs-core";
import { RichTextEditor } from "@gemunionstudio/framework-material-ui-rte";
import { ICategory } from "@gemunionstudio/framework-types";

import { validationSchema } from "./validation";

export interface IEditCategoryDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ICategory>, formikBag: any) => Promise<void>;
  initialValues: ICategory;
}

export const EditCategoryDialog: FC<IEditCategoryDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, parentId } = initialValues;
  const fixedValues = { id, title, description, parentId };

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <EntityInput name="parentId" controller="categories" />
    </FormDialog>
  );
};
