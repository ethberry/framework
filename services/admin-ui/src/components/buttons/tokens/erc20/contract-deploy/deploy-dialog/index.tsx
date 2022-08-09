import { FC } from "react";
import { constants } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { Erc20ContractFeatures, IContract, IErc20TokenDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20ContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const Erc20ContractDeployDialog: FC<IErc20ContractDeployDialogProps> = props => {
  const fixedValues: IErc20TokenDeployDto = {
    contractFeatures: [],
    name: "",
    symbol: "",
    cap: constants.WeiPerEther.mul(1e6).toString(),
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc20ContractDeployForm"
      {...props}
    >
      <SelectInput
        name="contractFeatures"
        options={Erc20ContractFeatures}
        disabledOptions={[Erc20ContractFeatures.EXTERNAL]}
        multiple
      />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <EthInput name="cap" />
    </FormDialog>
  );
};
