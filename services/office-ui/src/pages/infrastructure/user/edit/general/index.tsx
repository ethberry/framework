import { FC } from "react";
import { format, parseISO } from "date-fns";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { SelectInput, StaticInput, TextInput } from "@gemunion/mui-inputs-core";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { EnabledCountries, EnabledGenders } from "@gemunion/constants";
import { EnabledLanguages } from "@framework/constants";
import { UserRole, UserStatus } from "@framework/types";

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

  const disabledRoles = [UserRole.SUPER];

  return (
    <>
      <TextInput name="email" autoComplete="off" onClick={onClick} />
      <TextInput name="displayName" />
      <SelectInput name="gender" options={EnabledGenders} />
      <SelectInput name="country" options={EnabledCountries} />
      <SelectInput name="language" options={EnabledLanguages} />
      <AvatarInput name="imageUrl" />
      <SelectInput multiple name="userRoles" options={UserRole} disabledOptions={disabledRoles} />
      <SelectInput name="userStatus" options={UserStatus} />
      <TextInput name="comment" multiline />
      <StaticInput name="createdAt" value={format(parseISO(createdAt), "yyyy MMM dd hh:mm")} />
    </>
  );
};
