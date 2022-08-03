import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ITemplate, ModuleType, TemplateStatus, TokenType } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

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
  const testIdPrefix = "Erc721TemplateEditForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid={testIdPrefix}
      {...rest}
    >
      <TextInput name="title" data-testid={`${testIdPrefix}-title`} />
      <RichTextEditor name="description" data-testid={`${testIdPrefix}-description`} />
      <PriceInput prefix="price" disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998]} />
      <NumberInput name="amount" data-testid={`${testIdPrefix}-amount`} />
      {id ? (
        <SelectInput name="templateStatus" options={TemplateStatus} data-testid={`${testIdPrefix}-templateStatus`} />
      ) : null}
      <EntityInput
        name="contractId"
        controller="contracts"
        data={{
          contractType: [TokenType.ERC721],
          contractModule: [ModuleType.CORE],
        }}
        readOnly={!!id}
        data-testid={`${testIdPrefix}-contractId`}
      />
      <AvatarInput name="imageUrl" data-testid={`${testIdPrefix}-imageUrl`} />
    </FormDialog>
  );
};
