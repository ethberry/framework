import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { IDrop, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IDropEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDrop>, form: any) => Promise<void>;
  initialValues: IDrop;
}

export const DropEditDialog: FC<IDropEditDialogProps> = props => {
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
  const testIdPrefix = "DropEditForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId={testIdPrefix}
      {...rest}
    >
      <PriceInput prefix="item" disabledTokenTypes={[TokenType.NATIVE, TokenType.ERC20]} />
      <PriceInput prefix="price" disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998]} />
      <DateInput name="startTimestamp" />
      <DateInput name="endTimestamp" />
    </FormDialog>
  );
};
