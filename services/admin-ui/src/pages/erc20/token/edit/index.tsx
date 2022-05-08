import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { Erc20TokenStatus, IErc20Token } from "@framework/types";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IEditErc20TokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Token>, formikBag: any) => Promise<void>;
  initialValues: IErc20Token;
}

export const Erc20TokenEditDialog: FC<IEditErc20TokenDialogProps> = props => {
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
      <TextInput name="title" readOnly={!!id} />
      <RichTextEditor name="description" />
      {id ? <SelectInput name="tokenStatus" options={Erc20TokenStatus} /> : null}
      <TextInput name="symbol" readOnly={!!id} />
      <EthInput name="amount" readOnly={!!id} />
    </FormDialog>
  );
};
