import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { UniContractRole, UniTemplateStatus, IUniTemplate, TokenType } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IUniTemplateEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUniTemplate>, form: any) => Promise<void>;
  initialValues: IUniTemplate;
}

export const Erc998TemplateEditDialog: FC<IUniTemplateEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, attributes, price, amount, templateStatus, uniContractId, imageUrl } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    attributes,
    price,
    amount,
    templateStatus,
    uniContractId,
    imageUrl,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc998TemplateEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <JsonInput name="attributes" />
      <PriceInput prefix="price" />
      <NumberInput name="amount" />
      {id ? <SelectInput name="templateStatus" options={UniTemplateStatus} /> : null}
      <EntityInput
        name="uniContractId"
        controller="uni-contract"
        data={{
          tokenType: [TokenType.ERC998],
          contractRole: [UniContractRole.TOKEN],
        }}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
