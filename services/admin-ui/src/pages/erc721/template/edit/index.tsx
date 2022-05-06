import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc721CollectionType, Erc721TemplateStatus, IErc721Template } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-s3";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IEditErc721TemplateDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Template>, formikBag: any) => Promise<void>;
  initialValues: IErc721Template;
}

export const Erc721TemplateEditDialog: FC<IEditErc721TemplateDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, attributes, price, templateStatus, erc721CollectionId, imageUrl } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    attributes,
    price,
    templateStatus,
    erc721CollectionId,
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
      <EthInput name="price" />
      {id ? <SelectInput name="templateStatus" options={Erc721TemplateStatus} /> : null}
      <EntityInput
        name="erc721CollectionId"
        controller="erc721-collections"
        data={{
          collectionType: [Erc721CollectionType.TOKEN],
        }}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
