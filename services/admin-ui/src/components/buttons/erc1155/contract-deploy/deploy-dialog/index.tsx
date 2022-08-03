import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc1155ContractTemplate, IContract, IErc1155ContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc1155TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const Erc1155ContractDeployDialog: FC<IErc1155TokenDeployDialogProps> = props => {
  const fixedValues: IErc1155ContractDeployDto = {
    contractTemplate: Erc1155ContractTemplate.SIMPLE,
    baseTokenURI: `${process.env.BE_URL}/metadata`,
    royalty: 0,
  };

  const testIdPrefix = "Erc1155ContractDeployForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId={testIdPrefix}
      {...props}
    >
      <SelectInput
        name="contractTemplate"
        options={Erc1155ContractTemplate}
      />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
