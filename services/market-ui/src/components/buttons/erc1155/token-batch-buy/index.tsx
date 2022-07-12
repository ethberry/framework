import { FC } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";
import { useFormContext } from "react-hook-form";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { ContractTemplate, ITemplate } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import MarketplaceSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Marketplace/Marketplace.sol/Marketplace.json";

interface IErc1155TokenSingleBuyButtonProps {
  rows: Array<ITemplate>;
}

export const Erc1155TokenBatchBuyButton: FC<IErc1155TokenSingleBuyButtonProps> = props => {
  const { rows } = props;

  const form = useFormContext<any>();
  const values: Record<string, number> = form.getValues();

  const api = useApi();
  const { provider } = useWeb3React();

  const handleBatchBuy = useMetamask(async () => {
    const totalTokenPrice = rows.map(token => {
      if (token.price?.components[0].contract?.contractTemplate === ContractTemplate.NATIVE) {
        return utils.parseUnits(token.price?.components[0].amount, "wei");
      }
      return constants.Zero;
    });
    let totalTokenValue = constants.Zero;
    let collection = "";
    let indx = 0;
    const tokenIds: Array<number> = [];
    const { erc1155TokenIds, amounts } = Object.entries(values).reduce(
      (memo, [tokenId, amount]) => {
        if (amount > 0) {
          const template = rows.find(template => template.tokens![0].tokenId === tokenId);
          memo.erc1155TokenIds.push(template!.id);
          memo.amounts.push(amount);
          tokenIds.push(~~template!.tokens![0].tokenId);
          totalTokenValue = totalTokenValue.add(totalTokenPrice[indx].mul(amount));
          indx++;
          collection = template!.contract!.address.toLowerCase();
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
        const contract = new Contract(process.env.MARKETPLACE_ADDR, MarketplaceSol.abi, provider?.getSigner());
        const nonce = utils.arrayify(json.nonce);
        return contract.buyResources(nonce, collection, tokenIds, amounts, process.env.ACCOUNT, json.signature, {
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
