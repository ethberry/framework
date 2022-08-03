import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { ContractTemplate, Erc721ContractTemplate, IContract, IErc721ContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721CollectionDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
}

export const Erc721ContractDeployDialog: FC<IErc721CollectionDeployDialogProps> = props => {
  const fixedValues: IErc721ContractDeployDto = {
    contractTemplate: Erc721ContractTemplate.SIMPLE,
    name: "",
    symbol: "",
    baseTokenURI: `${process.env.BE_URL}/metadata`,
    royalty: 0,
  };

  const testIdPrefix = "Erc721ContractDeployForm";

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
        options={Erc721ContractTemplate}
        // MODULE:MYSTERYBOX
        disabledOptions={[ContractTemplate.MYSTERYBOX]}
      />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
