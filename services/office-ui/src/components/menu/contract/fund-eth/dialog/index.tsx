import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IFundEthDto {
  amount: number;
}

export interface IFundEthEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IFundEthDto, form: any) => Promise<void>;
  initialValues: IFundEthDto;
}

export const FundEthEditDialog: FC<IFundEthEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.fund"
      testId="FundEthEditForm"
      {...rest}
    >
      <EthInput name="amount" units={18} symbol="" />
    </FormDialog>
  );
};
