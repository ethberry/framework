import { FC, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IErc20TokenSnapshotMenuItem } from "./snapshot";
import { Erc721CollectionRoyaltyMenuItem } from "./royalty";
import { OzContractGrantRoleMenuItem } from "./grant-role";
import { OzContractRevokeRoleMenuItem } from "./revoke-role";

export enum ContractActions {
  SNAPSHOT = "SNAPSHOT",
  ROYALTY = "ROYALTY",
}

export interface IContractActionsMenu {
  contract: any;
  actions?: Array<ContractActions>;
}

export const ContractActionsMenu: FC<IContractActionsMenu> = props => {
  const { contract, actions = [] } = props;

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
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        data-testid="ContractActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="contract-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        {actions.includes(ContractActions.SNAPSHOT) ? <IErc20TokenSnapshotMenuItem address={contract.address} /> : null}
        {actions.includes(ContractActions.ROYALTY) ? (
          <Erc721CollectionRoyaltyMenuItem address={contract.address} royalty={contract.royalty} />
        ) : null}
        <OzContractGrantRoleMenuItem address={contract.address} />
        <OzContractRevokeRoleMenuItem address={contract.address} />
      </Menu>
    </>
  );
};
