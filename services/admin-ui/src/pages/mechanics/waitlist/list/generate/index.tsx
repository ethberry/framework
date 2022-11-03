import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { IAsset, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../components/inputs/price";

export interface IWaitlistGenerateDto {
  item: IAsset;
  listId: number;
}

export interface IWaitlistEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWaitlistGenerateDto>, form: any) => Promise<void>;
  initialValues: IWaitlistGenerateDto;
}

export const WaitlistGenerateDialog: FC<IWaitlistEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { item, listId } = initialValues;
  const fixedValues = {
    item,
    listId,
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
      <EntityInput name="listId" controller="waitlist/list" />
    </FormDialog>
  );
};
