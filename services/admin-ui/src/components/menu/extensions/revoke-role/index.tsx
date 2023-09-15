import { FC, Fragment, useState } from "react";
import { NoAccounts } from "@mui/icons-material";

import type { IContract } from "@framework/types";
import { ContractSecurity } from "@framework/types";

import { ListAction, ListActionVariant } from "../../../common/lists";
import { AccessControlRevokeRoleDialog } from "./dialog";

export interface IRevokeRoleMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RevokeRoleMenuItem: FC<IRevokeRoleMenuItemProps> = props => {
  const {
    contract: { address, contractSecurity },
    disabled,
    variant,
  } = props;

  const [isRevokeRoleDialogOpen, setIsRevokeRoleDialogOpen] = useState(false);

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
        disabled={disabled}
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
