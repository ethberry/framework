import { FC, Fragment, useState } from "react";
import { DoNotDisturbOff } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { AccessListUnBlacklistDialog } from "./dialog";

export interface IUnBlacklistMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const UnBlacklistMenuItem: FC<IUnBlacklistMenuItemProps> = props => {
  const {
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
        disabled={disabled}
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
