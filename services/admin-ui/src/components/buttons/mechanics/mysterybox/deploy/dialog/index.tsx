import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { IContract, IMysteryboxContractDeployDto, MysteryboxContractFeatures } from "@framework/types";

import { validationSchema } from "./validation";

export interface IMysteryboxContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IMysteryboxContractDeployDto;
}

export const MysteryboxContractDeployDialog: FC<IMysteryboxContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="MysteryboxContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractFeatures" options={MysteryboxContractFeatures} multiple />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
