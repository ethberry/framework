import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

import { IMintErc20TokenDto, MintErc20TokenDialog } from "./edit";

export interface IOzMintTokenMenuItemProps {
  address: string;
  contractId: number;
}

export const Erc20MintMenuItem: FC<IOzMintTokenMenuItemProps> = props => {
  const { address, contractId } = props;

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const meta = useMetamask((values: IMintErc20TokenDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, ERC20SimpleSol.abi, web3Context.provider?.getSigner());
    return contract.mint(values.account, values.amount) as Promise<void>;
  });

  const handleMintTokenConfirmed = async (values: IMintErc20TokenDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsMintTokenDialogOpen(false);
    });
  };

  return (
    <>
      <MenuItem onClick={handleMintToken}>
        <ListItemIcon>
          <AddCircleOutlineIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.mintToken" />
        </Typography>
      </MenuItem>
      <MintErc20TokenDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          address,
          contractId,
          amount: "0",
          account: process.env.ACCOUNT,
        }}
      />
    </>
  );
};
