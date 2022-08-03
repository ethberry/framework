import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { IMysterybox, MysteryboxStatus, TokenType } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IMysteryboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMysterybox>, form: any) => Promise<void>;
  initialValues: IMysterybox;
}

export const MysteryboxEditDialog: FC<IMysteryboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, item, price, imageUrl, mysteryboxStatus } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    item,
    price,
    imageUrl,
    mysteryboxStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";
  const testIdPrefix = "MysteryboxEditForm";

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
      <PriceInput prefix="item" multiple disabledTokenTypes={[TokenType.NATIVE, TokenType.ERC20]} />
      <PriceInput prefix="price" disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998]} />
      {id ? (
        <SelectInput
          name="mysteryboxStatus"
          options={MysteryboxStatus}
          data-testid={`${testIdPrefix}-mysteryboxStatus`}
        />
      ) : null}
      <AvatarInput name="imageUrl" data-testid={`${testIdPrefix}-imageUrl`} />
    </FormDialog>
  );
};
