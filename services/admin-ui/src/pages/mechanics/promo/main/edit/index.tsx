import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { IAssetPromo, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IAssetPromoEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IAssetPromo>, form: any) => Promise<void>;
  initialValues: IAssetPromo;
}

export const AssetPromoEditDialog: FC<IAssetPromoEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, startTimestamp, endTimestamp } = initialValues;
  const fixedValues = {
    id,
    item,
    price,
    startTimestamp,
    endTimestamp,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="AssetPromoEditForm"
      {...rest}
    >
      <TemplateAssetInput autoSelect prefix="item" />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
      />
      <DateTimeInput name="startTimestamp" />
      <DateTimeInput name="endTimestamp" />
    </FormDialog>
  );
};
