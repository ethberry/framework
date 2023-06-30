import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { AddressLink } from "@gemunion/mui-scanner";
import { IContract, IErc20TokenTransferEvent, IERC721TokenTransferEvent, TContractEventData } from "@framework/types";

import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
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
    <DataViewWrapper>
      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.from" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>
            <AddressLink address={from} />
          </DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.to" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>
            <AddressLink address={to} />
          </DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      {tokenId && (
        <DataViewItemWrapper>
          <Typography fontWeight={500}>
            <FormattedMessage id="enums.eventDataLabel.tokenId" />:
          </Typography>
          <DataViewItemContentWrapper>
            <DataViewAddressLinkWrapper>#{tokenId}</DataViewAddressLinkWrapper>
          </DataViewItemContentWrapper>
        </DataViewItemWrapper>
      )}

      {value && (
        <DataViewItemWrapper>
          <Typography fontWeight={500}>
            <FormattedMessage id="enums.eventDataLabel.value" />:
          </Typography>
          <DataViewItemContentWrapper>
            <DataViewAddressLinkWrapper>
              {formatEther(value, contract?.decimals, contract?.symbol)}
            </DataViewAddressLinkWrapper>
          </DataViewItemContentWrapper>
        </DataViewItemWrapper>
      )}
    </DataViewWrapper>
  );
};
