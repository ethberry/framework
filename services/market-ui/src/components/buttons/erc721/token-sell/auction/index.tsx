import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { Erc20TokenInput } from "./token-input";

export interface IErc721SellOptions {
  minPrice: string;
  maxPrice?: string;
  startTime?: string;
  endTime?: string;
  token?: string;
}

export interface IErc721TokenAuctionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IErc721SellOptions, formikBag: any) => Promise<void>;
  initialValues: IErc721SellOptions;
}

export const Erc721TokenAuctionDialog: FC<IErc721TokenAuctionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      data-testid="Erc721CollectionRoyaltyEditDialog"
      {...rest}
    >
      <EthInput name="minPrice" />
      <EthInput name="maxPrice" />
      <DateTimeInput name="startTime" />
      <DateTimeInput name="endTime" />
      <Erc20TokenInput />
    </FormDialog>
  );
};
