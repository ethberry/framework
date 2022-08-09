import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { IContract, IErc20ContractCreateDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20ContractCreateDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const Erc20ContractCreateDialog: FC<IErc20ContractCreateDialogProps> = props => {
  const fixedValues: IErc20ContractCreateDto = {
    symbol: "",
    decimals: 18,
    title: "",
    description: emptyStateString,
    address: "",
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      testId="Erc20ContractCreateForm"
      {...props}
    >
      <TextInput name="symbol" />
      <NumberInput name="decimals" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TextInput name="address" />
    </FormDialog>
  );
};
