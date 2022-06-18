import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { Erc20TokenInput } from "./token-input";

export interface IErc998SellOptions {
  minAmount: string;
  maxAmount?: string;
  startDate?: string;
  endDate?: string;
  token: string;
}

export interface IErc998TokenAuctionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IErc998SellOptions, form: any) => Promise<void>;
  initialValues: IErc998SellOptions;
  data: any;
}

export const Erc998TokenAuctionDialog: FC<IErc998TokenAuctionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.auction"
      data-testid="Erc998CollectionRoyaltyEditDialog"
      {...rest}
    >
      <EthInput name="minAmount" />
      <EthInput name="maxAmount" />
      <DateTimeInput name="startDate" />
      <DateTimeInput name="endDate" />
      <Erc20TokenInput />
    </FormDialog>
  );
};
