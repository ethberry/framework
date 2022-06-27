import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc998CollectionType, Erc998TemplateStatus, IErc998Template } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { Erc20PriceInput } from "../../../../components/inputs/erc20-price";

export interface IErc998TemplateEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc998Template>, form: any) => Promise<void>;
  initialValues: IErc998Template;
}

export const Erc998TemplateEditDialog: FC<IErc998TemplateEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    attributes,
    price,
    amount,
    templateStatus,
    erc998CollectionId,
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
    erc998CollectionId,
    erc20TokenId,
    imageUrl,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc998TemplateEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <JsonInput name="attributes" />
      <Erc20PriceInput />
      <NumberInput name="amount" />
      {id ? <SelectInput name="templateStatus" options={Erc998TemplateStatus} /> : null}
      <EntityInput
        name="erc998CollectionId"
        controller="erc998-collections"
        data={{
          collectionType: [Erc998CollectionType.TOKEN],
        }}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
