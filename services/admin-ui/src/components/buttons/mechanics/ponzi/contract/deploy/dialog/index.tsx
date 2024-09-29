import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput } from "@ethberry/mui-inputs-core";
import type { IContract } from "@framework/types";
import { PonziContractTemplates } from "@framework/types";

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
