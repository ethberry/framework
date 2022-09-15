import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IAsset, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../components/inputs/price";

export interface IWaitlistGenerateDto {
  item: IAsset;
}

export interface IWaitlistEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWaitlistGenerateDto>, form: any) => Promise<void>;
  initialValues: IWaitlistGenerateDto;
}

export const WaitlistGenerateDialog: FC<IWaitlistEditDialogProps> = props => {
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
      testId="WaitlistGenerateDialog"
      {...rest}
    >
      <PriceInput prefix="item" disabledTokenTypes={[TokenType.NATIVE, TokenType.ERC20]} multiple />
    </FormDialog>
  );
};
