import { FC, Fragment, useState } from "react";
import { PriceCheck } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";

import { StakingCheckBalanceDialog } from "./dialog";

export interface IStakingCheckBalanceProps {
  contract: IContract;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const StakingCheckBalanceButton: FC<IStakingCheckBalanceProps> = props => {
  const {
    className,
    contract: { id, address },
    disabled,
    variant,
  } = props;

  const [isStakingCheckBalanceDialogOpen, setIsStakingCheckBalanceDialogOpen] = useState(false);

  const handleCheckBalance = (): void => {
    setIsStakingCheckBalanceDialogOpen(true);
  };

  const handleCheckBalanceCancel = (): void => {
    setIsStakingCheckBalanceDialogOpen(false);
  };

  const handleCheckBalanceConfirm = () => {
    setIsStakingCheckBalanceDialogOpen(false);
  };

  // if (contractSecurity !== ContractSecurity.ACCESS_CONTROL) {
  //   return null;
  // }

  return (
    <Fragment>
      <ListAction
        onClick={handleCheckBalance}
        icon={PriceCheck}
        message="form.buttons.checkBalance"
        className={className}
        dataTestId="CheckBalanceButton"
        disabled={disabled}
        variant={variant}
      />
      <StakingCheckBalanceDialog
        onCancel={handleCheckBalanceCancel}
        onConfirm={handleCheckBalanceConfirm}
        open={isStakingCheckBalanceDialogOpen}
        data={{ id, address, contract: props.contract }}
      />
    </Fragment>
  );
};
