import { FC } from "react";

import { ExchangeType, IAssetComponentHistory, IContract } from "@framework/types";

import { AssetsView } from "../../../../../components/common/event-history-assets-view/view";
import { DataViewWrapper } from "../styled";

export interface IPurchaseDataViewProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
}

export const PurchaseDataView: FC<IPurchaseDataViewProps> = props => {
  const { assets, contract } = props;

  return (
    <DataViewWrapper>
      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
      <AssetsView assets={assets} contract={contract} type={ExchangeType.PRICE} />
    </DataViewWrapper>
  );
};
