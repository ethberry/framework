import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api";
import { IErc1155Token, IMarketplaceSignature } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import MarketplaceERC1155 from "@framework/binance-contracts/artifacts/contracts/Marketplace/MarketplaceERC1155.sol/MarketplaceERC1155.json";

interface IErc1155TokenSingleBuyButtonProps {
  token: IErc1155Token;
}

export const Erc1155TokenSingleBuyButton: FC<IErc1155TokenSingleBuyButtonProps> = props => {
  const { token } = props;

  const api = useApi();
  const { library, account } = useWeb3React();

  const handleBuy = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc1155-marketplace/sign-token",
        method: "POST",
        data: {
          erc1155TokenIds: [token.id],
          amounts: [1],
        },
      })
      .then((json: IMarketplaceSignature) => {
        const contract = new ethers.Contract(
          process.env.MARKETPLACE_ERC1155_ADDR,
          MarketplaceERC1155.abi,
          library.getSigner(),
        );
        return contract.redeem(
          account,
          token.erc1155Collection?.address,
          token.id,
          process.env.ACCOUNT,
          json.signature,
        ) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="Erc1155TokenSingleBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
