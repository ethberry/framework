import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import type { IContract, IOwnershipTransferredEvent, TContractEventData } from "@framework/types";
import { AddressLink } from "@gemunion/mui-scanner";

import {
  StyledDataViewAddressLinkWrapper,
  StyledDataViewItemContentWrapper,
  StyledDataViewItemWrapper,
  StyledDataViewWrapper,
} from "../styled";

export interface IOwnershipTransferredDataViewProps {
  contract: IContract;
  eventData: TContractEventData;
}

export const OwnershipTransferredDataView: FC<IOwnershipTransferredDataViewProps> = props => {
  const { contract, eventData } = props;
  const { previousOwner, newOwner } = eventData as IOwnershipTransferredEvent;

  return (
    <StyledDataViewWrapper>
      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.from" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>
            <AddressLink address={previousOwner} />
          </StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      <StyledDataViewItemWrapper>
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.to" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>
            <AddressLink address={newOwner} />
          </StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      <StyledDataViewItemWrapper key="0">
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.contract" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <StyledDataViewAddressLinkWrapper>
            <AddressLink address={contract.address} />
          </StyledDataViewAddressLinkWrapper>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>

      <StyledDataViewItemWrapper key="2">
        <Typography fontWeight={500}>
          <FormattedMessage id="enums.eventDataLabel.contractModule" />:
        </Typography>
        <StyledDataViewItemContentWrapper>
          <Typography fontSize={16} fontWeight={400} lineHeight="24px">
            {contract.contractModule}
          </Typography>
        </StyledDataViewItemContentWrapper>
      </StyledDataViewItemWrapper>
    </StyledDataViewWrapper>
  );
};
