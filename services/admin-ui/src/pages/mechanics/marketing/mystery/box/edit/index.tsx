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

export interface IMysteryboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMysteryBox>, form: any) => Promise<void>;
  initialValues: IMysteryBox;
}

export const MysteryboxEditDialog: FC<IMysteryboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, item, imageUrl, mysteryBoxStatus, template } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    item,
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
      <TemplateAssetInput
        autoSelect
        multiple
        prefix="item"
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
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
