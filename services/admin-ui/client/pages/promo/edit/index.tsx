import React, {FC} from "react";

import {FormDialog} from "@trejgun/material-ui-dialog-form";
import {TextInput} from "@trejgun/material-ui-inputs-core";
import {EntityInput} from "@trejgun/material-ui-inputs-entity";
import {AvatarInput} from "@trejgun/material-ui-inputs-image-s3";
import {IPromo} from "@trejgun/solo-types";

import {validationSchema} from "./validation";

export interface IEditPromoDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPromo>, formikBag: any) => Promise<void>;
  initialValues: IPromo;
}

export const EditPromoDialog: FC<IEditPromoDialogProps> = props => {
  const {initialValues, ...rest} = props;

  const {id, title, productId, imageUrl} = initialValues;
  const fixedValues = {id, title, productId, imageUrl};

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog validationSchema={validationSchema} initialValues={fixedValues} message={message} {...rest}>
      <TextInput name="title" />
      <EntityInput name="productId" controller="products" />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
