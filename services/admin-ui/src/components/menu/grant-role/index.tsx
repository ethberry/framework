import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { constants, Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import erc721contract from "@framework/binance-contracts/artifacts/@openzeppelin/contracts/access/IAccessControl.sol/IAccessControl.json";

import { OzContractGrantRoleDialog, IGrantRoleDto, OzRoles } from "./edit";

export interface IOzContractGrantRoleMenuItemProps {
  address: string;
}

export const OzContractGrantRoleMenuItem: FC<IOzContractGrantRoleMenuItemProps> = props => {
  const { address } = props;

  const [isGrantRoleDialogOpen, setIsGrantRoleDialogOpen] = useState(false);

  const { library } = useWeb3React();

  const handleGrantRole = (): void => {
    setIsGrantRoleDialogOpen(true);
  };

  const handleGrantRoleCancel = (): void => {
    setIsGrantRoleDialogOpen(false);
  };

  const meta = useMetamask((values: IGrantRoleDto) => {
    const contract = new Contract(address, erc721contract.abi, library.getSigner());
    const role = values.role === OzRoles.DEFAULT_ADMIN_ROLE ? constants.HashZero : utils.id(values.role);
    return contract.grantRole(role, values.address) as Promise<void>;
  });

  const handleGrantRoleConfirmed = async (values: IGrantRoleDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsGrantRoleDialogOpen(false);
    });
  };

  return (
    <>
      <MenuItem onClick={handleGrantRole}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.grantRole" />
        </Typography>
      </MenuItem>
      <OzContractGrantRoleDialog
        onCancel={handleGrantRoleCancel}
        onConfirm={handleGrantRoleConfirmed}
        open={isGrantRoleDialogOpen}
        initialValues={{
          role: OzRoles.DEFAULT_ADMIN_ROLE,
          address: "",
        }}
      />
    </>
  );
};
