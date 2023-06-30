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
import { byte32ToBoolArray } from "@framework/traits-ui";

import { AssetsView } from "../../../../../components/common/event-history-assets-view";
import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
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
    <DataViewWrapper>
      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.numbers" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>
            {byte32ToBoolArray(numbers)
              .reduce((memo, current, i) => {
                if (current) {
                  memo.push(i);
                }
                return memo;
              }, [] as Array<number>)
              .join(", ")}
          </DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
      <AssetsView assets={assets} contract={contract} type={ExchangeType.PRICE} />
    </DataViewWrapper>
  );
};
