import { FC, Fragment, useEffect, useState } from "react";
import { PriceChange } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";

import { StakingWithdrawPenaltyDialog } from "./dialog";
import { useCheckPermissions } from "../../../../../shared/hooks/use-check-permissions";

export interface IStakingWithdrawPenaltyProps {
  contract: IContract;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const StakingWithdrawPenaltyButton: FC<IStakingWithdrawPenaltyProps> = props => {
  const {
    className,
    contract: { id, address },
    disabled,
    variant,
  } = props;

  const [isStakingWithdrawPenaltyDialogOpen, setIsStakingWithdrawPenaltyDialogOpen] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

  const handleWithdrawPenalty = (): void => {
    setIsStakingWithdrawPenaltyDialogOpen(true);
  };

  const handleWithdrawPenaltyCancel = (): void => {
    setIsStakingWithdrawPenaltyDialogOpen(false);
  };

  const handleWithdrawPenaltyConfirm = () => {
    setIsStakingWithdrawPenaltyDialogOpen(false);
  };

  useEffect(() => {
    if (account && address) {
      void checkPermissions({
        account,
        address,
      }).then((json: { hasRole: boolean }) => {
        setHasAccess(json?.hasRole);
      });
    }
  }, [address, account]);

  // if (contractSecurity !== ContractSecurity.ACCESS_CONTROL) {
  //   return null;
  // }

  return (
    <Fragment>
      <ListAction
        onClick={handleWithdrawPenalty}
        icon={PriceChange}
        message="form.buttons.withdrawPenalty"
        className={className}
        dataTestId="WithdrawPenaltyButton"
        disabled={disabled || !hasAccess}
        variant={variant}
      />
      <StakingWithdrawPenaltyDialog
        onCancel={handleWithdrawPenaltyCancel}
        onConfirm={handleWithdrawPenaltyConfirm}
        open={isStakingWithdrawPenaltyDialogOpen}
        data={{ id, address }}
      />
    </Fragment>
  );
};
