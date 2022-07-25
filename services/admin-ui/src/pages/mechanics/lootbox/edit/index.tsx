import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { ILootbox, LootboxStatus, TokenType } from "@framework/types";
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

  const { id, title, description, item, price, imageUrl, lootboxStatus } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    item,
    price,
    imageUrl,
    lootboxStatus,
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
      <PriceInput prefix="item" multiple disabledTokenTypes={[TokenType.NATIVE, TokenType.ERC20]} />
      <PriceInput prefix="price" disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998]} />
      {id ? <SelectInput name="lootboxStatus" options={LootboxStatus} /> : null}
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
