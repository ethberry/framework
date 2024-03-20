import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { FormControlLabel, Switch } from "@mui/material";
import { useSnackbar } from "notistack";

import { useApiCall } from "@gemunion/react-hooks";
import { ApiError } from "@gemunion/provider-api-firebase";

export const SwitchTwoFA: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [is2FAActive, setIs2FAActive] = useState<boolean>(false);

  const { fn: get2FAStatus, isLoading } = useApiCall(
    async api => {
      return api
        .fetchJson({
          url: "/2fa",
        })
        .then((json: { isActive: boolean }) => {
          setIs2FAActive(!!json?.isActive);
        });
    },
    { success: false, error: false },
  );

  const { fn: activate, isLoading: isActivating } = useApiCall(
    async api => {
      return api
        .fetchJson({
          url: "/2fa/activate",
          method: "GET",
        })
        .catch((e: ApiError) => {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        });
    },
    { success: false, error: false },
  );

  const handleActivate = async () => {
    return activate().then(() => {
      return get2FAStatus();
    });
  };

  const { fn: deactivate, isLoading: isDeactivating } = useApiCall(async api => {
    return api.fetchJson({
      url: "/2fa/deactivate",
      method: "GET",
    });
  });

  const handleDeactivate = async () => {
    await deactivate();
    return await get2FAStatus();
  };

  const handleChange = (_event: any, value: boolean) => {
    return value ? handleActivate() : handleDeactivate();
  };

  useEffect(() => {
    void get2FAStatus();
  }, []);

  return (
    <FormControlLabel
      control={
        <Switch checked={is2FAActive} disabled={isActivating || isDeactivating || isLoading} onChange={handleChange} />
      }
      label={formatMessage({ id: `pages.profile.settings.2fa.${is2FAActive ? "disable" : "enable"}` })}
    />
  );
};
