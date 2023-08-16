import { FC } from "react";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { useUser } from "@gemunion/provider-user";
import { ApiError, useApi } from "@gemunion/provider-api-firebase";
import { FormWrapper } from "@gemunion/mui-form";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { IMerchant, IUser } from "@framework/types";

import { ITabPanelProps } from "../tabs";
import { validationSchema } from "./validation";
import { SocialInput } from "./social-input";

export const MerchantGeneral: FC<ITabPanelProps> = props => {
  const { open } = props;

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useApi();
  const user = useUser<IUser>();

  const handleSubmit = (values: Partial<IMerchant>): Promise<void> => {
    const { id: _id, ...data } = values;
    return api
      .fetchJson({
        url: `/merchants`,
        method: "PUT",
        data,
      })
      .then(async (): Promise<void> => {
        enqueueSnackbar(formatMessage({ id: "snackbar.updated" }), { variant: "success" });
        await user.getProfile();
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          const errors = e.getLocalizedValidationErrors();

          Object.keys(errors).forEach(key => {
            enqueueSnackbar(formatMessage({ id: errors[key] }, { label: key }), { variant: "error" });
          });
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const { id, title, description, email, wallet, imageUrl, social } = user.profile.merchant;
  const fixedValues = { id, title, description, email, wallet, imageUrl, social };

  if (!open) {
    return null;
  }

  return (
    <Grid>
      <FormWrapper initialValues={fixedValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <TextInput name="title" />
        <RichTextEditor name="description" />
        <TextInput name="email" autoComplete="username" />
        <TextInput name="wallet" />
        <AvatarInput name="imageUrl" />
        <SocialInput name="social" />
      </FormWrapper>
    </Grid>
  );
};
