import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Typography } from "@mui/material";

import { ContractEventType, IEventHistoryReport, IExchangePurchaseEvent } from "@framework/types";
import { formatPriceHistory } from "../../../../../utils/money";
import { AddressLink } from "@gemunion/mui-scanner";

export interface IEventDataViewProps {
  row: IEventHistoryReport;
}

// TODO add transactionHash ScannerLink
export const ReportDataView: FC<IEventDataViewProps> = props => {
  const {
    row: { eventData, eventType, items, price },
  } = props;

  const purchaseEventData = eventData as IExchangePurchaseEvent;
  const itemAsset = items[0];

  switch (eventType) {
    case ContractEventType.Purchase:
      return (
        <Box sx={{ p: 2.5 }}>
          {/* FROM */}
          <Box sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.from`} />:
            </Typography>
            <Box sx={{ ml: 1 }}>
              <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                <AddressLink address={purchaseEventData.from} />
              </Box>
            </Box>
          </Box>
          {/* ITEM */}
          <Box sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.token`} />:
            </Typography>
            <Box sx={{ ml: 1 }}>
              <Box>
                <Typography variant="body1">{itemAsset?.token?.tokenId}</Typography>
              </Box>
            </Box>
          </Box>
          {/* ITEM */}
          <Box sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.item`} />:
            </Typography>
            <Box sx={{ ml: 1 }}>
              <Box>
                <Typography variant="body1">{formatPriceHistory(items)}</Typography>
              </Box>
            </Box>
          </Box>
          {/* PRICE */}
          <Box sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.price`} />:
            </Typography>
            <Box sx={{ ml: 1 }}>
              <Box>
                <Typography variant="body1">{formatPriceHistory(price)}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    default: {
      return (
        <Box sx={{ p: 2.5 }}>
          {Object.keys(eventData).map((key: string) => {
            // @ts-ignore
            const value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";

            return (
              <Box key={key} sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
                <Typography fontWeight={500}>
                  <FormattedMessage id={`enums.eventDataLabel.${key}`} />:
                </Typography>
                <Box sx={{ ml: 1 }}>
                  {key === "from" || key === "to" ? (
                    <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                      <AddressLink address={value} />
                    </Box>
                  ) : (
                    <Typography variant="body1">{showRaw ? value : JSON.stringify(value)}</Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    }
  }
};
