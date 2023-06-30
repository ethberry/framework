import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { AddressLink } from "@gemunion/mui-scanner";
import { IErc1155TokenTransferBatchEvent, TContractEventData } from "@framework/types";

import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
} from "../styled";

export interface ITransferBatchDataViewProps {
  eventData: TContractEventData;
}

export const TransferBatchDataView: FC<ITransferBatchDataViewProps> = props => {
  const { eventData } = props;
  const { from, to, ids, values } = eventData as IErc1155TokenTransferBatchEvent;

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
          <FormattedMessage id="enums.eventDataLabel.ids" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>{ids.join(", ")}</DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.values" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>{values.join(", ")}</DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>
    </DataViewWrapper>
  );
};
