import { FC } from "react";

import { ExchangeType, IAssetComponentHistory, IContract } from "@framework/types";

import { AssetsView } from "../../../../../components/common/event-history-assets-view";
import { DataViewWrapper } from "../styled";

export interface IClaimDataViewProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
}

export const ClaimDataView: FC<IClaimDataViewProps> = props => {
  const { assets, contract } = props;

  return (
    <DataViewWrapper>
      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
    </DataViewWrapper>
  );
};
