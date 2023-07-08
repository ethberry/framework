import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";
import { utils } from "ethers";

import { ExchangeType, IAssetComponentHistory, IContract, ILevelUp, TContractEventData } from "@framework/types";

import { AssetsView } from "../../../../../components/common/event-history-assets-view";
import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
} from "../styled";

export interface IUpgradeDataViewProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
  eventData: TContractEventData;
}

export const UpgradeDataView: FC<IUpgradeDataViewProps> = props => {
  const { assets, contract, eventData } = props;
  const { attribute } = eventData as ILevelUp;

  return (
    <DataViewWrapper>
      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.attribute" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>{utils.toUtf8String(utils.stripZeros(attribute))}</DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
      <AssetsView assets={assets} contract={contract} type={ExchangeType.PRICE} />
    </DataViewWrapper>
  );
};
