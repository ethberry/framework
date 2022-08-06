import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";

import { CraftStatus, ICraft, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ICraft>, form: any) => Promise<void>;
  initialValues: ICraft;
}

export const CraftEditDialog: FC<IExchangeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, craftStatus } = initialValues;

  const fixedValues = {
    craftStatus,
    id,
    item,
    price,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      testId="CraftEditForm"
      {...rest}
    >
      {id ? <SelectInput name="craftStatus" options={CraftStatus} disabledOptions={[CraftStatus.NEW]} /> : null}
      <PriceInput prefix="item" disabledTokenTypes={[TokenType.NATIVE, TokenType.ERC20]} />
      <PriceInput prefix="price" multiple disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998]} />
    </FormDialog>
  );
};
