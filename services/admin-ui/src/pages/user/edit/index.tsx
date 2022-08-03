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
      data-testid={testIdPrefix}
      {...rest}
    >
      <TextInput name="email" autoComplete="username" onClick={onClick} data-testid={`${testIdPrefix}-email`} />
      <TextInput name="displayName" data-testid={`${testIdPrefix}-displayName`} />
      <SelectInput name="language" options={EnabledLanguages} data-testid={`${testIdPrefix}-language`} />
      <AvatarInput name="imageUrl" data-testid={`${testIdPrefix}-imageUrl`} />
      <br />
      <br />
      <Divider />
      <br />
      <SelectInput multiple name="userRoles" options={UserRole} data-testid={`${testIdPrefix}-userRoles`} />
      <SelectInput name="userStatus" options={UserStatus} data-testid={`${testIdPrefix}-userStatus`} />
      <TextInput name="comment" multiline data-testid={`${testIdPrefix}-comment`} />
      <StaticInput
        name="createdAt"
        value={format(parseISO(createdAt), "yyyy MMM dd hh:mm")}
        data-testid={`${testIdPrefix}-createdAt`}
      />
    </FormDialog>
  );
};
