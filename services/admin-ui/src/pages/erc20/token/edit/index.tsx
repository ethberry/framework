import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { Erc20TokenStatus, IErc20Token } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../components/popover";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Token>, formikBag: any) => Promise<void>;
  initialValues: IErc20Token;
}

export const Erc20TokenEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, tokenStatus, name, symbol, address, amount } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    tokenStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.add";

  return (
    <>
      <FormDialog
        initialValues={fixedValues}
        validationSchema={validationSchema}
        message={message}
        data-testid="Erc20TokenEditDialog"
        {...rest}
      >
        <BlockchainInfoPopover name={name} symbol={symbol} address={address} amount={amount} />
        <TextInput name="title" />
        <RichTextEditor name="description" />
        <SelectInput name="tokenStatus" options={Erc20TokenStatus} disabledOptions={[Erc20TokenStatus.NEW]} />
      </FormDialog>
    </>
  );
};
