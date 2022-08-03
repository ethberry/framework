import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc998ContractTemplate, IErc998ContractDeployDto, IToken } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc998CollectionDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IToken>, form?: any) => Promise<void>;
}

export const Erc998ContractDeployDialog: FC<IErc998CollectionDeployDialogProps> = props => {
  const fixedValues: IErc998ContractDeployDto = {
    contractTemplate: Erc998ContractTemplate.SIMPLE,
    name: "",
    symbol: "",
    baseTokenURI: `${process.env.BE_URL}/metadata`,
    royalty: 0,
  };

  const testIdPrefix = "Erc998ContractDeployForm";

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
        options={Erc998ContractTemplate}
        data-testid={`${testIdPrefix}-contractTemplate`}
      />
      <TextInput name="name" data-testid={`${testIdPrefix}-name`} />
      <TextInput name="symbol" data-testid={`${testIdPrefix}-symbol`} />
      <TextInput name="baseTokenURI" data-testid={`${testIdPrefix}-baseTokenURI`} />
      <CurrencyInput name="royalty" symbol="%" data-testid={`${testIdPrefix}-royalty`} />
    </FormDialog>
  );
};
