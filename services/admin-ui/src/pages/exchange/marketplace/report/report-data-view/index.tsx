import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Typography } from "@mui/material";

import { IToken, ContractEventType, ExchangeType } from "@framework/types";
import { formatEther } from "../../../../../utils/money";

export interface IEventDataViewProps {
  row: IToken;
}

// TODO add transactionHash ScannerLink
export const ReportDataView: FC<IEventDataViewProps> = props => {
  const {
    row: { exchange },
  } = props;
  const { assets, eventData, eventType } = exchange![0].history!;

  switch (eventType) {
    case ContractEventType.Purchase:
      return (
        <Box sx={{ p: 2.5 }}>
          {Object.keys(eventData).map((key: string) => {
            // @ts-ignore
            const value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";

            const priceAsset = assets?.find(({ exchangeType }) => exchangeType === ExchangeType.PRICE);

            return (
              <Box key={key} sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
                <Typography fontWeight={500}>
                  <FormattedMessage id={`enums.eventDataLabel.${key}`} />:
                </Typography>
                <Box sx={{ ml: 1 }}>
                  {key === "price" ? (
                    <Box>
                      <Typography variant="body1">
                        {priceAsset?.token?.template?.title} -{" "}
                        {formatEther(priceAsset?.amount, priceAsset?.contract!.decimals, priceAsset?.contract!.symbol)}
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
