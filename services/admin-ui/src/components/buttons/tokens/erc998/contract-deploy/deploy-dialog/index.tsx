import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc998ContractFeatures, IErc998ContractDeployDto, IToken } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc998CollectionDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IToken>, form?: any) => Promise<void>;
}

export const Erc998ContractDeployDialog: FC<IErc998CollectionDeployDialogProps> = props => {
  const fixedValues: IErc998ContractDeployDto = {
    contractFeatures: [],
    name: "",
    symbol: "",
    baseTokenURI: `${process.env.BE_URL}/metadata`,
    royalty: 0,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc998ContractDeployForm"
      {...props}
    >
      <SelectInput name="contractFeatures" options={Erc998ContractFeatures} multiple />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
