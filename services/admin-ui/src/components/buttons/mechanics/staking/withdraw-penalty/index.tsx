import { FC, Fragment, useState } from "react";
import { PriceChange } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType } from "@framework/types";

import { StakingWithdrawPenaltyDialog } from "./dialog";
import { useSetButtonPermission } from "../../../../../shared";

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

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, id);

  const handleWithdrawPenalty = (): void => {
    setIsStakingWithdrawPenaltyDialogOpen(true);
  };

  const handleWithdrawPenaltyCancel = (): void => {
    setIsStakingWithdrawPenaltyDialogOpen(false);
  };

  const handleWithdrawPenaltyConfirm = () => {
    setIsStakingWithdrawPenaltyDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleWithdrawPenalty}
        icon={PriceChange}
        message="form.buttons.withdrawPenalty"
        className={className}
        dataTestId="WithdrawPenaltyButton"
        disabled={disabled || !hasPermission}
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
