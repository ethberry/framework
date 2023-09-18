import { FC, Fragment, useState } from "react";
import { MonetizationOn } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";

import { PonziBalanceDialog } from "./view";

export interface IPonziBalanceButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PonziBalanceButton: FC<IPonziBalanceButtonProps> = props => {
  const {
    className,
    contract: { address },
    disabled,
    variant,
  } = props;

  const [isPonziBalanceDialogOpen, setIsPonziBalanceDialogOpen] = useState(false);

  const handlePonziBalance = (): void => {
    setIsPonziBalanceDialogOpen(true);
  };

  const handlePonziBalanceCancel = (): void => {
    setIsPonziBalanceDialogOpen(false);
  };

  const handlePonziBalanceConfirm = () => {
    setIsPonziBalanceDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handlePonziBalance}
        icon={MonetizationOn}
        message="form.buttons.ponziBalance"
        className={className}
        dataTestId="PonziBalanceButton"
        disabled={disabled}
        variant={variant}
      />
      <PonziBalanceDialog
        onCancel={handlePonziBalanceCancel}
        onConfirm={handlePonziBalanceConfirm}
        open={isPonziBalanceDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
