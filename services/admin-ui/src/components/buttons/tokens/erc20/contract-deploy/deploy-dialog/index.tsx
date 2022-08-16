import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { Erc20ContractFeatures, IContract, IErc20TokenDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20ContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IErc20TokenDeployDto;
}

export const Erc20ContractDeployDialog: FC<IErc20ContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc20ContractDeployForm"
      {...rest}
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
