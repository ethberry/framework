import { FC, useContext } from "react";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { EnabledLanguages } from "@framework/constants";
import { IUser } from "@framework/types";
import { FormWrapper } from "@gemunion/mui-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { UserContext } from "@gemunion/provider-user";

import { ITabPanelProps, ProfileTabs } from "../tabs";
import { validationSchema } from "./validation";

export const ProfileGeneral: FC<ITabPanelProps> = props => {
  const { value } = props;

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const user = useContext(UserContext);
  const api = useContext(ApiContext);

  if (value !== ProfileTabs.general) {
    return null;
  }

  const onClick = (): void => {
    enqueueSnackbar("Warning! You won't be able to use this site until you confirm your new email address.", {
      variant: "info",
    });
  };

  const handleSubmit = (values: Partial<IUser>, form: any): Promise<void> => {
    return api
      .fetchJson({
        url: "/profile",
        method: "PUT",
        data: values,
      })
      .then((json): void => {
        enqueueSnackbar(formatMessage({ id: "snackbar.updated" }), { variant: "success" });
        if (json) {
          // user.logIn(json);
        } else {
          // user.logOut();
        }
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          const errors = e.getLocalizedValidationErrors();

          Object.keys(errors).forEach(key => {
            form?.setError(name, { type: "custom", message: errors[key] });
          });
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
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
