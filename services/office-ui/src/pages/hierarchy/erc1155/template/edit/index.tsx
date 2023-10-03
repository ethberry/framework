import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { useUser } from "@gemunion/provider-user";
import type { ITemplate, IUser } from "@framework/types";
import { ContractStatus, ModuleType, TemplateStatus, TokenType } from "@framework/types";

import { ContractInput } from "../../../../../components/forms/template-search/contract-input";
import { TemplateInput } from "../../../../../components/inputs/template-asset";
import { validationSchema } from "./validation";

export interface IErc1155TemplateEditDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<ITemplate>, form: any) => Promise<void>;
  initialValues: ITemplate;
}

export const Erc1155TemplateEditDialog: FC<IErc1155TemplateEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { profile } = useUser<IUser>();

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
    // this is only filter for contract autocomplete
    merchantId: profile.merchantId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="Erc1155TemplateEditForm"
      {...rest}
    >
      <EntityInput name="merchantId" controller="merchants" />
      <ContractInput
        name="contractId"
        data={{
          contractType: [TokenType.ERC1155],
          contractModule: [ModuleType.HIERARCHY],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        }}
        readOnly={!!id}
      />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TemplateInput
        autoSelect
        multiple
        prefix="price"
        tokenType={{
          disabledOptions: [TokenType.ERC721, TokenType.ERC998],
        }}
        contract={{
          data: {
            // includeExternalContracts: true,
            contractStatus: [ContractStatus.ACTIVE],
          },
        }}
      />
      <NumberInput name="amount" />
      {id ? <SelectInput name="templateStatus" options={TemplateStatus} /> : null}
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
