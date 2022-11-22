import { FC } from "react";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  amount: string;
  decimals: number;
}

export interface IDepositAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
  initialValues: IAllowanceDto;
}

export const DepositAllowanceDialog: FC<IDepositAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { decimals } = initialValues;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deposit-allowance"
      testId="AllowanceForm"
      {...rest}
    >
      <EthInput name="amount" units={decimals} symbol="" />
    </FormDialog>
  );
};
