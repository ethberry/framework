import { FC } from "react";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";

import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { useUser } from "@gemunion/provider-user";
import { useApiCall } from "@gemunion/react-hooks";
import { FormWrapper } from "@gemunion/mui-form";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { EnabledLanguages } from "@framework/constants";
import { IUser } from "@framework/types";

import { validationSchema } from "./validation";
import { ITabPanelProps, ProfileTabs } from "../tabs";

export const ProfileGeneral: FC<ITabPanelProps> = props => {
  const { value } = props;

  const { enqueueSnackbar } = useSnackbar();

  const user = useUser<IUser>();

  if (value !== ProfileTabs.general) {
    return null;
  }

  const { fn } = useApiCall((_api, values: Partial<IUser>) => {
    return user.setProfile(values);
  });

  const onClick = (): void => {
    enqueueSnackbar("Warning! You won't be able to use this site until you confirm your new email address.", {
      variant: "info",
    });
  };

  const handleSubmit = async (values: Partial<IUser>, form: any): Promise<void> => {
    await fn(form, values);
  };

  const { id, email, displayName, language, imageUrl } = user.profile;
  const fixedValues = { id, email, displayName, language, imageUrl };

  return (
    <Grid>
      <FormWrapper initialValues={fixedValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <TextInput name="email" autoComplete="username" onClick={onClick} />
        <TextInput name="displayName" />
        <SelectInput name="language" options={EnabledLanguages} />
        <AvatarInput name="imageUrl" />
      </FormWrapper>
    </Grid>
  );
};
