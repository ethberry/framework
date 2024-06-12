import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { ContractFeatures, ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../../components/popover/contract";

export interface IRaffleEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const RaffleEditDialog: FC<IRaffleEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, imageUrl, contractStatus, address, name, royalty, chainId, contractFeatures } =
    initialValues;

  const fixedValues = {
    id,
    title,
    description,
    address,
    contractStatus,
    imageUrl,
  };
  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="RaffleContractEditForm"
      action={
        id ? (
          <BlockchainInfoPopover
            name={name}
            address={address}
            chainId={chainId}
            contractFeatures={contractFeatures}
            {...(!contractFeatures.includes(ContractFeatures.SOULBOUND) && { royalty: `${royalty / 100}%` })}
          />
        ) : null
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
