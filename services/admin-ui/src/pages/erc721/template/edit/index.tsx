import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { UniContractType, UniTemplateStatus, IErc721Template } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { Erc20PriceInput } from "../../../../components/inputs/erc20-price";

export interface IErc721TemplateEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Template>, form: any) => Promise<void>;
  initialValues: IErc721Template;
}

export const Erc721TemplateEditDialog: FC<IErc721TemplateEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    attributes,
    price,
    amount,
    templateStatus,
    erc721CollectionId,
    erc20TokenId,
    imageUrl,
  } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    attributes,
    price,
    amount,
    templateStatus,
    erc721CollectionId,
    erc20TokenId,
    imageUrl,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc721TemplateEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <JsonInput name="attributes" />
      <Erc20PriceInput />
      <NumberInput name="amount" />
      {id ? <SelectInput name="templateStatus" options={UniTemplateStatus} /> : null}
      <EntityInput
        name="erc721CollectionId"
        controller="erc721-collections"
        data={{
          collectionType: [UniContractType.TOKEN],
        }}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
