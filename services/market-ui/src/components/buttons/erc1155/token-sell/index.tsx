import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { FormattedMessage } from "react-intl";

import { IErc1155Token } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import MarketplaceERC721 from "@framework/binance-contracts/artifacts/contracts/Marketplace/MarketplaceERC721.sol/MarketplaceERC721.json";

interface IErc1155TokenSellButtonProps {
  token: IErc1155Token;
}

export const Erc1155TokenSellButton: FC<IErc1155TokenSellButtonProps> = props => {
  const { token } = props;

  void token;

  const { library } = useWeb3React();

  const handleSell = useMetamask(() => {
    const contract = new ethers.Contract(process.env.ERC1155_AUCTION_ADDR, MarketplaceERC721.abi, library.getSigner());

    void contract;

    // TODO put item on auction
    alert("Not implemented");
    return Promise.resolve();
  });

  return (
    <Button onClick={handleSell} data-testid="Erc1155TokenSellButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
