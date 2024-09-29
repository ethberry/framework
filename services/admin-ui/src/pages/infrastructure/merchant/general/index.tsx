import { FC, Fragment } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { TextInput, StaticInput } from "@ethberry/mui-inputs-core";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { useUser } from "@ethberry/provider-user";
import { ApiError, useApi } from "@ethberry/provider-api-firebase";
import { FormWrapper } from "@ethberry/mui-form";
import { AvatarInput } from "@ethberry/mui-inputs-image-firebase";
import type { IMerchant, IUser } from "@framework/types";
import { PageHeader } from "@ethberry/mui-page-layout";

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
    const { id: _id, ratePlan: _ratePlan, ...data } = values;
    return api
      .fetchJson({
        url: "/merchants",
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

  const { id, title, description, email, wallet, imageUrl, social, ratePlan } = user.profile.merchant;
  const fixedValues = { id, title, description, email, wallet, imageUrl, social, ratePlan };

  if (!open) {
    return null;
  }

  return (
    <Fragment>
      <PageHeader message="pages.merchant.tabs.general" />

      <FormWrapper initialValues={fixedValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <TextInput name="title" />
        <RichTextEditor name="description" />
        <StaticInput name="ratePlan" />
        <TextInput name="email" autoComplete="username" />
        <TextInput name="wallet" />
        <AvatarInput name="imageUrl" />
        <SocialInput name="social" />
      </FormWrapper>
    </Fragment>
  );
};
