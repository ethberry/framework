import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../components/popover";

export interface IErc1155ContractEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const Erc1155CollectionEditDialog: FC<IErc1155ContractEditDialogProps> = props => {
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
  const testIdPrefix = "Erc1155ContractEditForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid={testIdPrefix}
      {...rest}
    >
      <BlockchainInfoPopover address={address} baseTokenURI={baseTokenURI} />
      <TextInput name="title" data-testid={`${testIdPrefix}-title`} />
      <RichTextEditor name="description" data-testid={`${testIdPrefix}-description`} />
      <SelectInput
        name="contractStatus"
        options={ContractStatus}
        disabledOptions={[ContractStatus.NEW]}
        data-testid={`${testIdPrefix}-contractStatus`}
      />
      <AvatarInput name="imageUrl" data-testid={`${testIdPrefix}-imageUrl`} />
    </FormDialog>
  );
};
