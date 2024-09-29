import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { AvatarInput } from "@ethberry/mui-inputs-image-firebase";
import type { IMerchant } from "@framework/types";
import { MerchantStatus, RatePlanType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEditMerchantDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMerchant>, formikBag: any) => Promise<void>;
  initialValues: IMerchant;
}

export const EditMerchantDialog: FC<IEditMerchantDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, email, imageUrl, merchantStatus, wallet, ratePlan } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    email,
    merchantStatus,
    ratePlan,
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
      {id ? <SelectInput name="ratePlan" options={RatePlanType} /> : null}
      <TextInput name="wallet" />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
