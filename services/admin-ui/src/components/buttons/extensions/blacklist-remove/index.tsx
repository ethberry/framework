import { FC, Fragment, useState } from "react";
import { DoNotDisturbOff } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures } from "@framework/types";

import { shouldDisableByContractType } from "../../utils";
import { AccessListUnBlacklistDialog } from "./dialog";
import { useSetButtonPermission } from "../../../../shared";

export interface IUnBlacklistButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
  permissionRole?: AccessControlRoleType;
}

export const UnBlacklistButton: FC<IUnBlacklistButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures },
    disabled,
    variant,
    permissionRole = AccessControlRoleType.DEFAULT_ADMIN_ROLE,
  } = props;

  const [isUnBlacklistDialogOpen, setIsUnBlacklistDialogOpen] = useState(false);

  const { isButtonAvailable } = useSetButtonPermission(permissionRole, contract);

  const handleUnBlacklist = (): void => {
    setIsUnBlacklistDialogOpen(true);
  };

  const handleUnBlacklistCancel = (): void => {
    setIsUnBlacklistDialogOpen(false);
  };

  const handleUnBlacklistConfirm = () => {
    setIsUnBlacklistDialogOpen(false);
  };

  if (!contractFeatures.includes(ContractFeatures.BLACKLIST)) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleUnBlacklist}
        icon={DoNotDisturbOff}
        message="form.buttons.unblacklist"
        className={className}
        dataTestId="UnBlacklistButton"
        disabled={disabled || shouldDisableByContractType(contract) || !isButtonAvailable}
        variant={variant}
      />
      <AccessListUnBlacklistDialog
        onCancel={handleUnBlacklistCancel}
        onConfirm={handleUnBlacklistConfirm}
        open={isUnBlacklistDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
