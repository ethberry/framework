import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { ExchangeStatus, IRecipe } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

export interface IExchangeButtonProps {
  rule: IRecipe;
}

export const ExchangeUploadButton: FC<IExchangeButtonProps> = props => {
  const { rule } = props;

  const { formatMessage } = useIntl();

  const { provider } = useWeb3React();

  const metaLoadRecipe = useMetamask((exchange: IRecipe) => {
    if (exchange.exchangeStatus !== ExchangeStatus.NEW) {
      return Promise.reject(new Error(""));
    }

    // TODO check one contract for ingredients
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, provider?.getSigner());

    return contract.createRecipe(exchange.id, exchange.ingredients.components) as Promise<void>;
  });

  const handleLoadRecipe = (recipe: IRecipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRecipe = useMetamask((recipe: IRecipe) => {
    let exchangeStatus: boolean;
    if (recipe.exchangeStatus === ExchangeStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(""));
    } else {
      exchangeStatus = recipe.exchangeStatus !== ExchangeStatus.ACTIVE;
    }

    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, provider?.getSigner());
    return contract.updateRecipe(recipe.id, exchangeStatus) as Promise<void>;
  });

  const handleToggleRecipe = (recipe: IRecipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  if (rule.exchangeStatus === ExchangeStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.exchange-rules.upload" })}>
        <IconButton onClick={handleLoadRecipe(rule)} data-testid="ExchangeUploadButton">
          <CloudUpload />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={formatMessage({
        id:
          rule.exchangeStatus === ExchangeStatus.ACTIVE
            ? "pages.exchange-rules.deactivate"
            : "pages.exchange-rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRecipe(rule)} data-testid="ExchangeToggleButton">
        {rule.exchangeStatus === ExchangeStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};
