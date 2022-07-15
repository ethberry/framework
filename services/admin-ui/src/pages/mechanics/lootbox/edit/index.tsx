import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractRole, LootboxStatus, ILootbox, TokenType } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface ILootboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ILootbox>, form: any) => Promise<void>;
  initialValues: ILootbox;
}

export const LootboxEditDialog: FC<ILootboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, item, price, imageUrl, lootboxStatus, templateId, contractId } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    item,
    price,
    imageUrl,
    lootboxStatus,
    templateId,
    contractId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid="LootboxEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <PriceInput prefix="item" disabledOptions={[TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]} />
      <PriceInput prefix="price" disabledOptions={[TokenType.ERC721, TokenType.ERC998]} />
      {id ? <SelectInput name="lootboxStatus" options={LootboxStatus} /> : null}
      <EntityInput name="templateId" controller="templates" data={{}} />
      <EntityInput name="contract" controller="contracts" data={{ contractRole: [ContractRole.LOOTBOX] }} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
