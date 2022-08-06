import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";

export interface IFundLinkDto {
  contractId: number;
  address: string;
  amount: string;
}

export interface IFundLinkDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IFundLinkDto, form: any) => Promise<void>;
  initialValues: IFundLinkDto;
}

export const FundLinkDialog: FC<IFundLinkDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.fund"
      testId="FundLinkForm"
      {...rest}
    >
      <ContractInput />
      <EthInput name="amount" units={18} symbol="" />
    </FormDialog>
  );
};
