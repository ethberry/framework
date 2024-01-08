import { Web3ContextType } from "@web3-react/core";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { useApi } from "@gemunion/provider-api";
import type { IDeployable, IServerSignature } from "@gemunion/types-blockchain";

import type { IHandlerOptionsParams } from "./interfaces";

export const useSystemContract = <T extends IDeployable, M = any>(
  fn: (...args: Array<any>) => Promise<any>,
  options: IHandlerOptionsParams = {},
): ((
  contractModule: M,
  values: Record<string, any> | null,
  web3Context: Web3ContextType,
  sign?: IServerSignature,
) => Promise<any>) => {
  const { error = true } = options;
  const api = useApi();
  const { formatMessage } = useIntl();

  return async (
    contractModule: M,
    values: Record<string, any> | null,
    web3Context: Web3ContextType,
    sign?: IServerSignature,
  ) => {
    return api
      .fetchJson({
        url: "/contracts/system",
        method: "POST",
        data: {
          contractModule,
          chainId: web3Context.chainId,
        },
      })
      .catch((e: any) => {
        if (error && e.status !== 400) {
          enqueueSnackbar(formatMessage({ id: "snackbar.internalServerError" }), { variant: "error" });
          console.error("[server error]", e);
          return null;
        }
        throw e;
      })
      .then((contract: T) => (sign ? fn(values, web3Context, sign, contract) : fn(values, web3Context, contract)));
  };
};
