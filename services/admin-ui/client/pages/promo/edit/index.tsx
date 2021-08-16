import React, { FC } from "react";

import { FormDialog } from "@gemunion/material-ui-dialog-form";
import { TextInput } from "@gemunion/material-ui-inputs-core";
import { EntityInput } from "@gemunion/material-ui-inputs-entity";
import { AvatarInput } from "@gemunion/material-ui-inputs-image-s3";
import { RichTextEditor } from "@gemunion/framework-material-ui-rte";
import { IPromo } from "@gemunion/framework-types";

import { validationSchema } from "./validation";

export interface IEditPromoDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPromo>, formikBag: any) => Promise<void>;
  initialValues: IPromo;
}

export const EditPromoDialog: FC<IEditPromoDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, productId, imageUrl } = initialValues;
  const fixedValues = { id, title, description, productId, imageUrl };

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog validationSchema={validationSchema} initialValues={fixedValues} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <EntityInput name="productId" controller="products" />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
