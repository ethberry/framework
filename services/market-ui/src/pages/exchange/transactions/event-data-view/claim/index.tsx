import { FC } from "react";

import { ExchangeType, IAssetComponentHistory, IContract } from "@framework/types";
import { DataViewItemWrapper, DataViewWrapper } from "../styled";
import { AssetsView } from "../../../../../components/common/event-history-assets-view/view";

export interface IClaimDataViewProps {
  assets?: Array<IAssetComponentHistory>;
  contract?: IContract;
}

export const ClaimDataView: FC<IClaimDataViewProps> = props => {
  const { assets, contract } = props;

  return (
    <DataViewWrapper>
      <DataViewItemWrapper>
        {<AssetsView assets={assets} contract={contract} title={ExchangeType.ITEM} />}
      </DataViewItemWrapper>
    </DataViewWrapper>
  );
};
