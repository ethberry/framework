import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, IMysteryBox, ModuleType, MysteryBoxStatus, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "../../../../../components/forms/template-search/contract-input";
import { TemplateInput } from "../../../../../components/inputs/template-asset";

export interface IMysteryboxEditDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<IMysteryBox>, form: any) => Promise<void>;
  initialValues: IMysteryBox;
}

export const MysteryboxEditDialog: FC<IMysteryboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    item,
    imageUrl,
    mysteryBoxStatus,
    template,
    // @ts-ignore
    // this is only filter for contract autocomplete
    merchantId,
  } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    item,
    imageUrl,
    mysteryBoxStatus,
    template,
    merchantId,
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
      <EntityInput name="merchantId" controller="merchants" />
      <ContractInput
        name="contractId"
        data={{
          contractType: [TokenType.ERC721],
          contractModule: [ModuleType.MYSTERY],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        }}
        readOnly={!!id}
      />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TemplateInput
        autoSelect
        multiple
        prefix="item"
        contract={{
          data: {
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          },
        }}
      />
      <TemplateInput
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
