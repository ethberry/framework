import { FC } from "react";

import { useUser } from "@gemunion/provider-user";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import type { IMerchant, IUser } from "@framework/types";
import { MerchantStatus, RatePlanType, UserRole } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEditMerchantDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMerchant>, formikBag: any) => Promise<void>;
  initialValues: IMerchant;
}

export const EditMerchantDialog: FC<IEditMerchantDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { profile } = useUser<IUser>();

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

  const readOnly = !profile.userRoles.includes(UserRole.SUPER);

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TextInput name="email" autoComplete="username" />
      {id ? <SelectInput name="merchantStatus" options={MerchantStatus} /> : null}
      {id ? <SelectInput readOnly={readOnly} name="ratePlan" options={RatePlanType} /> : null}
      <TextInput name="wallet" />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
