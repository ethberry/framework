import { FC } from "react";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  amount: string;
  decimals: number;
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
  initialValues: IAllowanceDto;
}

export const AllowanceDialog: FC<IAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { decimals } = initialValues;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      disabled={false}
      {...rest}
    >
      <EthInput name="amount" units={decimals} symbol="" />
    </FormDialog>
  );
};
