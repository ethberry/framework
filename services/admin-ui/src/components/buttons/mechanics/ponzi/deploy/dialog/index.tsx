import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { IContract, PonziContractTemplates } from "@framework/types";

import { emptyShare, SharesInput } from "./shares";
import { validationSchema } from "./validation";

export interface IPonziContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
}

export const PonziContractDeployDialog: FC<IPonziContractDeployDialogProps> = props => {
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
      <SelectInput
        name="contractTemplate"
        options={PonziContractTemplates}
        disabledOptions={[PonziContractTemplates.SPLITTER]}
      />
      <SharesInput />
    </FormDialog>
  );
};
