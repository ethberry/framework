import { FC, Fragment, useState } from "react";
import { NoAccounts } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractSecurity } from "@framework/types";

import { shouldDisableByContractType } from "../../utils";
import { AccessControlRevokeRoleDialog } from "./dialog";
import { useSetButtonPermission } from "../../../../shared";

export interface IRevokeRoleButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RevokeRoleButton: FC<IRevokeRoleButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractSecurity },
    disabled,
    variant,
  } = props;

  const [isRevokeRoleDialogOpen, setIsRevokeRoleDialogOpen] = useState(false);

  const { isButtonAvailable } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, contract);

  const handleRevokeRole = (): void => {
    setIsRevokeRoleDialogOpen(true);
  };

  const handleRevokeRoleCancel = (): void => {
    setIsRevokeRoleDialogOpen(false);
  };

  const handleRevokeRoleConfirm = () => {
    setIsRevokeRoleDialogOpen(false);
  };

  if (contractSecurity !== ContractSecurity.ACCESS_CONTROL) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleRevokeRole}
        icon={NoAccounts}
        message="form.buttons.revokeRole"
        className={className}
        dataTestId="RevokeRoleButton"
        disabled={disabled || shouldDisableByContractType(contract) || !isButtonAvailable}
        variant={variant}
      />
      <AccessControlRevokeRoleDialog
        onCancel={handleRevokeRoleCancel}
        onConfirm={handleRevokeRoleConfirm}
        open={isRevokeRoleDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
