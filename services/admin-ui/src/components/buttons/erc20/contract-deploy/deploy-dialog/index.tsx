import { FC } from "react";
import { constants } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { Erc20ContractTemplate, IContract, IErc20TokenDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const Erc20ContractDeployDialog: FC<IErc20TokenDeployDialogProps> = props => {
  const fixedValues: IErc20TokenDeployDto = {
    contractTemplate: Erc20ContractTemplate.SIMPLE,
    name: "",
    symbol: "",
    cap: constants.WeiPerEther.mul(1e6).toString(),
  };

  const testIdPrefix = "Erc20ContractDeployForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid={testIdPrefix}
      {...props}
    >
      <SelectInput
        name="contractTemplate"
        options={Erc20ContractTemplate}
        disabledOptions={[Erc20ContractTemplate.EXTERNAL, Erc20ContractTemplate.NATIVE]}
        data-testid={`${testIdPrefix}-contractTemplate`}
      />
      <TextInput name="name" data-testid={`${testIdPrefix}-name`} />
      <TextInput name="symbol" data-testid={`${testIdPrefix}-symbol`} />
      <EthInput name="cap" data-testid={`${testIdPrefix}-cap`} />
    </FormDialog>
  );
};
