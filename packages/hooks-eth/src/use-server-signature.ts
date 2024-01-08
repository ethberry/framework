import { Web3ContextType } from "@web3-react/core";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import type { IFetchProps } from "@gemunion/provider-api";
import { useApi } from "@gemunion/provider-api";
import type { IServerSignature } from "@gemunion/types-blockchain";

import type { IHandlerOptionsParams } from "./interfaces";
import { useSystemContract } from "./use-system-contract";

export const useServerSignature = (
  fn: (...args: Array<any>) => Promise<any>,
  options: IHandlerOptionsParams = {},
): ((
  params: IFetchProps,
  values: Record<string, any> | null,
  web3Context: Web3ContextType,
  contractModule?: any,
) => Promise<any>) => {
  const { error = true } = options;
  const api = useApi();
  const { formatMessage } = useIntl();

  const metaFnWithContract = useSystemContract(fn);

  return async (
    params: IFetchProps,
    values: Record<string, any> | null,
    web3Context: Web3ContextType,
    contractModule: any = "EXCHANGE",
  ) => {
    return api
      .fetchJson(params)
      .catch((e: any) => {
        if (error && e.status !== 400) {
          enqueueSnackbar(formatMessage({ id: "snackbar.internalServerError" }), { variant: "error" });
          console.error("[server error]", e);
          return null;
        }
        throw e;
      })
      .then(async (sign: IServerSignature) => {
        return metaFnWithContract(contractModule, values, web3Context, sign);
      });
  };
};
