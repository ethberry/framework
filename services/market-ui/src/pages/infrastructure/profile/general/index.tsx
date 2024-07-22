import { FC } from "react";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { EnabledCountries, EnabledGenders } from "@gemunion/constants";
import { FormWrapper } from "@gemunion/mui-form";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { useUser } from "@gemunion/provider-user";
import { useApiCall } from "@gemunion/react-hooks";
import { useAppDispatch, settingsActions } from "@gemunion/redux";
import { EnabledLanguages } from "@framework/constants";
import type { IUser } from "@framework/types";

import { ITabPanelProps } from "../interfaces";
import { validationSchema } from "./validation";

export const ProfileGeneral: FC<ITabPanelProps> = props => {
  const { open } = props;

  const user = useUser<IUser>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { setLanguage } = settingsActions;

  const { fn } = useApiCall((_api, values: Partial<IUser>) => {
    return user.setProfile(values).then(() => {
      if (user.profile.language !== values.language) {
        dispatch(setLanguage(values.language));
      }
    });
  });

  if (!open) {
    return null;
  }

  const onClick = (): void => {
    enqueueSnackbar(formatMessage({ id: "form.hints.emailWarning" }), { variant: "info" });
  };

  const handleSubmit = async (values: Partial<IUser>, form: any): Promise<void> => {
    await fn(form, values);
  };

  const { email, displayName, language, gender, country, imageUrl } = user.profile;

  const fixedValues = {
    email,
    displayName,
    gender: gender ?? "",
    country: country ?? "",
    language,
    imageUrl,
  };

  return (
    <Grid>
      <FormWrapper initialValues={fixedValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <TextInput name="email" autoComplete="off" onClick={onClick} />
        <TextInput name="displayName" />
        <SelectInput name="gender" options={EnabledGenders} />
        <SelectInput name="country" options={EnabledCountries} />
        <SelectInput name="language" options={EnabledLanguages} />
        <AvatarInput name="imageUrl" />
      </FormWrapper>
    </Grid>
  );
};
