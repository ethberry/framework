import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import {
  ExchangeType,
  IAssetComponentHistory,
  IContract,
  IExchangePurchaseLotteryEvent,
  TContractEventData,
} from "@framework/types";
import { byte32ToBool36Array } from "@ethberry/traits-v5";

import { AssetsView } from "../../../../../components/common/event-history-assets-view";
import {
  StyledDataViewAddressLinkWrapper,
  StyledDataViewItemContentWrapper,
  StyledDataViewItemWrapper,
  StyledDataViewWrapper,
} from "../styled";

export interface IPurchaseLotteryDataViewProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
  eventData: TContractEventData;
}

export const PurchaseLotteryDataView: FC<IPurchaseLotteryDataViewProps> = props => {
  const { assets, contract, eventData } = props;
  const { numbers } = eventData as IExchangePurchaseLotteryEvent;

  return (
    <StyledDataViewWrapper>
      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.numbers" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>
            {byte32ToBool36Array(numbers)
              .reduce((memo, current, i) => {
                if (current) {
                  memo.push(i);
                }
                return memo;
              }, [] as Array<number>)
              .join(", ")}
          </StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
      <AssetsView assets={assets} contract={contract} type={ExchangeType.PRICE} />
    </StyledDataViewWrapper>
  );
};
