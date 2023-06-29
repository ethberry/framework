import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { IContract, IOwnershipTransferredEvent, TContractEventData } from "@framework/types";
import { AddressLink } from "@gemunion/mui-scanner";

import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
} from "../styled";

export interface IOwnershipTransferredDataViewProps {
  contract?: IContract;
  eventData: TContractEventData;
}

export const OwnershipTransferredDataView: FC<IOwnershipTransferredDataViewProps> = props => {
  const { contract, eventData } = props;
  const { previousOwner, newOwner } = eventData as IOwnershipTransferredEvent;

  return (
    <DataViewWrapper>
      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.from" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>
            <AddressLink address={previousOwner} />
          </DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      <DataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.to" />:
        </Typography>
        <DataViewItemContentWrapper>
          <DataViewAddressLinkWrapper>
            <AddressLink address={newOwner} />
          </DataViewAddressLinkWrapper>
        </DataViewItemContentWrapper>
      </DataViewItemWrapper>

      {contract
        ? [
            <DataViewItemWrapper key="0">
              <Typography fontWeight={500}>
                <FormattedMessage id="enums.eventDataLabel.contract" />:
              </Typography>
              <DataViewItemContentWrapper>
                <DataViewAddressLinkWrapper>
                  <AddressLink address={contract.address} />
                </DataViewAddressLinkWrapper>
              </DataViewItemContentWrapper>
            </DataViewItemWrapper>,
            <DataViewItemWrapper key="2">
              <Typography fontWeight={500}>
                <FormattedMessage id="enums.eventDataLabel.contractModule" />:
              </Typography>
              <DataViewItemContentWrapper>
                <Typography fontSize={16} fontWeight={400} lineHeight="24px">
                  {contract.contractModule}
                </Typography>
              </DataViewItemContentWrapper>
            </DataViewItemWrapper>,
          ]
        : null}
    </DataViewWrapper>
  );
};
