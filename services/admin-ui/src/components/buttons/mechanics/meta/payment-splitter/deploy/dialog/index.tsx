import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import type { IContract } from "@framework/types";
import { PonziContractTemplates } from "@framework/types";

import { emptyShare, SharesInput } from "./shares";
import { validationSchema } from "./validation";

export interface IPaymentSplitterContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
}

export const PaymentSplitterContractDeployDialog: FC<IPaymentSplitterContractDeployDialogProps> = props => {
  const fixedValues: Record<string, any> = {
    contractTemplate: PonziContractTemplates.SIMPLE,
    shares: [emptyShare],
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="PonziContractDeployForm"
      {...props}
    >
      <SharesInput />
    </FormDialog>
  );
};
