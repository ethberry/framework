import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";
import { TemplateInput } from "./template-input";
import { AmountInput } from "./amount-input";

export interface IMintTokenDto {
  tokenType: TokenType;
  address: string;
  contractId: number;
  templateId: number;
  amount: string;
  account: string;
  decimals: number;
}

export interface IMintTokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintTokenDto, form: any) => Promise<void>;
  initialValues: IMintTokenDto;
}

export const MintTokenDialog: FC<IMintTokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const testIdPrefix = "MintForm";

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      testId={testIdPrefix}
      {...rest}
    >
      <ContractInput />
      <TemplateInput />
      <AmountInput />
      <TextInput name="account" />
    </FormDialog>
  );
};
