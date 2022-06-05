import { FC, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { FormWrapper } from "@gemunion/mui-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { ApiError, useApi } from "@gemunion/provider-api";
import { SettingsKeys } from "@framework/types";

const emptySettings = {
  [SettingsKeys.DUMMY]: "DUMMY",
};

export const Settings: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Record<SettingsKeys, any>>(emptySettings);

  const api = useApi();

  const fetchSettings = async (): Promise<void> => {
    setIsLoading(true);
    return api
      .fetchJson({
        url: "/settings",
      })
      .then((json: Record<string, string>) => {
        setSettings(json);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = (settings: Record<SettingsKeys, any>, formikBag: any) => {
    setIsLoading(true);
    return api
      .fetchJson({
        method: "PUT",
        url: "/settings",
        data: { settings },
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.updated" }), { variant: "success" });
        return fetchSettings();
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    void fetchSettings();
  }, []);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "settings"]} />

      <PageHeader message="pages.settings.title" />

      <ProgressOverlay isLoading={isLoading}>
        <FormWrapper initialValues={settings} onSubmit={onSubmit}>
          <TextInput name={SettingsKeys.DUMMY} />
        </FormWrapper>
      </ProgressOverlay>
    </Grid>
  );
};
