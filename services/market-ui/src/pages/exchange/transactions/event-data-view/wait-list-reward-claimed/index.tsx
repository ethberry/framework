import { FC } from "react";

import { ExchangeType, IAssetComponentHistory, IContract } from "@framework/types";

import { AssetsView } from "../../../../../components/common/event-history-assets-view";
import { StyledDataViewWrapper } from "../styled";

export interface IWaitListRewardClaimedDataViewProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
}

export const WaitListRewardClaimedDataView: FC<IWaitListRewardClaimedDataViewProps> = props => {
  const { assets, contract } = props;

  return (
    <StyledDataViewWrapper>
      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
    </StyledDataViewWrapper>
  );
};
