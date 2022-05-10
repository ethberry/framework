import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { constants, ethers } from "ethers";
import { FormattedMessage } from "react-intl";
import { useFormikContext } from "formik";

import { useApi } from "@gemunion/provider-api";
import { IErc1155Token, IMarketplaceSignature } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import MarketplaceERC1155 from "@framework/binance-contracts/artifacts/contracts/Marketplace/MarketplaceERC1155.sol/MarketplaceERC1155.json";

interface IErc1155TokenSingleBuyButtonProps {
  rows: Array<IErc1155Token>;
}

export const Erc1155TokenBatchBuyButton: FC<IErc1155TokenSingleBuyButtonProps> = props => {
  const { rows } = props;

  const formik = useFormikContext<any>();
  const values: Record<string, number> = formik.values;

  const api = useApi();
  const { library } = useWeb3React();

  const handleBatchBuy = useMetamask(async () => {
    const tokenPricesEth = rows.map(token => ethers.utils.parseUnits(token.price, "wei"));
    let totalTokenValue = constants.Zero;
    let collection = "";
    let indx = 0;
    const { erc1155TokenIds, amounts } = Object.entries(values).reduce(
      (memo, [tokenId, amount]) => {
        if (amount > 0) {
          const token = rows.find(token => token.tokenId === tokenId);
          memo.erc1155TokenIds.push(token!.id);
          memo.amounts.push(amount);
          totalTokenValue = totalTokenValue.add(tokenPricesEth[indx].mul(amount));
          indx++;
          collection = token!.erc1155Collection!.address.toLowerCase();
        }
        return memo;
      },
      { erc1155TokenIds: [], amounts: [] } as { erc1155TokenIds: Array<number>; amounts: Array<number> },
    );
    return api
      .fetchJson({
        url: "/erc1155-marketplace/sign-token",
        method: "POST",
        data: {
          erc1155TokenIds,
          amounts,
        },
      })
      .then((json: IMarketplaceSignature) => {
        const contract = new ethers.Contract(
          process.env.ERC1155_MARKETPLACE_ADDR,
          MarketplaceERC1155.abi,
          library.getSigner(),
        );
        const nonce = ethers.utils.arrayify(json.nonce);
        console.log("nonce", nonce);
        console.log("collection", collection);
        console.log("erc1155TokenIds", erc1155TokenIds);
        console.log("amounts", amounts);
        console.log("totalTokenPrice", totalTokenValue);
        return contract.buyResources(nonce, collection, erc1155TokenIds, amounts, process.env.ACCOUNT, json.signature, {
          value: totalTokenValue,
        }) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBatchBuy} data-testid="Erc1155TokenBatchBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
