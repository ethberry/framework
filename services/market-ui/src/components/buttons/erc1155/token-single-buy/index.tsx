import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import { useApi } from "@gemunion/provider-api";
import { IServerSignature } from "@gemunion/types-collection";
import { IErc1155Token } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import ERC1155Marketplace from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC1155Marketplace.sol/ERC1155Marketplace.json";

interface IErc1155TokenSingleBuyButtonProps {
  token: IErc1155Token;
}

export const Erc1155TokenSingleBuyButton: FC<IErc1155TokenSingleBuyButtonProps> = props => {
  const { token } = props;

  const api = useApi();
  const { library } = useWeb3React();

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
      .then((json: IServerSignature) => {
        const contract = new Contract(
          process.env.ERC1155_MARKETPLACE_ADDR,
          ERC1155Marketplace.abi,
          library.getSigner(),
        );
        const nonce = utils.arrayify(json.nonce);
        const tokenPrice = utils.parseUnits(token.price, "wei");

        return contract.buyResources(
          nonce,
          token.erc1155Collection?.address.toLowerCase(),
          [token.tokenId],
          [1],
          process.env.ACCOUNT,
          json.signature,
          { value: tokenPrice },
        ) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBuy} data-testid="Erc1155TokenSingleBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
