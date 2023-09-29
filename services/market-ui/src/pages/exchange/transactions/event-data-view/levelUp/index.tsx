import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";
import { utils } from "ethers";

import {
  ExchangeType,
  // IAssetComponentHistory,
  IContract,
  ILevelUp,
  IToken,
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
  // assets: Array<IAssetComponentHistory>;
  contract: IContract;
  eventData: TContractEventData;
  token: IToken;
}

export const LevelUpDataView: FC<IUpgradeDataViewProps> = props => {
  const { token, contract, eventData } = props;
  const { attribute, value } = eventData as ILevelUp;
  const itemAsset = {
    historyId: 0,
    id: 0,
    contractId: token.template!.contractId,
    exchangeType: ExchangeType.ITEM,
    amount: "1",
    token,
    tokenId: token.id,
  };

  return (
    <StyledDataViewWrapper>
      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.attribute" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>
            {utils.toUtf8String(utils.stripZeros(attribute))}
          </StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>
      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.value" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>{value}</StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      <AssetsView assets={[itemAsset]} contract={contract} type={ExchangeType.ITEM} />
      {/* <AssetsView assets={assets} contract={contract} type={ExchangeType.PRICE} /> */}
    </StyledDataViewWrapper>
  );
};
