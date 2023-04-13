import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Typography } from "@mui/material";

import { ContractEventType, ExchangeType, IEventHistory } from "@framework/types";

import { formatEther } from "../../../../utils/money";

export interface IEventDataViewProps {
  row: IEventHistory;
}

export const EventDataView: FC<IEventDataViewProps> = props => {
  const {
    row: { assets, contract, eventData, eventType },
  } = props;

  switch (eventType) {
    case ContractEventType.Claim:
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
                  {key === "items" && assets?.length ? (
                    assets.map(asset => (
                      <Box key={asset.id}>
                        <Typography variant="body1">
                          {asset.token?.template?.title} - {asset.amount}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body1">{showRaw ? value : JSON.stringify(value)}</Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    case ContractEventType.Lend:
    case ContractEventType.Purchase:
      return (
        <Box sx={{ p: 2.5 }}>
          {Object.keys(eventData).map((key: string) => {
            // @ts-ignore
            const value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";

            const itemAsset = assets?.find(({ exchangeType }) => exchangeType === ExchangeType.ITEM);
            const priceAsset = assets?.find(({ exchangeType }) => exchangeType === ExchangeType.PRICE);

            return (
              <Box key={key} sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
                <Typography fontWeight={500}>
                  <FormattedMessage id={`enums.eventDataLabel.${key}`} />:
                </Typography>
                <Box sx={{ ml: 1 }}>
                  {key === "item" ? (
                    <Box>
                      <Typography variant="body1">
                        {itemAsset?.token?.template?.title} - {itemAsset?.amount}
                      </Typography>
                    </Box>
                  ) : key === "price" ? (
                    <Box>
                      <Typography variant="body1">
                        {priceAsset?.token?.template?.title} -{" "}
                        {formatEther(
                          priceAsset?.amount,
                          priceAsset?.token?.template?.contract?.decimals,
                          priceAsset?.token?.template?.contract?.symbol,
                        )}
                      </Typography>
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
    case ContractEventType.Transfer:
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
                  <Typography variant="body1">{showRaw ? value : JSON.stringify(value)}</Typography>
                </Box>
              </Box>
            );
          })}
          {contract?.title && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, "&:last-of-type": { mb: 0 } }}>
              <Typography fontWeight={500}>
                <FormattedMessage id="enums.eventDataLabel.contract" />:
              </Typography>
              <Box sx={{ ml: 1 }}>
                <Typography variant="body1">{contract?.title}</Typography>
              </Box>
            </Box>
          )}
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
                  <Typography variant="body1">{showRaw ? value : JSON.stringify(value)}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    }
  }
};
