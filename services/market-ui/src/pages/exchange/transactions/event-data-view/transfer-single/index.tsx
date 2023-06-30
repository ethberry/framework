import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { AddressLink } from "@gemunion/mui-scanner";
import { IErc1155TokenTransferSingleEvent, TContractEventData } from "@framework/types";

import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
} from "../styled";

export interface ITransferSingleDataViewProps {
  eventData: TContractEventData;
}

export const TransferSingleDataView: FC<ITransferSingleDataViewProps> = props => {
  const { eventData } = props;
  const { from, to, id, value } = eventData as IErc1155TokenTransferSingleEvent;

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

      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.id" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>{id}</DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.value" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>{value}</DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>
    </DataViewWrapper>
  );
};
