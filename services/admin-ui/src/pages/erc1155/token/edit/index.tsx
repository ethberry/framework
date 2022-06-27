import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { UniTemplateStatus, IErc1155Token } from "@framework/types";

import { validationSchema } from "./validation";
import { Erc20PriceInput } from "../../../../components/inputs/erc20-price";

export interface IErc1155TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc1155Token>, form: any) => Promise<void>;
  initialValues: IErc1155Token;
}

export const Erc1155TokenEditDialog: FC<IErc1155TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    attributes,
    price,
    amount,
    erc1155CollectionId,
    erc20TokenId,
    tokenStatus,
    imageUrl,
  } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    attributes,
    price,
    amount,
    erc1155CollectionId,
    erc20TokenId,
    tokenStatus,
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
      <Erc20PriceInput />
      <NumberInput name="amount" />
      <SelectInput name="tokenStatus" options={UniTemplateStatus} />
      <EntityInput name="erc1155CollectionId" controller="erc1155-collections" readOnly={!!id} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
