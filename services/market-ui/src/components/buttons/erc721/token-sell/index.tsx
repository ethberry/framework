import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { IErc721Token } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import ERC721Marketplace from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";

interface IErc721TokenSellButtonProps {
  token: IErc721Token;
}

export const Erc721TokenSellButton: FC<IErc721TokenSellButtonProps> = props => {
  const { token } = props;

  void token;

  const { library } = useWeb3React();

  const metaSell = useMetamask(() => {
    const contract = new ethers.Contract(process.env.ERC1155_AUCTION_ADDR, ERC721Marketplace.abi, library.getSigner());

    void contract;

    // TODO put item on auction
    alert("Not implemented");
    return Promise.resolve();
  });

  const handleSell = () => {
    return metaSell().then(() => {
      // TODO reload
    });
  };

  return (
    <Button onClick={handleSell} data-testid="Erc721TokenSellButton">
      <FormattedMessage id="form.buttons.sell" />
    </Button>
  );
};
