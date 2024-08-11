import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ContractStatus, ModuleType, MysteryBoxStatus, TokenType, ContractFeatures } from "@framework/types";
import type { IMysteryBox } from "@framework/types";

import { validationSchema } from "./validation";

export interface IMysteryBoxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMysteryBox>, form: any) => Promise<void>;
  initialValues: IMysteryBox;
}

export const MysteryBoxEditDialog: FC<IMysteryBoxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, content, imageUrl, mysteryBoxStatus, template } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    content,
    imageUrl,
    mysteryBoxStatus,
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
        required
        name="template.contractId"
        controller="contracts"
        data={{
          contractModule: [ModuleType.MYSTERY],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        }}
        readOnly={!!id}
      />
      <TextInput name="title" required />
      <RichTextEditor name="description" InputLabelProps={{ required: true }} />
      <TemplateAssetInput
        required
        autoSelect
        multiple
        prefix="content"
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] }}
        contract={{
          data: {
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
            contractFeatures: [ContractFeatures.RANDOM],
          },
        }}
        forceAmount
        readOnly={!!id}
      />
      <TemplateAssetInput
        required
        autoSelect
        multiple
        prefix="template.price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
        contract={{
          data: {
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          },
        }}
      />
      {id ? <SelectInput name="mysteryBoxStatus" options={MysteryBoxStatus} /> : null}
      <AvatarInput name="imageUrl" required />
    </FormDialog>
  );
};
