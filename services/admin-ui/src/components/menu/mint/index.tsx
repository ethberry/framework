import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

import { IMintTokenDto, MintTokenDialog } from "./edit";
import { TokenType } from "@framework/types";

export interface IMintMenuItemProps {
  address: string;
  contractId: number;
  tokenType: TokenType;
}

export const MintMenuItem: FC<IMintMenuItemProps> = props => {
  const { address, contractId, tokenType } = props;

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const meta = useMetamask(async (values: IMintTokenDto, web3Context: Web3ContextType) => {
    if (values.tokenType === TokenType.ERC20) {
      const contractErc20 = new Contract(values.address, ERC20SimpleSol.abi, web3Context.provider?.getSigner());
      await contractErc20.mint(values.account, values.amount);
    } else if (values.tokenType === TokenType.ERC721 || values.tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(values.address, ERC721SimpleSol.abi, web3Context.provider?.getSigner());
      await contractErc721.mintCommon(values.account, values.templateId);
    } else if (values.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(values.address, ERC1155SimpleSol.abi, web3Context.provider?.getSigner());
      await contractErc1155.mint(values.account, values.templateId, values.amount, "0x");
    } else {
      throw new Error("unsupported token type");
    }
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
          <AddCircleOutlineIcon />
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
          tokenType,
          address,
          contractId,
          templateId: 0,
          amount: "0",
          account: process.env.ACCOUNT,
          decimals: tokenType === TokenType.ERC20 ? 18 : 0,
        }}
      />
    </>
  );
};
