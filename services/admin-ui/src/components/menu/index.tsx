import { FC, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IErc20TokenSnapshotMenuItem } from "./snapshot";
import { Erc721ContractRoyaltyMenuItem } from "./royalty";
import { ContractGrantRoleMenuItem } from "./grant-role";
import { ContractRevokeRoleMenuItem } from "./revoke-role";
import { ContractRenounceRoleMenuItem } from "./renounce-role";
import { BlacklistAddMenuItem } from "./blacklist-add";
import { UnBlacklistMenuItem } from "./blacklist-remove";
import { MintErc20TokenMenuItem } from "./mint/mint-erc20";
import { MintErc1155TokenMenuItem } from "./mint/mint-erc1155";
import { TokenType } from "@framework/types";

export enum ContractActions {
  MINT = "MINT",
  SNAPSHOT = "SNAPSHOT",
  ROYALTY = "ROYALTY",
  BLACKLIST_ADD = "BLACKLIST_ADD",
  BLACKLIST_REMOVE = "BLACKLIST_REMOVE",
}

export interface IContractActionsMenu {
  contract: any;
  disabled?: boolean;
  actions?: Array<ContractActions | null>;
}

export const ContractActionsMenu: FC<IContractActionsMenu> = props => {
  const { contract, disabled, actions = [] } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
        {contract.contractType === TokenType.ERC20 ? <MintErc20TokenMenuItem address={contract.address} /> : null}
        {contract.contractType === TokenType.ERC1155 ? (
          <MintErc1155TokenMenuItem address={contract.address} contractId={contract.id} />
        ) : null}
        {actions.includes(ContractActions.SNAPSHOT) ? <IErc20TokenSnapshotMenuItem address={contract.address} /> : null}
        {actions.includes(ContractActions.BLACKLIST_ADD) ? <BlacklistAddMenuItem address={contract.address} /> : null}
        {actions.includes(ContractActions.BLACKLIST_REMOVE) ? <UnBlacklistMenuItem address={contract.address} /> : null}
        {actions.includes(ContractActions.ROYALTY) ? (
          <Erc721ContractRoyaltyMenuItem address={contract.address} royalty={contract.royalty} />
        ) : null}
        <ContractGrantRoleMenuItem address={contract.address} />
        <ContractRevokeRoleMenuItem address={contract.address} />
        <ContractRenounceRoleMenuItem address={contract.address} />
      </Menu>
    </>
  );
};
