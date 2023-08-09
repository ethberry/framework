import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { TransferMenuItem } from "../../common/transfer";
import { RoyaltyMenuItem } from "../../common/royalty";
import { ContractRenounceRoleMenuItem } from "../../extensions/renounce-role";
import { ContractRevokeRoleMenuItem } from "../../extensions/revoke-role";
import { ContractGrantRoleMenuItem } from "../../extensions/grant-role";
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
      <Menu id="collection-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <ContractGrantRoleMenuItem contract={contract} />
        <ContractRevokeRoleMenuItem contract={contract} />
        <ContractRenounceRoleMenuItem contract={contract} />
        <AllowanceMenuItem contract={contract} />
        <RoyaltyMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <BlacklistMenuItem contract={contract} />
        <UnBlacklistMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <TransferMenuItem contract={contract} />
        <CollectionUploadMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
