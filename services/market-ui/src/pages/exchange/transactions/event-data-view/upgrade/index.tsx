import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";
import { utils } from "ethers";

import {
  ExchangeType,
  IAssetComponentHistory,
  IContract,
  IExchangeGradeEvent,
  TContractEventData,
} from "@framework/types";

import { AssetsView } from "../../../../../components/common/event-history-assets-view";
import {
  StyledDataViewAddressLinkWrapper,
  StyledDataViewItemContentWrapper,
  StyledDataViewItemWrapper,
  StyledDataViewWrapper,
} from "../styled";

export interface IUpgradeDataViewProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
  eventData: TContractEventData;
}

export const UpgradeDataView: FC<IUpgradeDataViewProps> = props => {
  const { assets, contract, eventData } = props;
  const { attribute, level } = eventData as IExchangeGradeEvent;

  return (
    <StyledDataViewWrapper>
      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.attribute" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>
            {attribute ? utils.toUtf8String(utils.stripZeros(attribute)) : ""}
          </StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>
      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.value" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>{level || ""}</StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      <AssetsView assets={assets} contract={contract} type={ExchangeType.ITEM} />
      <AssetsView assets={assets} contract={contract} type={ExchangeType.PRICE} />
    </StyledDataViewWrapper>
  );
};
