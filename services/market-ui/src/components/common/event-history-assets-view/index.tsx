import { FC } from "react";
import { Box } from "@mui/material";

import { ExchangeType, IAssetComponentHistory, IContract } from "@framework/types";

import { AssetsView } from "./view";

export interface IEventHistoryAssetsViewProps {
  assets?: IAssetComponentHistory[];
  contract?: IContract;
}

export const EventHistoryAssetsView: FC<IEventHistoryAssetsViewProps> = props => {
  const { assets, contract } = props;

  const items = assets?.filter(({ exchangeType }) => exchangeType === ExchangeType.ITEM);
  const prices = assets?.filter(({ exchangeType }) => exchangeType === ExchangeType.PRICE);

  return (
    <Box>
      {items?.length ? <AssetsView assets={items} contract={contract} title={ExchangeType.ITEM} /> : null}
      {prices?.length ? <AssetsView assets={prices} contract={contract} title={ExchangeType.PRICE} /> : null}
    </Box>
  );
};
