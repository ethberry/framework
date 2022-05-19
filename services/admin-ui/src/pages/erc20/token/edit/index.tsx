import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { Erc20TokenStatus, IErc20Token } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Token>, formikBag: any) => Promise<void>;
  initialValues: IErc20Token;
}

export const Erc20TokenEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, tokenStatus, symbol, amount } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    tokenStatus,
    symbol,
    amount,
  };

  const message = id ? "dialogs.edit" : "dialogs.add";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid="Erc20TokenEditDialog"
      {...rest}
    >
      <TextInput name="title" readOnly />
      <RichTextEditor name="description" />
      <SelectInput name="tokenStatus" options={Erc20TokenStatus} />
      <TextInput name="symbol" readOnly />
      <EthInput name="amount" readOnly />
    </FormDialog>
  );
};
