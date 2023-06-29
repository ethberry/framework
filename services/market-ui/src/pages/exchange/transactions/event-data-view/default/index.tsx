import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { AddressLink } from "@gemunion/mui-scanner";
import { TContractEventData } from "@framework/types";

import {
  DataViewAddressLinkWrapper,
  DataViewItemContentWrapper,
  DataViewItemWrapper,
  DataViewWrapper,
} from "../styled";

export interface IDefaultDataViewProps {
  eventData: TContractEventData;
}

export const DefaultDataView: FC<IDefaultDataViewProps> = props => {
  const { eventData } = props;

  return (
    <DataViewWrapper>
      {Object.keys(eventData).map((key: string) => {
        // @ts-ignore
        let value = eventData[key];
        const showRaw = typeof value === "number" || typeof value === "string";
        if (!showRaw) {
          value = JSON.stringify(value);
        }

        return (
          <DataViewItemWrapper key={key}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.${key}`} />:
            </Typography>
            <DataViewItemContentWrapper>
              {key === "from" || key === "to" ? (
                <DataViewAddressLinkWrapper sx={{}}>
                  <AddressLink address={value} />
                </DataViewAddressLinkWrapper>
              ) : (
                <Typography variant="body1">{value}</Typography>
              )}
            </DataViewItemContentWrapper>
          </DataViewItemWrapper>
        );
      })}
    </DataViewWrapper>
  );
};
