import { FC } from "react";
import { FormDialog } from "@ethberry/mui-dialog-form";

import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { AvatarInput } from "@ethberry/mui-inputs-image-firebase";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ContractFeatures, ContractStatus, ModuleType, MysteryBoxStatus, TokenType } from "@framework/types";
import type { IMysteryBox } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "../../../../../../components/forms/template-search/contract-input";
import { TemplateInput } from "../../../../../../components/inputs/template-asset";

export interface IMysteryBoxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMysteryBox>, form: any) => Promise<void>;
  initialValues: IMysteryBox;
}

export const MysteryBoxEditDialog: FC<IMysteryBoxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    content,
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
    content,
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
        required
        name="contractId"
        data={{
          contractType: [TokenType.ERC721],
          contractModule: [ModuleType.MYSTERY],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        }}
        readOnly={!!id}
      />
      <TextInput name="title" required />
      <RichTextEditor name="description" InputLabelProps={{ required: true }} />
      <TemplateInput
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
      />
      <TemplateInput
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
