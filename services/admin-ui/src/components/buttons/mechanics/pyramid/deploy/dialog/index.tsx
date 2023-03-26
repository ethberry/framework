import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { IContract, PyramidContractTemplates } from "@framework/types";

import { emptyPayee, PayeesInput } from "./payees";
import { emptyShare, SharesInput } from "./shares";
import { validationSchema } from "./validation";

export interface IPyramidContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
}

export const PyramidContractDeployDialog: FC<IPyramidContractDeployDialogProps> = props => {
  const fixedValues: Record<string, any> = {
    contractTemplate: PyramidContractTemplates.SIMPLE,
    payees: [emptyPayee],
    shares: [emptyShare],
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="PyramidContractDeployForm"
      {...props}
    >
      <SelectInput
        name="contractTemplate"
        options={PyramidContractTemplates}
        disabledOptions={[PyramidContractTemplates.SPLITTER]}
      />
      <PayeesInput />
      <SharesInput />
    </FormDialog>
  );
};
