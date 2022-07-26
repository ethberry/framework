import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { Erc20ContractTemplate, IContract, IErc20TokenCreateDto } from "@framework/types";

import { validationSchema } from "./validation";
import { AddressInput } from "./address-input";

export interface IErc20TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const Erc20ContractCreateDialog: FC<IErc20TokenDeployDialogProps> = props => {
  const fixedValues: IErc20TokenCreateDto = {
    contractTemplate: Erc20ContractTemplate.EXTERNAL,
    symbol: "",
    decimals: 18,
    title: "",
    description: emptyStateString,
    address: "",
  };

  const testIdPrefix = "Erc20ContractCreateForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      data-testid={testIdPrefix}
      {...props}
    >
      <SelectInput
        name="contractTemplate"
        options={Erc20ContractTemplate}
        disabledOptions={[Erc20ContractTemplate.SIMPLE, Erc20ContractTemplate.BLACKLIST]}
        data-testid={`${testIdPrefix}-contractTemplate`}
      />
      <TextInput name="symbol" data-testid={`${testIdPrefix}-symbol`} />
      <NumberInput name="decimals" data-testid={`${testIdPrefix}-decimals`} />
      <TextInput name="title" data-testid={`${testIdPrefix}-title`} />
      <RichTextEditor name="description" data-testid={`${testIdPrefix}-description`} />
      <AddressInput />
    </FormDialog>
  );
};
