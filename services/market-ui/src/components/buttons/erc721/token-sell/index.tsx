import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { IErc721Token } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import CraftERC1155 from "@framework/binance-contracts/artifacts/contracts/Craft/CraftERC1155.sol/CraftERC1155.json";

interface IErc721TokenSellButtonProps {
  token: IErc721Token;
}

export const Erc721TokenSellButton: FC<IErc721TokenSellButtonProps> = () => {
  const { library } = useWeb3React();

  const meta = useMetamask(() => {
    const contract = new ethers.Contract(process.env.ERC1155_CRAFT_ADDR, CraftERC1155.abi, library.getSigner());
    return contract.createRecipe(1, [], [], 1) as Promise<void>;
  });

  const handleSell = () => {
    return meta().then(() => {
      // TODO reload
    });
  };

  return (
    <Button onClick={handleSell} data-testid="Erc721TokenSellButton">
      <FormattedMessage id="form.buttons.sell" />
    </Button>
  );
};
