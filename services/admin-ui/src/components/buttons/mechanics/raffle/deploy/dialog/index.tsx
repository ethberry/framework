import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IContract, IRaffleConfigDto } from "@framework/types";

// import { validationSchema } from "./validation";

export interface IRaffleContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IRaffleConfigDto;
}

export const RaffleContractDeployDialog: FC<IRaffleContractDeployDialogProps> = props => {
  return (
    <FormDialog
      message="dialogs.deploy"
      testId="RaffleContractDeployForm"
      // validationSchema={validationSchema}
      {...props}
    ></FormDialog>
  );
};
