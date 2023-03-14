import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { IContract, IPyramidContractDeployDto, PyramidContractTemplates } from "@framework/types";

import { validationSchema } from "./validation";

export interface IPyramidContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
}

export const PyramidContractDeployDialog: FC<IPyramidContractDeployDialogProps> = props => {
  const fixedValues: IPyramidContractDeployDto = {
    contractTemplate: PyramidContractTemplates.SIMPLE,
    payees: [],
    shares: [],
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="PyramidContractDeployForm"
      {...props}
    >
      <SelectInput name="contractTemplate" options={PyramidContractTemplates} />
      <TextInput name="payees" />
      <TextInput name="shares" />
    </FormDialog>
  );
};
