import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { Erc20TokenInput } from "./token-input";

export interface IErc721SellOptions {
  minAmount: string;
  maxAmount?: string;
  startDate?: string;
  endDate?: string;
  token: string;
}

export interface IErc721TokenAuctionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IErc721SellOptions, form: any) => Promise<void>;
  initialValues: IErc721SellOptions;
  data: any;
}

export const Erc721TokenAuctionDialog: FC<IErc721TokenAuctionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.auction"
      data-testid="Erc721CollectionRoyaltyEditDialog"
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
