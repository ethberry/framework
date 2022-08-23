import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { ContractInput } from "../../../../../inputs/contract";

export interface IChainLinkFundDto {
  contractId: number;
  address: string;
  amount: string;
}

export interface IChainLinkFundDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IChainLinkFundDto, form: any) => Promise<void>;
  initialValues: IChainLinkFundDto;
}

export const ChainLinkFundDialog: FC<IChainLinkFundDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.fund"
      testId="FundLinkForm"
      {...rest}
    >
      <ContractInput name="contractId" controller="chain-link" />
      <EthInput name="amount" units={18} symbol="" />
    </FormDialog>
  );
};
