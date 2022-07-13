import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IRecipe } from "@framework/types";

// import { validationSchema2 } from "./validation";
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
      // validationSchema={validationSchema2}
      message={"dialogs.edit"}
      data-testid="ExchangeEditDialog"
      {...rest}
    >
      <PriceInput prefix="item" name="Item" />
      <PriceInput prefix="ingredients" multiple name="Ingredients" />
    </FormDialog>
  );
};
