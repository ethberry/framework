import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { EthInput } from "@ethberry/mui-inputs-mask";
import { Erc20ContractTemplates, IContract, IErc20TokenDeployDto } from "@framework/types";

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
        name="contractTemplate"
        options={Erc20ContractTemplates}
        disabledOptions={[Erc20ContractTemplates.EXTERNAL]}
        required
      />
      <TextInput name="name" required />
      <TextInput name="symbol" required />
      <EthInput name="cap" required />
    </FormDialog>
  );
};
