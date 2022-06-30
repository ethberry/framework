import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { IUniContract, UniContractStatus } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../components/popover";
import { formatEther } from "../../../../utils/money";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUniContract>, form: any) => Promise<void>;
  initialValues: IUniContract;
}

export const Erc20TokenEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, contractStatus, name, symbol, address, uniTemplates } = initialValues;

  const [uniTemplate] = uniTemplates;

  const fixedValues = {
    id,
    title,
    description,
    contractStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  // TODO get decimals and cap from template

  return (
    <>
      <FormDialog
        initialValues={fixedValues}
        validationSchema={validationSchema}
        message={message}
        data-testid="Erc20TokenEditDialog"
        {...rest}
      >
        <BlockchainInfoPopover
          name={name}
          symbol={symbol}
          address={address}
          decimals={uniTemplate.decimals}
          cap={formatEther(uniTemplate.amount)}
        />
        <TextInput name="title" />
        <RichTextEditor name="description" />
        <SelectInput name="contractStatus" options={UniContractStatus} disabledOptions={[UniContractStatus.NEW]} />
      </FormDialog>
    </>
  );
};
