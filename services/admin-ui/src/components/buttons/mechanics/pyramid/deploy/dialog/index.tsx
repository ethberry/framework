import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, NumberInput } from "@gemunion/mui-inputs-core";
import { IContract, IPyramidContractDeployDto, PyramidContractFeatures } from "@framework/types";

import { validationSchema } from "./validation";

export interface IPyramidContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IPyramidContractDeployDto;
}

export const PyramidContractDeployDialog: FC<IPyramidContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="PyramidContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractFeatures" options={PyramidContractFeatures} multiple />
    </FormDialog>
  );
};
