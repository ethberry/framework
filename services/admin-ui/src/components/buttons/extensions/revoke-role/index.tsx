import { FC, Fragment, useEffect, useState } from "react";
import { NoAccounts } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { ContractSecurity } from "@framework/types";

import { shouldDisableByContractType } from "../../utils";
import { AccessControlRevokeRoleDialog } from "./dialog";
import { useCheckPermissions } from "../../../../utils/use-check-permissions";

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

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

  const handleRevokeRole = (): void => {
    setIsRevokeRoleDialogOpen(true);
  };

  const handleRevokeRoleCancel = (): void => {
    setIsRevokeRoleDialogOpen(false);
  };

  const handleRevokeRoleConfirm = () => {
    setIsRevokeRoleDialogOpen(false);
  };

  useEffect(() => {
    if (account) {
      void checkPermissions({
        account,
        address,
      }).then((json: { hasRole: boolean }) => {
        setHasAccess(json?.hasRole);
      });
    }
  }, [account]);

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
        disabled={disabled || shouldDisableByContractType(contract) || !hasAccess}
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
