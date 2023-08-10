import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { GrantRoleMenuItem } from "../../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../../extensions/renounce-role";
import { RoyaltyMenuItem } from "../../../common/royalty";
import { TransferMenuItem } from "../../../common/transfer";
import { AllowanceMenuItem } from "../../../hierarchy/contract/allowance";
import { PauseMenuItem } from "../../common/pause";
import { BlacklistMenuItem } from "../../../extensions/blacklist-add";
import { UnBlacklistMenuItem } from "../../../extensions/blacklist-remove";
import { WhitelistMenuItem } from "../../../extensions/whitelist-add";
import { UnWhitelistMenuItem } from "../../../extensions/whitelist-remove";
import { MintMenuItem } from "./mint";
import { UnPauseMenuItem } from "../../common/unpause";

export interface IMysteryActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const MysteryActionsMenu: FC<IMysteryActionsMenu> = props => {
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
        id="mystery-menu-button"
        aria-controls={open ? "mystery-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="MysteryActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="mystery-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <BlacklistMenuItem contract={contract} />
        <UnBlacklistMenuItem contract={contract} />
        <WhitelistMenuItem contract={contract} />
        <UnWhitelistMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <PauseMenuItem contract={contract} />
        <UnPauseMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <MintMenuItem contract={contract} />
        <AllowanceMenuItem contract={contract} />
        <RoyaltyMenuItem contract={contract} />
        <TransferMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
