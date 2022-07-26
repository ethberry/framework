import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { ITemplate, TemplateStatus, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IErc1155TemplateEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ITemplate>, form: any) => Promise<void>;
  initialValues: ITemplate;
}

export const Erc1155TemplateEditDialog: FC<IErc1155TemplateEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, price, amount, contractId, templateStatus, imageUrl } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    price,
    amount,
    contractId,
    templateStatus,
    imageUrl,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid="Erc1155TokenEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <PriceInput prefix="price" disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]} />
      <NumberInput name="amount" />
      <SelectInput name="templateStatus" options={TemplateStatus} />
      <EntityInput
        name="contractId"
        controller="contracts"
        data={{
          contractType: [TokenType.ERC1155],
        }}
        readOnly={!!id}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
