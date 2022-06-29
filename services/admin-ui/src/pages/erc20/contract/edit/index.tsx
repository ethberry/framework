import { FC } from "react";
import { constants } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { IUniContract, UniContractStatus } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../components/popover";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUniContract>, form: any) => Promise<void>;
  initialValues: IUniContract;
}

export const Erc20TokenEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, contractStatus, name, symbol, address } = initialValues;

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
          decimals={18}
          address={address}
          amount={constants.WeiPerEther.toString()}
        />
        <TextInput name="title" />
        <RichTextEditor name="description" />
        <SelectInput name="contractStatus" options={UniContractStatus} disabledOptions={[UniContractStatus.NEW]} />
      </FormDialog>
    </>
  );
};
