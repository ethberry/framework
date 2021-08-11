import React, {FC} from "react";

import {FormDialog} from "@gemunionstudio/material-ui-dialog-form";
import {TextInput} from "@gemunionstudio/material-ui-inputs-core";
import {EntityInput} from "@gemunionstudio/material-ui-inputs-entity";
import {AvatarInput} from "@gemunionstudio/material-ui-inputs-image-s3";
import {RichTextEditor} from "@gemunionstudio/solo-material-ui-rte";
import {IPromo} from "@gemunionstudio/solo-types";

import {validationSchema} from "./validation";

export interface IEditPromoDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPromo>, formikBag: any) => Promise<void>;
  initialValues: IPromo;
}

export const EditPromoDialog: FC<IEditPromoDialogProps> = props => {
  const {initialValues, ...rest} = props;

  const {id, title, description, productId, imageUrl} = initialValues;
  const fixedValues = {id, title, description, productId, imageUrl};

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
