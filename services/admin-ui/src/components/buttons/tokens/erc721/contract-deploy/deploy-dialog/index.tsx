import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc721ContractFeatures, IContract, IErc721ContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721ContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IErc721ContractDeployDto;
}

export const Erc721ContractDeployDialog: FC<IErc721ContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc721ContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractFeatures" options={Erc721ContractFeatures} multiple />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
