import { useState } from "react";

import { useMetamask } from "./useMetamask";

export const useDeploy = (deploy: (values: any) => Promise<void>) => {
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);

  const metaDeploy = useMetamask(deploy);

  const handleDeploy = (): void => {
    setIsDeployDialogOpen(true);
  };

  const handleDeployConfirm = async (values: any) => {
    await metaDeploy(values);
    setIsDeployDialogOpen(false);
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
