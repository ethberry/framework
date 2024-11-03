import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { CurrencyInput } from "@ethberry/mui-inputs-mask";
import { VestingContractTemplates } from "@framework/types";
import type { IContract, IVestingContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IVestingContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IVestingContractDeployDto;
}

export const VestingContractDeployDialog: FC<IVestingContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="VestingContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractTemplate" options={VestingContractTemplates} />
      <TextInput name="name" required />
      <TextInput name="symbol" required />
      <TextInput name="baseTokenURI" required />
      <CurrencyInput name="royalty" symbol="%" required />
    </FormDialog>
  );
};
