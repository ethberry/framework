import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { IContract, ILotteryConfigDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface ILotteryDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: ILotteryConfigDto;
}

export const LotteryDeployDialog: FC<ILotteryDeployDialogProps> = props => {
  return (
    <FormDialog message="dialogs.deploy" testId="LotteryDeployForm" validationSchema={validationSchema} {...props}>
      <NumberInput name="timeLagBeforeRelease" />
      <NumberInput name="commission" />
    </FormDialog>
  );
};
