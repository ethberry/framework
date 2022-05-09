import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IErc1155Token } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-s3";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IEditErc1155TokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc1155Token>, formikBag: any) => Promise<void>;
  initialValues: IErc1155Token;
}

export const Erc1155TokenEditDialog: FC<IEditErc1155TokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, attributes, price, amount, erc1155CollectionId, imageUrl } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    attributes,
    price,
    amount,
    erc1155CollectionId,
    imageUrl,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc1155TokenEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <JsonInput name="attributes" />
      <EthInput name="price" />
      <NumberInput name="amount" />
      <EntityInput name="erc1155CollectionId" controller="erc1155-collections" readOnly={!!id} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
