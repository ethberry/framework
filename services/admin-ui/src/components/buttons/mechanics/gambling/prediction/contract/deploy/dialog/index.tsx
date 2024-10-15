import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput } from "@ethberry/mui-inputs-core";
import type { IContract } from "@framework/types";
import { PredictionContractTemplates } from "@framework/types";

import { validationSchema } from "./validation";

export interface IPredictionContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
}

export const PredictionContractDeployDialog: FC<IPredictionContractDeployDialogProps> = props => {
  const fixedValues: Record<string, any> = {
    contractTemplate: PredictionContractTemplates.SIMPLE,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="PredictionContractDeployForm"
      {...props}
    >
      <SelectInput
        name="contractTemplate"
        options={PredictionContractTemplates}
        disabledOptions={[PredictionContractTemplates.SIMPLE]}
      />
    </FormDialog>
  );
};
