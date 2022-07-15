import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { BigNumber, Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

import { IMintErc1155TokenDto, MintErc1155TokenDialog } from "./edit";

export interface IOzMintErc1155TokenMenuItemProps {
  address: string;
  contractId: number;
}

export const MintErc1155TokenMenuItem: FC<IOzMintErc1155TokenMenuItemProps> = props => {
  const { address, contractId } = props;

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const { provider } = useWeb3React();

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };
  // _mint(to, id, amount, data);

  const meta = useMetamask((values: IMintErc1155TokenDto) => {
    const contract = new Contract(address, ERC1155SimpleSol.abi, provider?.getSigner());
    return contract.mint(values.recipient, values.templateId, BigNumber.from(values.amount), "0x") as Promise<void>;
  });

  const handleMintTokenConfirmed = async (values: IMintErc1155TokenDto): Promise<void> => {
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
      <MintErc1155TokenDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId,
          address,
          recipient: process.env.ACCOUNT,
          templateId: "",
          amount: "",
        }}
      />
    </>
  );
};
