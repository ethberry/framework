import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { AddressLink } from "@gemunion/mui-scanner";
import { TContractEventData } from "@framework/types";

import {
  StyledDataViewAddressLinkWrapper,
  StyledDataViewItemContentWrapper,
  StyledDataViewItemWrapper,
  StyledDataViewWrapper,
} from "../styled";

export interface IDefaultDataViewProps {
  eventData: TContractEventData;
}

export const DefaultDataView: FC<IDefaultDataViewProps> = props => {
  const { eventData } = props;

  return (
    <StyledDataViewWrapper>
      {Object.keys(eventData).map((key: string) => {
        // @ts-ignore
        let value = eventData[key];
        const showRaw = typeof value === "number" || typeof value === "string";
        if (!showRaw) {
          value = JSON.stringify(value);
        }

        return (
          <StyledDataViewItemWrapper key={key}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.${key}`} />:
            </Typography>
            <StyledDataViewItemContentWrapper>
              {key === "from" || key === "to" ? (
                <StyledDataViewAddressLinkWrapper>
                  <AddressLink address={value} />
                </StyledDataViewAddressLinkWrapper>
              ) : (
                <Typography variant="body1">{value}</Typography>
              )}
            </StyledDataViewItemContentWrapper>
          </StyledDataViewItemWrapper>
        );
      })}
    </StyledDataViewWrapper>
  );
};
