import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IRecipe, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IRecipe>, form: any) => Promise<void>;
  initialValues: IRecipe;
}

export const ExchangeEditDialog: FC<IExchangeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, ingredients } = initialValues;
  const fixedValues = {
    id,
    item,
    ingredients,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      data-testid="CraftEditDialog"
      {...rest}
    >
      <PriceInput prefix="item" disabledOptions={[TokenType.NATIVE, TokenType.ERC20]} />
      <PriceInput prefix="ingredients" multiple disabledOptions={[TokenType.ERC721, TokenType.ERC998]} />
    </FormDialog>
  );
};
