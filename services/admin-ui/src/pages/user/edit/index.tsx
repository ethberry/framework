import { FC } from "react";
import { format, parseISO } from "date-fns";
import { Divider } from "@mui/material";
import { useSnackbar } from "notistack";

import { SelectInput, StaticInput, TextInput } from "@gemunion/mui-inputs-core";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { EnabledLanguages } from "@framework/constants";
import { IUser, UserRole, UserStatus } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";

export interface IUserEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUser>, form: any) => Promise<void>;
  initialValues: IUser;
}

export const UserEditDialog: FC<IUserEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { enqueueSnackbar } = useSnackbar();

  const onClick = (): void => {
    enqueueSnackbar("Warning! This user won't be able to use this site until he confirms his new email address.", {
      variant: "info",
    });
  };

  const { id, email, displayName, language, imageUrl, userRoles, userStatus, comment, createdAt } = initialValues;

  const fixedValues = {
    id,
    email,
    displayName,
    language,
    imageUrl,
    userRoles,
    userStatus,
    comment,
  };

  const testIdPrefix = "UserEditForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      testId={testIdPrefix}
      {...rest}
    >
      <TextInput name="email" autoComplete="username" onClick={onClick} />
      <TextInput name="displayName" />
      <SelectInput name="language" options={EnabledLanguages} />
      <AvatarInput name="imageUrl" />
      <br />
      <br />
      <Divider />
      <br />
      <SelectInput multiple name="userRoles" options={UserRole} />
      <SelectInput name="userStatus" options={UserStatus} />
      <TextInput name="comment" multiline />
      <StaticInput
        name="createdAt"
        value={format(parseISO(createdAt), "yyyy MMM dd hh:mm")}
      />
    </FormDialog>
  );
};
