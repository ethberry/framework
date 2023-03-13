import { FC } from "react";

import { IPromo } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";

export interface IEditPromoDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPromo>, form: any) => Promise<void>;
  initialValues: IPromo;
}

export const EditPromoDialog: FC<IEditPromoDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, productId, imageUrl } = initialValues;
  const fixedValues = { id, title, productId, imageUrl };

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog validationSchema={validationSchema} initialValues={fixedValues} message={message} {...rest}>
      <TextInput name="title" />
      <EntityInput name="productId" controller="products" />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
