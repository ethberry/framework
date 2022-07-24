import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

import { IErc1155MintDto, Erc1155MintDialog } from "./edit";

export interface IOzMintErc1155TokenMenuItemProps {
  address: string;
  contractId: number;
}

export const Erc1155MintMenuItem: FC<IOzMintErc1155TokenMenuItemProps> = props => {
  const { address, contractId } = props;

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const { provider } = useWeb3React();

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const meta = useMetamask((values: IErc1155MintDto) => {
    const contract = new Contract(address, ERC1155SimpleSol.abi, provider?.getSigner());
    return contract.mint(values.account, values.templateId, values.amount, "0x") as Promise<void>;
  });

  const handleMintTokenConfirmed = async (values: IErc1155MintDto): Promise<void> => {
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
      <Erc1155MintDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          address,
          contractId,
          templateId: 0,
          amount: "0",
          account: process.env.ACCOUNT,
        }}
      />
    </>
  );
};
