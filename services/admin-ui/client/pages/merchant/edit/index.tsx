import React, {FC} from "react";

import {EntityInput} from "@gemunionstudio/material-ui-inputs-entity";
import {FormDialog} from "@gemunionstudio/material-ui-dialog-form";
import {SelectInput, TextInput} from "@gemunionstudio/material-ui-inputs-core";
import {RichTextEditor} from "@gemunionstudio/solo-material-ui-rte";
import {AvatarInput} from "@gemunionstudio/material-ui-inputs-image-s3";
import {PhoneInput} from "@gemunionstudio/material-ui-inputs-mask";
import {IMerchant, IUser, MerchantStatus} from "@gemunionstudio/solo-types";

import {validationSchema} from "./validation";

export interface IEditMerchantDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMerchant>, formikBag: any) => Promise<void>;
  initialValues: IMerchant;
}

export const EditMerchantDialog: FC<IEditMerchantDialogProps> = props => {
  const {initialValues, ...rest} = props;

  const {id, title, description, email, phoneNumber, imageUrl, merchantStatus, users = []} = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    email,
    phoneNumber,
    merchantStatus,
    imageUrl,
    userIds: users.map(user => user.id),
  };

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TextInput name="email" autoComplete="username" />
      <PhoneInput name="phoneNumber" />
      <EntityInput
        name="userIds"
        controller="users"
        multiple
        getTitle={(option: IUser) => `${option.firstName} ${option.lastName}`}
      />
      {id ? <SelectInput name="merchantStatus" options={MerchantStatus} /> : null}
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
