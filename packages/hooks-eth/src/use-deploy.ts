import { useState } from "react";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";

import { useServerSignature } from "./use-server-signature";

export const useDeploy = (deploy: (data: any) => Promise<void>) => {
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const deployFn = useServerSignature(deploy);

  const handleDeploy = (): void => {
    setIsDeployDialogOpen(true);
  };

  const handleDeployConfirm = async (data: any, form: any): Promise<any> => {
    const thenHandler = (result: any) => {
      form?.reset(form?.getValues());
      setIsDeployDialogOpen(false);
      enqueueSnackbar(formatMessage({ id: "snackbar.success" }), { variant: "success" });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    };

    const catchHandler = (e: any) => {
      if (e.status === 400) {
        const errors = e.getLocalizedValidationErrors ? e.getLocalizedValidationErrors() : [];

        Object.keys(errors).forEach(key => {
          form?.setError(key, { type: "custom", message: errors[key] }, { shouldFocus: true });
        });
      } else if (e.status) {
        enqueueSnackbar(formatMessage({ id: `snackbar.${e.message as string}` }), { variant: "error" });
      } else {
        console.error(e);
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
      }
    };

    return deployFn(data, thenHandler, catchHandler).then(thenHandler).catch(catchHandler);
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
