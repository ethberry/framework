import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ITemplate, ModuleType, TemplateStatus, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721TemplateEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ITemplate>, form: any) => Promise<void>;
  initialValues: ITemplate;
}

export const Erc721TemplateEditDialog: FC<IErc721TemplateEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, price, amount, templateStatus, contractId, imageUrl } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    price,
    amount,
    templateStatus,
    contractId,
    imageUrl,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="Erc721TemplateEditForm"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TemplateAssetInput
        autoSelect
        multiple
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
      />
      <NumberInput name="amount" />
      {id ? <SelectInput name="templateStatus" options={TemplateStatus} /> : null}
      <EntityInput
        name="contractId"
        controller="contracts"
        data={{
          contractType: [TokenType.ERC721],
          contractModule: [ModuleType.HIERARCHY],
        }}
        readOnly={!!id}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
