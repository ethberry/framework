import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { AddressLink } from "@gemunion/mui-scanner";
import type {
  IContract,
  IErc20TokenTransferEvent,
  IERC721TokenTransferEvent,
  TContractEventData,
} from "@framework/types";

import {
  StyledDataViewAddressLinkWrapper,
  StyledDataViewItemContentWrapper,
  StyledDataViewItemWrapper,
  StyledDataViewWrapper,
} from "../styled";
import { formatEther } from "../../../../../utils/money";

export interface ITransferDataViewProps {
  contract?: IContract;
  eventData: TContractEventData;
}

export const TransferDataView: FC<ITransferDataViewProps> = props => {
  const { contract, eventData } = props;
  const { from, to } = eventData as IErc20TokenTransferEvent | IERC721TokenTransferEvent;

  const { value = null } = eventData as IErc20TokenTransferEvent;
  const { tokenId = null } = eventData as IERC721TokenTransferEvent;

  return (
    <StyledDataViewWrapper>
      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.from" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>
            <AddressLink address={from} />
          </StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.to" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>
            <AddressLink address={to} />
          </StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      {tokenId && (
        <StyledDataViewItemWrapper>
          <Typography fontWeight={500}>
            <FormattedMessage id="enums.eventDataLabel.tokenId" />:
          </Typography>
          <StyledDataViewItemContentWrapper>
            <StyledDataViewAddressLinkWrapper>#{tokenId}</StyledDataViewAddressLinkWrapper>
          </StyledDataViewItemContentWrapper>
        </StyledDataViewItemWrapper>
      )}

      {value && (
        <StyledDataViewItemWrapper>
          <Typography fontWeight={500}>
            <FormattedMessage id="enums.eventDataLabel.value" />:
          </Typography>
          <StyledDataViewItemContentWrapper>
            <StyledDataViewAddressLinkWrapper>
              {formatEther(value, contract?.decimals, contract?.symbol)}
            </StyledDataViewAddressLinkWrapper>
          </StyledDataViewItemContentWrapper>
        </StyledDataViewItemWrapper>
      )}
    </StyledDataViewWrapper>
  );
};
