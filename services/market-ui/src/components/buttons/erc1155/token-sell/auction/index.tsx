import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { Erc20TokenInput } from "./token-input";

export interface IErc1155AuctionOptions {
  minAmount: string;
  maxAmount?: string;
  startDate?: string;
  endDate?: string;
  token: string;
  amount: string;
}

export interface IErc1155TokenAuctionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IErc1155AuctionOptions, formikBag: any) => Promise<void>;
  initialValues: IErc1155AuctionOptions;
  data: any;
}

export const Erc1155TokenAuctionDialog: FC<IErc1155TokenAuctionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.auction"
      data-testid="Erc1155CollectionRoyaltyEditDialog"
      {...rest}
    >
      <EthInput name="amount" />
      <EthInput name="minAmount" />
      <EthInput name="maxAmount" />
      <DateTimeInput name="startDate" />
      <DateTimeInput name="endDate" />
      <Erc20TokenInput />
    </FormDialog>
  );
};
