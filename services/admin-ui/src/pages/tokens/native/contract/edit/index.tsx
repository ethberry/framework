import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../components/popover";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const Erc20TokenEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, contractStatus, symbol, decimals, address } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    contractStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <>
      <FormDialog
        initialValues={fixedValues}
        validationSchema={validationSchema}
        message={message}
        testId="Erc20TokenEditDialog"
        {...rest}
      >
        <BlockchainInfoPopover symbol={symbol} address={address} decimals={decimals} />
        <TextInput name="symbol" />
        <TextInput name="title" />
        <RichTextEditor name="description" />
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      </FormDialog>
    </>
  );
};
