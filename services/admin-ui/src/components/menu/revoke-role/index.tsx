import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { NoAccounts } from "@mui/icons-material";
import { Contract, utils, constants } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks";
import erc721contract from "@framework/binance-contracts/artifacts/@openzeppelin/contracts/access/IAccessControl.sol/IAccessControl.json";

import { OzContractRevokeRoleDialog, IRevokeRoleDto, OzRoles } from "./edit";

export interface IOzContractRevokeRoleMenuItemProps {
  address: string;
}

export const OzContractRevokeRoleMenuItem: FC<IOzContractRevokeRoleMenuItemProps> = props => {
  const { address } = props;

  const [isRevokeRoleDialogOpen, setIsRevokeRoleDialogOpen] = useState(false);

  const { library } = useWeb3React();

  const handleRevokeRole = (): void => {
    setIsRevokeRoleDialogOpen(true);
  };

  const handleRevokeRoleCancel = (): void => {
    setIsRevokeRoleDialogOpen(false);
  };

  const meta = useMetamask((values: IRevokeRoleDto) => {
    const contract = new Contract(address, erc721contract.abi, library.getSigner());
    const role = values.role === OzRoles.DEFAULT_ADMIN_ROLE ? constants.HashZero : utils.id(values.role);
    return contract.revokeRole(role, values.address) as Promise<void>;
  });

  const handleRevokeRoleConfirmed = async (values: IRevokeRoleDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsRevokeRoleDialogOpen(false);
    });
  };

  return (
    <>
      <MenuItem onClick={handleRevokeRole}>
        <ListItemIcon>
          <NoAccounts fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.revokeRole" />
        </Typography>
      </MenuItem>
      <OzContractRevokeRoleDialog
        onCancel={handleRevokeRoleCancel}
        onConfirm={handleRevokeRoleConfirmed}
        open={isRevokeRoleDialogOpen}
        initialValues={{
          role: OzRoles.DEFAULT_ADMIN_ROLE,
          address: "",
        }}
      />
    </>
  );
};
