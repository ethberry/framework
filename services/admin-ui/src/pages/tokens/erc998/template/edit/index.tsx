import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ITemplate, TemplateStatus, TokenType } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../components/inputs/price";

export interface ITemplateEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ITemplate>, form: any) => Promise<void>;
  initialValues: ITemplate;
}

export const Erc998TemplateEditDialog: FC<ITemplateEditDialogProps> = props => {
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
      testId="Erc998TemplateEditForm"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <PriceInput prefix="price" disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998]} />
      <NumberInput name="amount" />
      {id ? <SelectInput name="templateStatus" options={TemplateStatus} /> : null}
      <EntityInput
        name="contractId"
        controller="contract"
        data={{
          tokenType: [TokenType.ERC998],
        }}
        readOnly={!!id}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
