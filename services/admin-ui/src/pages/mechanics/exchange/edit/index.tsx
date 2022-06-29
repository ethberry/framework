import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IExchange } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IExchange>, form: any) => Promise<void>;
  initialValues: IExchange;
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
      message={"dialogs.edit"}
      data-testid="ExchangeEditDialog"
      {...rest}
    >
      <PriceInput prefix="item" />
      <PriceInput prefix="ingredients" />
    </FormDialog>
  );
};
