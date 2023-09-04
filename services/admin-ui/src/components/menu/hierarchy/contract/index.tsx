import { FC, Fragment, MouseEvent, useState } from "react";
import { Divider, IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { RoyaltyMenuItem } from "../../common/royalty";
import { TransferMenuItem } from "../../common/transfer";
import { GrantRoleMenuItem } from "../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../extensions/renounce-role";
import { BlacklistMenuItem } from "../../extensions/blacklist-add";
import { UnBlacklistMenuItem } from "../../extensions/blacklist-remove";
import { WhitelistMenuItem } from "../../extensions/whitelist-add";
import { UnWhitelistMenuItem } from "../../extensions/whitelist-remove";
import { AllowanceMenuItem } from "./allowance";
import { MintMenuItem } from "./mint";
import { SnapshotMenuItem } from "./snapshot";
import { EthListenerAddMenuItem } from "../../common/eth-add";
import { EthListenerRemoveMenuItem } from "../../common/eth-remove";

export interface IContractActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const ContractActionsMenu: FC<IContractActionsMenu> = props => {
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
        id="contract-menu-button"
        aria-controls={open ? "contract-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="ContractActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="contract-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <BlacklistMenuItem contract={contract} />
        <UnBlacklistMenuItem contract={contract} />
        <WhitelistMenuItem contract={contract} />
        <UnWhitelistMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <MintMenuItem contract={contract} />
        <AllowanceMenuItem contract={contract} />
        <TransferMenuItem contract={contract} />
        <SnapshotMenuItem contract={contract} />
        <RoyaltyMenuItem contract={contract} />

        <EthListenerAddMenuItem contract={contract} />
        <EthListenerRemoveMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
