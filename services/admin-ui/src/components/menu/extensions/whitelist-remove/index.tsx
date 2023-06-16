import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Unpublished } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { AccessListUnWhitelistDialog } from "./dialog";

export interface IUnWhitelistMenuItemProps {
  contract: IContract;
}

export const UnWhitelistMenuItem: FC<IUnWhitelistMenuItemProps> = props => {
  const {
    contract: { address, contractFeatures },
  } = props;

  const [isUnWhitelistDialogOpen, setIsUnWhitelistDialogOpen] = useState(false);

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
      <MenuItem onClick={handleUnWhitelist}>
        <ListItemIcon>
          <Unpublished fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.unwhitelist" />
        </Typography>
      </MenuItem>
      <AccessListUnWhitelistDialog
        onCancel={handleUnWhitelistCancel}
        onConfirm={handleUnWhitelistConfirm}
        open={isUnWhitelistDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
