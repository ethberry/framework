import React, {FC} from "react";

import {EntityInput} from "@trejgun/material-ui-inputs-entity";
import {FormDialog} from "@trejgun/material-ui-dialog-form";
import {TextInput} from "@trejgun/material-ui-inputs-core";
import {ICategory} from "@trejgun/solo-types";

import {validationSchema} from "./validation";

export interface IEditCategoryDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ICategory>, formikBag: any) => Promise<void>;
  initialValues: ICategory;
}

export const EditCategoryDialog: FC<IEditCategoryDialogProps> = props => {
  const {initialValues, ...rest} = props;

  const {id, title, description, parentId} = initialValues;
  const fixedValues = {id, title, description, parentId};

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <TextInput name="description" multiline />
      <EntityInput name="parentId" controller="categories" />
    </FormDialog>
  );
};
