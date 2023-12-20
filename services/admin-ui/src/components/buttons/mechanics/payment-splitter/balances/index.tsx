import { FC, Fragment, useState } from "react";
import { MonetizationOn } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";

import { PaymentSplitterBalanceDialog } from "./release";

export interface IPaymentSplitterBalanceButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PaymentSplitterBalanceButton: FC<IPaymentSplitterBalanceButtonProps> = props => {
  const { className, contract, disabled, variant } = props;

  const [isPaymentSplitterBalanceDialogOpen, setIsPaymentSplitterBalanceDialogOpen] = useState(false);

  const handlePaymentSplitterBalance = (): void => {
    setIsPaymentSplitterBalanceDialogOpen(true);
  };

  const handlePaymentSplitterBalanceCancel = (): void => {
    setIsPaymentSplitterBalanceDialogOpen(false);
  };

  const handlePaymentSplitterBalanceConfirm = () => {
    setIsPaymentSplitterBalanceDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handlePaymentSplitterBalance}
        icon={MonetizationOn}
        message="form.buttons.paymentSplitterBalance"
        className={className}
        dataTestId="PaymentSplitterBalanceButton"
        disabled={disabled}
        variant={variant}
      />
      <PaymentSplitterBalanceDialog
        onCancel={handlePaymentSplitterBalanceCancel}
        onConfirm={handlePaymentSplitterBalanceConfirm}
        open={isPaymentSplitterBalanceDialogOpen}
        data={{ contract }}
      />
    </Fragment>
  );
};
