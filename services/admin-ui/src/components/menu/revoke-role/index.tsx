import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { NoAccounts } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { AccessControlRoleHash, AccessControlRoleType } from "@framework/types";
import IAccessControlSol from "@framework/binance-contracts/artifacts/@openzeppelin/contracts/access/IAccessControl.sol/IAccessControl.json";

import { AccessControlRevokeRoleDialog, IRevokeRoleDto } from "./edit";

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
    const contract = new Contract(address, IAccessControlSol.abi, library.getSigner());
    return contract.revokeRole(AccessControlRoleHash[values.role], values.address) as Promise<void>;
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
      <AccessControlRevokeRoleDialog
        onCancel={handleRevokeRoleCancel}
        onConfirm={handleRevokeRoleConfirmed}
        open={isRevokeRoleDialogOpen}
        initialValues={{
          role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
          address: "",
        }}
      />
    </>
  );
};
