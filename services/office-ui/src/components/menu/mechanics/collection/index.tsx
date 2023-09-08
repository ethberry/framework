import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { EthListenerRemoveMenuItem } from "../../common/eth-remove";
import { EthListenerAddMenuItem } from "../../common/eth-add";
import { TransferMenuItem } from "../../common/transfer";
import { RoyaltyMenuItem } from "../../common/royalty";
import { RenounceRoleMenuItem } from "../../extensions/renounce-role";
import { RevokeRoleMenuItem } from "../../extensions/revoke-role";
import { GrantRoleMenuItem } from "../../extensions/grant-role";
import { AllowanceMenuItem } from "../../hierarchy/contract/allowance";
import { CollectionUploadMenuItem } from "./upload";
import { BlacklistMenuItem } from "../../extensions/blacklist-add";
import { UnBlacklistMenuItem } from "../../extensions/blacklist-remove";

export interface ICollectionActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const CollectionActionsMenu: FC<ICollectionActionsMenu> = props => {
  const { contract, disabled } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton
        aria-label="more"
        id="collection-menu-button"
        aria-controls={open ? "collection-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="CollectionActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="collection-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        keepMounted
      >
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <AllowanceMenuItem contract={contract} />
        <RoyaltyMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <BlacklistMenuItem contract={contract} />
        <UnBlacklistMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <TransferMenuItem contract={contract} />
        <CollectionUploadMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <EthListenerAddMenuItem contract={contract} />
        <EthListenerRemoveMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
