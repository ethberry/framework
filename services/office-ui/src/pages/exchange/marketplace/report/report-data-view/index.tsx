import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { formatPriceHistory } from "@framework/exchange";
import { ExchangeEventType, IExchangePurchaseEvent, IMarketplaceReport } from "@framework/types";
import { AddressLink, TxHashLink } from "@ethberry/mui-scanner";

export interface IMarketplaceReportDataViewProps {
  row: IMarketplaceReport;
}

export const MarketplaceReportDataView: FC<IMarketplaceReportDataViewProps> = props => {
  const {
    row: { eventData, eventType, items, price, transactionHash },
  } = props;

  const purchaseEventData = eventData as IExchangePurchaseEvent;
  const itemAsset = items[0];

  switch (eventType) {
    case ExchangeEventType.Purchase:
      return (
        <Box sx={{ p: 2.5 }}>
          {/* FROM */}
          <Box sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.from`} />:
            </Typography>
            <Box sx={{ ml: 1 }}>
              <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                <AddressLink address={purchaseEventData.account} />
              </Box>
            </Box>
            <Box sx={{ ml: 1 }}>
              <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                <TxHashLink hash={transactionHash} />
              </Box>
            </Box>
          </Box>
          {/* ITEM */}
          <Box sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.token`} />:
            </Typography>
            <Box sx={{ ml: 1 }}>
              <Typography variant="body1">
                <Link
                  component={RouterLink}
                  to={`/${itemAsset?.token?.template?.contract?.contractType}/tokens/${itemAsset?.token?.id}`}
                >
                  #{itemAsset?.token?.tokenId}
                </Link>
              </Typography>
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
