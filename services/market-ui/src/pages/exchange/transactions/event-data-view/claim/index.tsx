import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { IAssetComponentHistory, IContract } from "@framework/types";

import { EventHistoryAssetsView } from "../../../../../components/common/event-history-assets-view";
import { DataViewItemWrapper, DataViewWrapper } from "../styled";

export interface IClaimDataViewProps {
  assets?: Array<IAssetComponentHistory>;
  contract?: IContract;
}

export const ClaimDataView: FC<IClaimDataViewProps> = props => {
  const { assets, contract } = props;

  return (
    <DataViewWrapper>
      <DataViewItemWrapper>
        {assets?.length ? (
          <EventHistoryAssetsView assets={assets} contract={contract} />
        ) : (
          <FormattedMessage id="enums.eventDataLabel.noData" />
        )}
      </DataViewItemWrapper>
    </DataViewWrapper>
  );
};
