import { FC } from "react";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";

import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { useApiCall } from "@gemunion/react-hooks";
import { FormWrapper } from "@gemunion/mui-form";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { availableChains, EnabledLanguages } from "@framework/constants";
import { IUser } from "@framework/types";

import { validationSchema } from "./validation";

export const Profile: FC = () => {
  const user = useUser<IUser>();
  const { enqueueSnackbar } = useSnackbar();

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

  const { email, displayName, language, imageUrl, chainId } = user.profile;
  const fixedValues = { email, displayName, language, imageUrl, chainId };

  return (
    <Grid>
      <Breadcrumbs path={["profile"]} />

      <PageHeader message="pages.profile.title" />

      <FormWrapper
        initialValues={fixedValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        testId="Profile"
      >
        <TextInput name="email" autoComplete="username" onClick={onClick} />
        <TextInput name="displayName" />
        <SelectInput name="language" options={EnabledLanguages} />
        <AvatarInput name="imageUrl" />
        <SelectInput
          name="chainId"
          options={availableChains.reduce((memo, current) => Object.assign(memo, { [current]: current }), {})}
        />
      </FormWrapper>
    </Grid>
  );
};
