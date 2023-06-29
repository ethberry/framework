import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { IAssetComponentHistory, IContract, IExchangePurchaseRaffleEvent, TContractEventData } from "@framework/types";

import { EventHistoryAssetsView } from "../../../../../components/common/event-history-assets-view";
import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
} from "../styled";

export interface IPurchaseRaffleDataViewProps {
  assets?: Array<IAssetComponentHistory>;
  contract?: IContract;
  eventData: TContractEventData;
}

export const PurchaseRaffleDataView: FC<IPurchaseRaffleDataViewProps> = props => {
  const { assets, contract, eventData } = props;
  const { externalId } = eventData as IExchangePurchaseRaffleEvent;

  return (
    <DataViewWrapper>
      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.externalId" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>{externalId}</DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      <DataViewItemWrapper>
        <EventHistoryAssetsView assets={assets} contract={contract} />
      </DataViewItemWrapper>
    </DataViewWrapper>
  );
};
