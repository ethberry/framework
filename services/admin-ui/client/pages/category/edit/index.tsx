import React, { FC } from "react";

import { EntityInput } from "@gemunion/material-ui-inputs-entity";
import { FormDialog } from "@gemunion/material-ui-dialog-form";
import { TextInput } from "@gemunion/material-ui-inputs-core";
import { RichTextEditor } from "@gemunion/framework-material-ui-rte";
import { ICategory } from "@gemunion/framework-types";

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
