import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { ExchangeStatus, IExchange } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Craft/ERC1155ERC1155Craft.sol/ERC1155ERC1155Craft.json";

export interface IExchangeButtonProps {
  recipe: IExchange;
}

export const ExchangeUploadButton: FC<IExchangeButtonProps> = props => {
  const { recipe } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaLoadRecipe = useMetamask((exchange: IExchange) => {
    if (exchange.exchangeStatus !== ExchangeStatus.NEW) {
      return Promise.reject(new Error(""));
    }

    // TODO check one contract for ingredients
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, library.getSigner());

    return contract.createRecipe(exchange.id, exchange.ingredients.components) as Promise<void>;
  });

  const handleLoadRecipe = (recipe: IExchange): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRecipe = useMetamask((recipe: IExchange) => {
    let exchangeStatus: boolean;
    if (recipe.exchangeStatus === ExchangeStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(""));
    } else {
      exchangeStatus = recipe.exchangeStatus !== ExchangeStatus.ACTIVE;
    }

    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, library.getSigner());
    return contract.updateRecipe(recipe.id, exchangeStatus) as Promise<void>;
  });

  const handleToggleRecipe = (recipe: IExchange): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  if (recipe.exchangeStatus === ExchangeStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.erc1155-recipes.upload" })}>
        <IconButton onClick={handleLoadRecipe(recipe)} data-testid="ExchangeUploadButton">
          <CloudUpload />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={formatMessage({
        id:
          recipe.exchangeStatus === ExchangeStatus.ACTIVE
            ? "pages.erc1155-recipes.deactivate"
            : "pages.erc1155-recipes.activate",
      })}
    >
      <IconButton onClick={handleToggleRecipe(recipe)} data-testid="ExchangeToggleButton">
        {recipe.exchangeStatus === ExchangeStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};
