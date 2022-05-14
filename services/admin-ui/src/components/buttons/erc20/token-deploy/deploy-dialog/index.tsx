import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { IErc20Token } from "@framework/types";

import { validationSchema } from "./validation";

export enum Erc20TokenTemplate {
  "SIMPLE" = "SIMPLE", // ACBCS
  "BLACKLIST" = "BLACKLIST", // ACBCS + BLACKLIST
}

export interface IErc20TokenContractFields {
  contractTemplate: Erc20TokenTemplate;
  name: string;
  symbol: string;
  amount: number;
}

export interface IErc20TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Token>, formikBag: any) => Promise<void>;
}

export const Erc20TokenDeployDialog: FC<IErc20TokenDeployDialogProps> = props => {
  const fixedValues: IErc20TokenContractFields = {
    contractTemplate: Erc20TokenTemplate.SIMPLE,
    name: "",
    symbol: "",
    amount: 0,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid="Erc20TokenDeployDialog"
      {...props}
    >
      <SelectInput name="contractTemplate" options={Erc20TokenTemplate} />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <EthInput name="amount" />
    </FormDialog>
  );
};
