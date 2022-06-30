import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { IUniContract, UniContractStatus } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../components/popover";

export interface IUniContractEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUniContract>, form: any) => Promise<void>;
  initialValues: IUniContract;
}

export const Erc1155CollectionEditDialog: FC<IUniContractEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, imageUrl, address, contractStatus, baseTokenURI } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    imageUrl,
    contractStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid="Erc1155CollectionEditDialog"
      {...rest}
    >
      <BlockchainInfoPopover address={address} baseTokenURI={baseTokenURI} />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SelectInput
        name="contractStatus"
        options={UniContractStatus}
        disabledOptions={[UniContractStatus.NEW]}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
