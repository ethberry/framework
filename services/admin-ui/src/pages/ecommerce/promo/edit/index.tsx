import { FC } from "react";

import type { IProductPromo } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { AvatarInput } from "@ethberry/mui-inputs-image-firebase";

import { validationSchema } from "./validation";

export interface IEditPromoDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IProductPromo>, form: any) => Promise<void>;
  initialValues: IProductPromo;
}

export const EditPromoDialog: FC<IEditPromoDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, productId, imageUrl } = initialValues;
  const fixedValues = { id, title, productId, imageUrl };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog validationSchema={validationSchema} initialValues={fixedValues} message={message} {...rest}>
      <TextInput name="title" />
      <EntityInput name="productId" controller="products" />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
