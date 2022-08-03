import { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { FormWrapper } from "@gemunion/mui-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { useApiCall } from "@gemunion/react-hooks";
import { SettingsKeys } from "@framework/types";

const emptySettings = {
  [SettingsKeys.DUMMY]: "DUMMY",
};

export const Settings: FC = () => {
  const [settings, setSettings] = useState<Record<SettingsKeys, any>>(emptySettings);

  const call1 = useApiCall(
    async api => {
      return api
        .fetchJson({
          url: "/settings",
        })
        .then((json: Record<string, string>) => {
          setSettings(json);
        });
    },
    { success: false },
  );

  const call2 = useApiCall(async (api, settings: Record<SettingsKeys, any>) => {
    return api.fetchJson({
      method: "PUT",
      url: "/settings",
      data: { settings },
    });
  });

  const fetchSettings = (): Promise<void> => {
    return call1.fn();
  };

  const onSubmit = (settings: Record<SettingsKeys, any>, form: any) => {
    return call2.fn(form, settings).then(() => {
      return fetchSettings();
    });
  };

  useEffect(() => {
    void fetchSettings();
  }, []);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "settings"]} />

      <PageHeader message="pages.settings.title" />

      <ProgressOverlay isLoading={call1.isLoading || call2.isLoading}>
        <FormWrapper initialValues={settings} onSubmit={onSubmit} testId="Settings">
          <TextInput name={SettingsKeys.DUMMY} />
        </FormWrapper>
      </ProgressOverlay>
    </Grid>
  );
};
