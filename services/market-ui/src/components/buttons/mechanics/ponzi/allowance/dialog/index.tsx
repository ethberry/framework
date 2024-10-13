import { FC } from "react";
import { EthInput } from "@ethberry/mui-inputs-mask";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  amount: bigint;
  decimals: number;
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
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
