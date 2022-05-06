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
    const value = constants.Zero;
    const { erc1155TokenIds, amounts } = Object.entries(values).reduce(
      (memo, [tokenId, amount]) => {
        if (amount > 0) {
          memo.erc1155TokenIds.push(tokenId);
          memo.amounts.push(amount);
          const token = rows.find(token => token.tokenId === tokenId);
          value.add(token!.price);
        }
        return memo;
      },
      { erc1155TokenIds: [], amounts: [] } as { erc1155TokenIds: Array<string>; amounts: Array<number> },
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
          process.env.MARKETPLACE_ERC1155_ADDR,
          MarketplaceERC1155.abi,
          library.getSigner(),
        );
        return contract.buyResources(erc1155TokenIds, amounts, json.signature) as Promise<void>;
      });
  });

  return (
    <Button onClick={handleBatchBuy} data-testid="Erc1155TokenBatchBuyButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};
