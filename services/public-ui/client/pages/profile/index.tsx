import React, {FC, useContext} from "react";
import {Grid} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {useIntl} from "react-intl";

import {SelectInput, TextInput} from "@gemunionstudio/material-ui-inputs-core";
import {PageHeader} from "@gemunionstudio/material-ui-page-header";
import {UserContext, IUserContext} from "@gemunionstudio/provider-user";
import {ApiContext, ApiError} from "@gemunionstudio/provider-api";
import {FormikForm} from "@gemunionstudio/material-ui-form";
import {PhoneInput} from "@gemunionstudio/material-ui-inputs-mask";
import {AvatarInput} from "@gemunionstudio/material-ui-inputs-image-s3";
import {EnabledLanguages} from "@gemunionstudio/framework-constants-misc";
import {IUser} from "@gemunionstudio/framework-types";

import {validationSchema} from "./validation";
import {Breadcrumbs} from "../../components/common/breadcrumbs";

export const Profile: FC = () => {
  const user = useContext<IUserContext<IUser>>(UserContext);
  const {enqueueSnackbar} = useSnackbar();
  const {formatMessage} = useIntl();

  const api = useContext(ApiContext);

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
      .then((json): void => {
        enqueueSnackbar(formatMessage({id: "snackbar.updated"}), {variant: "success"});
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
          enqueueSnackbar(formatMessage({id: `snackbar.${e.message}`}), {variant: "error"});
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
        }
      });
  };

  const {id, email, firstName, lastName, phoneNumber, language, imageUrl} = user.profile;
  const fixedValues = {id, email, firstName, lastName, phoneNumber, language, imageUrl};

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
