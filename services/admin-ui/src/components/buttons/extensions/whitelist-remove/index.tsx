import { FC, Fragment, useState } from "react";
import { Unpublished } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures } from "@framework/types";

import { shouldDisableByContractType } from "../../utils";
import { AccessListUnWhitelistDialog } from "./dialog";
import { useSetButtonPermission } from "../../../../shared";

export interface IUnWhitelistButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const UnWhitelistButton: FC<IUnWhitelistButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures },
    disabled,
    variant,
  } = props;

  const [isUnWhitelistDialogOpen, setIsUnWhitelistDialogOpen] = useState(false);

  const { isButtonAvailable } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, contract);

  const handleUnWhitelist = (): void => {
    setIsUnWhitelistDialogOpen(true);
  };

  const handleUnWhitelistCancel = (): void => {
    setIsUnWhitelistDialogOpen(false);
  };

  const handleUnWhitelistConfirm = () => {
    setIsUnWhitelistDialogOpen(false);
  };

  if (!contractFeatures.includes(ContractFeatures.WHITELIST)) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleUnWhitelist}
        icon={Unpublished}
        message="form.buttons.unwhitelist"
        className={className}
        dataTestId="UnWhitelistButton"
        disabled={disabled || shouldDisableByContractType(contract) || !isButtonAvailable}
        variant={variant}
      />
      <AccessListUnWhitelistDialog
        onCancel={handleUnWhitelistCancel}
        onConfirm={handleUnWhitelistConfirm}
        open={isUnWhitelistDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
