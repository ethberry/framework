import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import {
  ExchangeType,
  IAssetComponentHistory,
  IContract,
  IExchangePurchaseRaffleEvent,
  TContractEventData,
} from "@framework/types";

import { AssetsView } from "../../../../../components/common/event-history-assets-view";
import {
  StyledDataViewAddressLinkWrapper,
  StyledDataViewItemContentWrapper,
  StyledDataViewItemWrapper,
  StyledDataViewWrapper,
} from "../styled";

export interface IPurchaseRaffleDataViewProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
  eventData: TContractEventData;
}

export const PurchaseRaffleDataView: FC<IPurchaseRaffleDataViewProps> = props => {
  const { assets, contract, eventData } = props;
  const { externalId } = eventData as IExchangePurchaseRaffleEvent;

  return (
    <StyledDataViewWrapper>
      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.externalId" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>{externalId}</StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
      <AssetsView assets={assets} contract={contract} type={ExchangeType.PRICE} />
    </StyledDataViewWrapper>
  );
};
