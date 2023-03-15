import { FC } from "react";

import { EnabledLanguages } from "@framework/constants";
import { IUser } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";

import { AddressInput } from "./address-input";
import { validationSchema } from "./validation";

export interface IAddUserDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (item: IUser, form: any) => Promise<void>;
  initialValues: IUser;
}

export const AddUserDialog: FC<IAddUserDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, email, displayName, language, comment, addresses } = initialValues;
  const fixedValues = { id, email, displayName, language, comment, addresses };

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message="dialogs.add" {...rest}>
      <TextInput name="email" autoComplete="username" />
      <TextInput name="displayName" />
      <SelectInput name="language" options={EnabledLanguages} />
      <TextInput name="comment" multiline />
      <AddressInput name="addresses" />
    </FormDialog>
  );
};
