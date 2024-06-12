import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ContractStatus, ILootBox, ModuleType, LootBoxStatus, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { MaxInput } from "./max-input";
import { MinInput } from "./min-input";

export interface ILootboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ILootBox>, form: any) => Promise<void>;
  initialValues: ILootBox;
}

export const LootboxEditDialog: FC<ILootboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, item, imageUrl, lootBoxStatus, template, min, max } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    item,
    imageUrl,
    lootBoxStatus,
    template,
    min: min || 1,
    max: max || item?.components.length || 1,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="LootBoxEditForm"
      {...rest}
    >
      <EntityInput
        name="template.contractId"
        controller="contracts"
        data={{
          contractModule: [ModuleType.LOOT],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        }}
        readOnly={!!id}
      />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <MinInput />
      <MaxInput />
      <TemplateAssetInput
        autoSelect
        multiple
        prefix="item"
        contract={{
          data: {
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          },
        }}
        forceAmount
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
      {id ? <SelectInput name="lootBoxStatus" options={LootBoxStatus} /> : null}
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
