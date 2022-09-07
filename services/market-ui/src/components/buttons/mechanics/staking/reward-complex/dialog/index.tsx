import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SwitchInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IStakingRewardDto {
  withdrawDeposit: boolean;
  breakLastPeriod: boolean;
}

export interface IStakingRewardDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IStakingRewardDto, form?: any) => Promise<void>;
  initialValues: IStakingRewardDto;
}

export const StakingRewardDialog: FC<IStakingRewardDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.reward"
      testId="StakingRewardDialogForm"
      {...rest}
    >
      <SwitchInput name="withdrawDeposit" />
      <br />
      <SwitchInput name="breakLastPeriod" />
    </FormDialog>
  );
};
