import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../components/dialogs/contract";

export interface IErc998ContractEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const Erc998ContractEditDialog: FC<IErc998ContractEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, baseTokenURI, imageUrl, contractStatus, address, symbol, name, royalty, chainId } =
    initialValues;

  const fixedValues = {
    id,
    title,
    address,
    description,
    contractStatus,
    imageUrl,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="Erc998ContractEditForm"
      action={
        <BlockchainInfoPopover
          name={name}
          symbol={symbol}
          address={address}
          baseTokenURI={baseTokenURI}
          royalty={`${royalty / 100}%`}
          chainId={chainId}
        />
      }
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
