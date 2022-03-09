import { FC } from "react";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { PageHeader } from "@gemunion/mui-page-header";
import { useUser } from "@gemunion/provider-user";
import { ApiError, useApi } from "@gemunion/provider-api";
import { FormikForm } from "@gemunion/mui-form";
import { PhoneInput } from "@gemunion/mui-inputs-mask";
import { AvatarInput } from "@gemunion/mui-inputs-image-s3";
import { EnabledLanguages } from "@gemunion/framework-constants";
import { IUser } from "@gemunion/framework-types";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

import { validationSchema } from "./validation";

export const Profile: FC = () => {
  const user = useUser<IUser>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useApi();

  const onClick = (): void => {
    enqueueSnackbar("Warning! You won't be able to use this site until you confirm your new email address.", {
      variant: "info",
    });
  };

  const handleSubmit = (values: Partial<IUser>, formikBag: any): Promise<void> => {
    return api
      .fetchJson({
        url: "/profile",
        method: "PUT",
        data: values,
      })
      .then((json: IUser): void => {
        enqueueSnackbar(formatMessage({ id: "snackbar.updated" }), { variant: "success" });
        if (json) {
          user.logIn(json);
        } else {
          user.logOut();
        }
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          formikBag.setErrors(e.getLocalizedValidationErrors());
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const { id, email, firstName, lastName, phoneNumber, language, imageUrl } = user.profile;
  const fixedValues = { id, email, firstName, lastName, phoneNumber, language, imageUrl };

  return (
    <Grid>
      <Breadcrumbs path={["profile"]} />

      <PageHeader message="pages.profile.title" />

      <FormikForm initialValues={fixedValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <TextInput name="email" autoComplete="username" onClick={onClick} />
        <TextInput name="firstName" />
        <TextInput name="lastName" />
        <PhoneInput name="phoneNumber" />
        <SelectInput name="language" options={EnabledLanguages} />
        <AvatarInput name="imageUrl" />
      </FormikForm>
    </Grid>
  );
};
