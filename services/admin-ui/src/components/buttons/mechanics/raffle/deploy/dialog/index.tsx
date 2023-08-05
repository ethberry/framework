import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";

export interface IRaffleContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (form?: any) => Promise<void>;
}

export const RaffleContractDeployDialog: FC<IRaffleContractDeployDialogProps> = props => {
  const fixedValues: Record<string, any> = {};

  return (
    <FormDialog
      initialValues={fixedValues}
      message="dialogs.deploy"
      testId="RaffleContractDeployForm"
      {...props}
    ></FormDialog>
  );
};
