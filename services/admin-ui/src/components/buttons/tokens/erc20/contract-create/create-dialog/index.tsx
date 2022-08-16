import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { IContract, IErc20ContractCreateDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20ContractCreateDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IErc20ContractCreateDto;
}

export const Erc20ContractCreateDialog: FC<IErc20ContractCreateDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      testId="Erc20ContractCreateForm"
      {...rest}
    >
      <TextInput name="symbol" />
      <NumberInput name="decimals" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TextInput name="address" />
    </FormDialog>
  );
};
