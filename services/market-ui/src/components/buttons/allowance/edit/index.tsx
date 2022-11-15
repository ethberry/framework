import { FC } from "react";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { validationSchema } from "./validation";

export interface IStakingAllowanceDto {
  amount: string;
  decimals: number;
}

export interface IStakingDepositAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IStakingAllowanceDto, form: any) => Promise<void>;
  initialValues: IStakingAllowanceDto;
}

export const StakingDepositAllowanceDialog: FC<IStakingDepositAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { decimals } = initialValues;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.staking-allowance"
      testId="AllowanceForm"
      {...rest}
    >
      <EthInput name="amount" units={decimals} symbol="" />
    </FormDialog>
  );
};
