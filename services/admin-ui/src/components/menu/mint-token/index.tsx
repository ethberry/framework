import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { Contract, BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

import { MintTokenDialog, IMintTokenDto } from "./edit";

export interface IOzMintTokenMenuItemProps {
  address: string;
}

export const MintTokenMenuItem: FC<IOzMintTokenMenuItemProps> = props => {
  const { address } = props;

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const { provider } = useWeb3React();

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const meta = useMetamask((values: IMintTokenDto) => {
    const contract = new Contract(address, ERC20SimpleSol.abi, provider?.getSigner());
    return contract.mint(values.recipient, BigNumber.from(values.amount)) as Promise<void>;
  });

  const handleMintTokenConfirmed = async (values: IMintTokenDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsMintTokenDialogOpen(false);
    });
  };

  return (
    <>
      <MenuItem onClick={handleMintToken}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.mintToken" />
        </Typography>
      </MenuItem>
      <MintTokenDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          address,
          recipient: process.env.ACCOUNT,
          amount: "",
        }}
      />
    </>
  );
};
