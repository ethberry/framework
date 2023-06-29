import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { IAssetComponentHistory, IContract } from "@framework/types";

import { EventHistoryAssetsView } from "../../../../../components/common/event-history-assets-view";
import { ContractEventType } from "../../form";
import { DataViewItemWrapper, DataViewWrapper } from "../styled";

export interface ICraftDataViewProps {
  assets?: Array<IAssetComponentHistory>;
  contract?: IContract;
}

export const CraftDataView: FC<ICraftDataViewProps> = props => {
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
