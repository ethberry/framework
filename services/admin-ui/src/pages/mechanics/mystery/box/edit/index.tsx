import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ContractStatus, IMysterybox, ModuleType, MysteryboxStatus, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IMysteryboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMysterybox>, form: any) => Promise<void>;
  initialValues: IMysterybox;
}

export const MysteryboxEditDialog: FC<IMysteryboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, item, imageUrl, mysteryboxStatus, template } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    item,
    imageUrl,
    mysteryboxStatus,
    template,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="MysteryBoxEditForm"
      {...rest}
    >
      <EntityInput
        name="template.contractId"
        controller="contracts"
        data={{
          contractModule: [ModuleType.MYSTERY],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        }}
        readOnly={!!id}
      />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TemplateAssetInput prefix="item" tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20] }} />
      <TemplateAssetInput
        prefix="template.price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
      />
      {id ? <SelectInput name="mysteryboxStatus" options={MysteryboxStatus} /> : null}
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
