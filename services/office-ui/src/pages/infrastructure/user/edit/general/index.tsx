import { FC } from "react";
import { Divider } from "@mui/material";
import { format, parseISO } from "date-fns";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { EnabledLanguages } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";
import { EnabledCountries, EnabledGenders } from "@gemunion/constants";
import { SelectInput, StaticInput, TextInput } from "@gemunion/mui-inputs-core";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

export interface IUserGeneralFormProps {
  open: boolean;
  createdAt: string;
}

export const UserGeneralForm: FC<IUserGeneralFormProps> = props => {
  const { createdAt, open } = props;

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const onClick = (): void => {
    enqueueSnackbar(formatMessage({ id: "form.hints.emailWarning" }), { variant: "info" });
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <TextInput name="email" autoComplete="username" onClick={onClick} />
      <TextInput name="displayName" />
      <SelectInput name="gender" options={EnabledGenders} />
      <SelectInput name="country" options={EnabledCountries} />
      <SelectInput name="language" options={EnabledLanguages} />
      <AvatarInput name="imageUrl" />
      <Divider sx={{ my: 2 }} />
      <SelectInput multiple name="userRoles" options={UserRole} />
      <SelectInput name="userStatus" options={UserStatus} />
      <TextInput name="comment" multiline />
      <StaticInput name="createdAt" value={format(parseISO(createdAt), "yyyy MMM dd hh:mm")} />
    </>
  );
};
