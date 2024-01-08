import { useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IFetchProps } from "@gemunion/provider-api";

import { useServerSignature } from "./use-server-signature";
import { useMetamask } from "./use-metamask";

export const useDeploy = (
  deploy: (data: any, web3Context: Web3ContextType, sign: IServerSignature, systemContract?: any) => Promise<void>,
) => {
  const { formatMessage } = useIntl();

  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);

  const fnWithSignature = useServerSignature(deploy, { error: false });
  const deployFn = useMetamask((params: IFetchProps, web3Context: Web3ContextType) => {
    return fnWithSignature(params, params.data!, web3Context, "CONTRACT_MANAGER");
  });

  const handleDeploy = (): void => {
    setIsDeployDialogOpen(true);
  };

  const handleDeployConfirm = async (params: any, form: any): Promise<any> => {
    return deployFn(params)
      .then((result: any) => {
        // in case if some uncaught errors occurred from nested promises we need to prevent continue chaining
        if (result === null) {
          return;
        }
        // @ts-ignore
        if (Object.hasOwn(form, "getValues")) {
          form?.reset(form?.getValues());
        }
        setIsDeployDialogOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
      })
      .catch((e: any) => {
        if (e.status === 400) {
          const errors = e.getLocalizedValidationErrors ? e.getLocalizedValidationErrors() : [];
          Object.keys(errors).forEach(key => {
            form?.setError(key, { type: "custom", message: errors[key] }, { shouldFocus: true });
          });
        } else {
          console.error("unknown error", e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const handleDeployCancel = () => {
    setIsDeployDialogOpen(false);
  };

  return {
    isDeployDialogOpen,
    handleDeploy,
    handleDeployConfirm,
    handleDeployCancel,
  };
};
