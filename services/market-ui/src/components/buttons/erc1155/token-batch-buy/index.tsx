import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";
import { useFormContext } from "react-hook-form";

import { useApi } from "@gemunion/provider-api";
import { IServerSignature } from "@gemunion/types-collection";
import { IErc1155Token } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC1155Marketplace from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC1155Marketplace.sol/ERC1155Marketplace.json";

interface IErc1155TokenSingleBuyButtonProps {
  rows: Array<IErc1155Token>;
}

export const Erc1155TokenBatchBuyButton: FC<IErc1155TokenSingleBuyButtonProps> = props => {
  const { rows } = props;

  const form = useFormContext<any>();
  const values: Record<string, number> = form.getValues();

  const api = useApi();
  const { library } = useWeb3React();

  const handleBatchBuy = useMetamask(async () => {
    const tokenPricesEth = rows.map(token => utils.parseUnits(token.price, "wei"));
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
      .then((json: IServerSignature) => {
        const contract = new Contract(
          process.env.ERC1155_MARKETPLACE_ADDR,
          ERC1155Marketplace.abi,
          library.getSigner(),
        );
        const nonce = utils.arrayify(json.nonce);
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
