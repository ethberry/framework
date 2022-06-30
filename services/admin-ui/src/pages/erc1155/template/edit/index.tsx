import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { IUniTemplate, UniTemplateStatus } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IErc1155TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUniTemplate>, form: any) => Promise<void>;
  initialValues: IUniTemplate;
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
    uniContractId,
    templateStatus,
    imageUrl,
  } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    attributes,
    price,
    amount,
    uniContractId,
    templateStatus,
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
      <PriceInput prefix="price" />
      <NumberInput name="amount" />
      <SelectInput name="templateStatus" options={UniTemplateStatus} />
      <EntityInput name="uniContractId" controller="erc1155-contracts" readOnly={!!id} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
