import { Web3ContextType } from "@web3-react/core";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";

import { useApi } from "@gemunion/provider-api";
import { IServerSignature } from "@gemunion/types-collection";

export const useServerSignature = (fn: (...args: Array<any>) => Promise<void>): ((data: any, web3Context: Web3ContextType) => Promise<any>) => {
  const api = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return async (...args: Array<any>) => {
    const data = args[0];
    const web3Context = args[1];

    return api
      .fetchJson(data)
      .then((sign: IServerSignature) => fn(
        { ...data?.data },
        web3Context,
        sign,
      ).catch((e: any) => {
        if (e === null) return;

        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message as string}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      }))
      .catch(e => {
        console.error("Signature fetching error", e);
        throw e;
      });
  };
};
