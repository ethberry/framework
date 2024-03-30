import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc998ContractTemplates, IErc998ContractDeployDto, IToken } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc998ContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IToken>, form?: any) => Promise<void>;
  initialValues: IErc998ContractDeployDto;
}

export const Erc998ContractDeployDialog: FC<IErc998ContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc998ContractDeployForm"
      {...rest}
    >
      <SelectInput
        name="contractTemplate"
        options={Erc998ContractTemplates}
        disabledOptions={[
          // these templates are too big to deploy
          Erc998ContractTemplates.ERC1155OWNER_ERC20OWNER,
          Erc998ContractTemplates.ERC20OWNER,
          Erc998ContractTemplates.ERC1155OWNER,
        ]}
      />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
