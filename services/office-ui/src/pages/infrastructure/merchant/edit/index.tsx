import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import type { IMerchant } from "@framework/types";
import { MerchantStatus } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEditMerchantDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMerchant>, formikBag: any) => Promise<void>;
  initialValues: IMerchant;
}

export const EditMerchantDialog: FC<IEditMerchantDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, email, imageUrl, merchantStatus, wallet } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    email,
    merchantStatus,
    imageUrl,
    wallet,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TextInput name="email" autoComplete="username" />
      {id ? <SelectInput name="merchantStatus" options={MerchantStatus} /> : null}
      <TextInput name="wallet" />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
