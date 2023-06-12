import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IContract } from "@framework/types";

import { EthListenerAddMenuItem } from "../../../common/eth-add";
import { EthListenerRemoveMenuItem } from "../../../common/eth-remove";
import { ContractGrantRoleMenuItem } from "../../../extensions/grant-role";
import { ContractRevokeRoleMenuItem } from "../../../extensions/revoke-role";
import { ContractRenounceRoleMenuItem } from "../../../extensions/renounce-role";
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
        <ContractGrantRoleMenuItem contract={contract} />
        <ContractRevokeRoleMenuItem contract={contract} />
        <ContractRenounceRoleMenuItem contract={contract} />
        <MintMenuItem contract={contract} />
        <AllowanceMenuItem contract={contract} />
        <RoyaltyMenuItem contract={contract} />
        <TransferMenuItem contract={contract} />

        <PauseMenuItem contract={contract} />
        <UnPauseMenuItem contract={contract} />
        <BlacklistMenuItem contract={contract} />
        <UnBlacklistMenuItem contract={contract} />
        <WhitelistMenuItem contract={contract} />
        <UnWhitelistMenuItem contract={contract} />

        <EthListenerAddMenuItem contract={contract} />
        <EthListenerRemoveMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
