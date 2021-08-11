import React, {FC} from "react";
import {format, parseISO} from "date-fns";
import {Divider} from "@material-ui/core";
import {useSnackbar} from "notistack";

import {SelectInput, StaticInput, TextInput} from "@gemunionstudio/material-ui-inputs-core";
import {FormDialog} from "@gemunionstudio/material-ui-dialog-form";
import {EnabledLanguages} from "@gemunionstudio/solo-constants-misc";
import {IUser, UserRole, UserStatus} from "@gemunionstudio/solo-types";
import {PhoneInput} from "@gemunionstudio/material-ui-inputs-mask";
import {AvatarInput} from "@gemunionstudio/material-ui-inputs-image-s3";

import {validationSchema} from "./validation";

export interface IEditUserDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUser>, formikBag: any) => Promise<void>;
  initialValues: IUser;
}

export const EditUserDialog: FC<IEditUserDialogProps> = props => {
  const {initialValues, ...rest} = props;

  const {enqueueSnackbar} = useSnackbar();

  const onClick = (): void => {
    enqueueSnackbar("Warning! This user won't be able to use this site until he confirms his new email address.", {
      variant: "info",
    });
  };

  const {id, email, firstName, lastName, phoneNumber, language, imageUrl, userRoles, userStatus, comment, createdAt} =
    initialValues;

  const fixedValues = {
    id,
    email,
    firstName,
    lastName,
    phoneNumber,
    language,
    imageUrl,
    userRoles,
    userStatus,
    comment,
  };

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message="dialogs.edit" {...rest}>
      <TextInput name="email" autoComplete="username" onClick={onClick} />
      <TextInput name="firstName" />
      <TextInput name="lastName" />
      <PhoneInput name="phoneNumber" />
      <SelectInput name="language" options={EnabledLanguages} />
      <AvatarInput name="imageUrl" />
      <br />
      <br />
      <Divider />
      <br />
      <SelectInput multiple name="userRoles" options={UserRole} />
      <SelectInput name="userStatus" options={UserStatus} />
      <TextInput name="comment" multiline />
      <StaticInput name="createdAt" value={format(parseISO(createdAt), "yyyy MMM dd hh:mm")} />
    </FormDialog>
  );
};
