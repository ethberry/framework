import { FC, Fragment, useState } from "react";
import { DoNotDisturbOff } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { AccessListUnBlacklistDialog } from "./dialog";
import { shouldDisableByContractType } from "../../../utils";

export interface IUnBlacklistButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const UnBlacklistButton: FC<IUnBlacklistButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures },
    disabled,
    variant,
  } = props;

  const [isUnBlacklistDialogOpen, setIsUnBlacklistDialogOpen] = useState(false);

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
        disabled={disabled || shouldDisableByContractType(contract)}
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
