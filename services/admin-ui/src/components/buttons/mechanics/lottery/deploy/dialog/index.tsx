import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { IContract, ILotteryConfigDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface ILotteryContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: ILotteryConfigDto;
}

export const LotteryContractDeployDialog: FC<ILotteryContractDeployDialogProps> = props => {
  return (
    <FormDialog
      message="dialogs.deploy"
      testId="LotteryContractDeployForm"
      validationSchema={validationSchema}
      {...props}
    >
      <NumberInput name="timeLagBeforeRelease" />
      <NumberInput name="commission" />
    </FormDialog>
  );
};
