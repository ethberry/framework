import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IAsset, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../components/inputs/price";

export interface IWhitelistGenerateDto {
  item: IAsset;
}

export interface IWhitelistEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWhitelistGenerateDto>, form: any) => Promise<void>;
  initialValues: IWhitelistGenerateDto;
}

export const WhitelistGenerateDialog: FC<IWhitelistEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { item } = initialValues;
  const fixedValues = {
    item,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      testId="WhitelistGenerateDialog"
      {...rest}
    >
      <PriceInput prefix="item" disabledTokenTypes={[TokenType.NATIVE, TokenType.ERC20]} multiple />
    </FormDialog>
  );
};
