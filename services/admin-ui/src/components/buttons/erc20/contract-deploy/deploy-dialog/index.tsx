import { FC } from "react";
import { constants } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { Erc20ContractTemplate, IUniContract, IErc20TokenDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUniContract>, form: any) => Promise<void>;
}

export const Erc20TokenDeployDialog: FC<IErc20TokenDeployDialogProps> = props => {
  const fixedValues: IErc20TokenDeployDto = {
    contractTemplate: Erc20ContractTemplate.SIMPLE,
    name: "",
    symbol: "",
    cap: constants.WeiPerEther.mul(1e6).toString(),
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid="Erc20TokenDeployDialog"
      {...props}
    >
      <SelectInput
        name="contractTemplate"
        options={Erc20ContractTemplate}
        disabledOptions={[Erc20ContractTemplate.EXTERNAL, Erc20ContractTemplate.NATIVE]}
      />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <EthInput name="cap" />
    </FormDialog>
  );
};
