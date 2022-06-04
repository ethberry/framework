import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { Erc20TokenTemplate, IErc20Token, IErc20TokenDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Token>, form: any) => Promise<void>;
}

export const Erc20TokenDeployDialog: FC<IErc20TokenDeployDialogProps> = props => {
  const fixedValues: IErc20TokenDeployDto = {
    contractTemplate: Erc20TokenTemplate.SIMPLE,
    name: "",
    symbol: "",
    cap: "1000000",
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
      <EthInput name="cap" />
    </FormDialog>
  );
};
