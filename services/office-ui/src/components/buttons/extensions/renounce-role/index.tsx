import { FC, Fragment, useState } from "react";
import { NoAccounts } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { ContractSecurity } from "@framework/types";

import { AccessControlRenounceRoleDialog } from "./dialog";

export interface IRenounceRoleButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RenounceRoleButton: FC<IRenounceRoleButtonProps> = props => {
  const {
    className,
    contract: { address, contractSecurity },
    disabled,
    variant,
  } = props;

  const [isRenounceRoleDialogOpen, setIsRenounceRoleDialogOpen] = useState(false);

  const handleRenounceRole = (): void => {
    setIsRenounceRoleDialogOpen(true);
  };

  const handleRenounceRoleCancel = (): void => {
    setIsRenounceRoleDialogOpen(false);
  };

  const handleRenounceRoleConfirm = () => {
    setIsRenounceRoleDialogOpen(false);
  };

  if (contractSecurity !== ContractSecurity.ACCESS_CONTROL) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleRenounceRole}
        icon={NoAccounts}
        message="form.buttons.renounceRole"
        className={className}
        dataTestId="RenounceRoleButton"
        disabled={disabled}
        variant={variant}
      />
      <AccessControlRenounceRoleDialog
        onCancel={handleRenounceRoleCancel}
        onConfirm={handleRenounceRoleConfirm}
        open={isRenounceRoleDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};