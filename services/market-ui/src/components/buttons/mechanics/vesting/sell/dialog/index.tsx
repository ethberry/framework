import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import type { IAsset } from "@framework/types";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../inputs/price";

export interface IVestingSellDto {
  account: string;
  price: IAsset;
}

export interface IStakingDepositDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IVestingSellDto, form?: any) => Promise<void>;
  initialValues: IVestingSellDto;
}

export const VestingSellDialog: FC<IStakingDepositDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.sell"
      testId="VestingSellDialogForm"
      {...rest}
    >
      <TextInput name="account" />
      <PriceInput prefix="price" disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]} />
    </FormDialog>
  );
};
