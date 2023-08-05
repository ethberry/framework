import { FC, Fragment, MouseEvent, useEffect, useState } from "react";
import { IconButton, Menu, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IContract, IUser } from "@framework/types";
import { useUser } from "@gemunion/provider-user";

import { useCheckAccessMint } from "../../../../utils/use-check-access-mint";
import { RoyaltyMenuItem } from "../../common/royalty";
import { TransferMenuItem } from "../../common/transfer";
import { ContractGrantRoleMenuItem } from "../../extensions/grant-role";
import { ContractRevokeRoleMenuItem } from "../../extensions/revoke-role";
import { ContractRenounceRoleMenuItem } from "../../extensions/renounce-role";
import { BlacklistMenuItem } from "../../extensions/blacklist-add";
import { UnBlacklistMenuItem } from "../../extensions/blacklist-remove";
import { WhitelistMenuItem } from "../../extensions/whitelist-add";
import { UnWhitelistMenuItem } from "../../extensions/whitelist-remove";
import { AllowanceMenuItem } from "./allowance";
import { MintMenuItem } from "./mint";
import { SnapshotMenuItem } from "./snapshot";

export interface IContractActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const ContractActionsMenu: FC<IContractActionsMenu> = props => {
  const { contract, disabled } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const user = useUser<IUser>();
  const { checkAccessMint } = useCheckAccessMint();
  const [hasAccess, setHasAccess] = useState(false);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (user?.profile?.wallet) {
      void checkAccessMint(undefined, {
        account: user.profile.wallet,
        address: contract.address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [user?.profile?.wallet]);

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
        <ContractGrantRoleMenuItem contract={contract} />
        <ContractRevokeRoleMenuItem contract={contract} />
        <ContractRenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <BlacklistMenuItem contract={contract} />
        <UnBlacklistMenuItem contract={contract} />
        <WhitelistMenuItem contract={contract} />
        <UnWhitelistMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        {hasAccess ? <MintMenuItem contract={contract} /> : null}
        <AllowanceMenuItem contract={contract} />
        <TransferMenuItem contract={contract} />
        <SnapshotMenuItem contract={contract} />
        <RoyaltyMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
