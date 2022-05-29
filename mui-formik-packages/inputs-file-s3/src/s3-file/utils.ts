import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { useApi } from "@gemunion/provider-api";

export const useDeleteUrl = (bucket?: string): ((url: string) => Promise<void>) => {
  const api = useApi();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return async (url: string): Promise<void> => {
    await api
      .fetchJson({
        url: "/s3/delete",
        data: {
          objectName: url.split("/").pop(),
          bucket,
        },
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
      })
      .catch(e => {
        console.error(e);
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
      });
  };
};
