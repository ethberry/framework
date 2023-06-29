import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";
import { utils } from "ethers";

import { IAssetComponentHistory, IContract, ILevelUp, TContractEventData } from "@framework/types";

import { EventHistoryAssetsView } from "../../../../../components/common/event-history-assets-view";
import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
} from "../styled";

export interface IUpgradeDataViewProps {
  assets?: Array<IAssetComponentHistory>;
  contract?: IContract;
  createdAt: string;
  eventData: TContractEventData;
}

// item; attribute - toUtf8String(stripZerosLeft(tokenAttribute)); price

export const UpgradeDataView: FC<IUpgradeDataViewProps> = props => {
  const { assets, contract, eventData } = props;
  const { attribute: tokenAttribute } = eventData as ILevelUp;

  const attribute = utils.toUtf8String(utils.stripZeros(tokenAttribute));

  return (
    <DataViewWrapper>
      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.attribute" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>
            <FormattedMessage id={`enums.attributeName.${attribute}`} />
          </DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      <DataViewItemWrapper>
        <EventHistoryAssetsView assets={assets} contract={contract} />
      </DataViewItemWrapper>
    </DataViewWrapper>
  );
};
