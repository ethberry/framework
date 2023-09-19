import { FC } from "react";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { ApiError, useApi } from "@gemunion/provider-api-firebase";
import { FormWrapper } from "@gemunion/mui-form";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { IMerchant, IUser } from "@framework/types";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { validationSchema } from "./validation";
import { SocialInput } from "./social-input";

export const Merchant: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useApi();
  const { profile } = useUser<IUser>();
  const navigate = useNavigate();

  const handleSubmit = (values: Partial<IMerchant>): Promise<void> => {
    const { id: _id, ...data } = values;
    return api
      .fetchJson({
        url: `/merchants`,
        method: "POST",
        data,
      })
      .then(() => {
        navigate("/message/merchant-created", { replace: true });
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

  const { email, wallet, imageUrl } = profile;
  const fixedValues = {
    title: "",
    description: emptyStateString,
    email,
    wallet,
    imageUrl,
    social: {
      twitterUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      facebookUrl: "",
    },
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "merchant"]} />

      <PageHeader message="pages.merchant.title" />

      <FormWrapper
        initialValues={fixedValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        showPrompt={false}
      >
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
