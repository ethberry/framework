import { FC } from "react";

import { ExchangeType, IAssetComponentHistory, IContract } from "@framework/types";

import { AssetsView } from "../../../../../components/common/event-history-assets-view";
import { StyledDataViewWrapper } from "../styled";

export interface ICraftDataViewProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
}

export const CraftDataView: FC<ICraftDataViewProps> = props => {
  const { assets, contract } = props;
  console.log("assets", assets);
  return (
    <StyledDataViewWrapper>
      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
      <AssetsView assets={assets} contract={contract} type={ExchangeType.PRICE} />
    </StyledDataViewWrapper>
  );
};
