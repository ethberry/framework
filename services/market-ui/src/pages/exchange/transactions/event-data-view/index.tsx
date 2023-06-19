import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Typography } from "@mui/material";
import { formatDistance } from "date-fns";

import { ContractEventType, ExchangeType, IEventHistory } from "@framework/types";
import { AddressLink } from "@gemunion/mui-scanner";

import { formatEther } from "../../../../utils/money";

export interface IEventDataViewProps {
  row: IEventHistory;
}

export const EventDataView: FC<IEventDataViewProps> = props => {
  const {
    row: { assets, contract, createdAt, eventData, eventType },
  } = props;

  switch (eventType) {
    case ContractEventType.Claim:
      return (
        <Box sx={{ p: 2.5 }}>
          {Object.keys(eventData).map((key: string) => {
            // @ts-ignore
            let value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";
            if (!showRaw) {
              value = JSON.stringify(value);
            }

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
                  ) : key === "from" || key === "to" ? (
                    <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                      <AddressLink address={value} />
                    </Box>
                  ) : (
                    <Typography variant="body1">{value}</Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    case ContractEventType.WaitListRewardClaimed:
      return (
        <Box sx={{ p: 2.5 }}>
          {Object.keys(eventData).map((key: string) => {
            // @ts-ignore
            let value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";
            if (!showRaw) {
              value = JSON.stringify(value);
            }

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
                  ) : key === "from" || key === "to" ? (
                    <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                      <AddressLink address={value} />
                    </Box>
                  ) : (
                    <Typography variant="body1">{value}</Typography>
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
            let value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";
            if (!showRaw) {
              value = JSON.stringify(value);
            }

            if (key === "expires") {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              value = formatDistance(new Date(createdAt).getTime() + value, Date.now(), { addSuffix: true });
            }

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
                  ) : key === "from" || key === "to" ? (
                    <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                      <AddressLink address={value} />
                    </Box>
                  ) : (
                    <Typography variant="body1">{value}</Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    case ContractEventType.Upgrade:
      return (
        <Box sx={{ p: 2.5 }}>
          {Object.keys(eventData).map((key: string) => {
            // @ts-ignore
            let value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";
            if (!showRaw) {
              value = JSON.stringify(value);
            }

            if (key === "expires") {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              value = formatDistance(new Date(createdAt).getTime() + value, Date.now(), { addSuffix: true });
            }

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
                  ) : key === "from" || key === "to" ? (
                    <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                      <AddressLink address={value} />
                    </Box>
                  ) : (
                    <Typography variant="body1">{value}</Typography>
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
            let value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";
            if (!showRaw) {
              value = JSON.stringify(value);
            }

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
                    <Typography variant="body1">{value}</Typography>
                  )}
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
            let value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";
            if (!showRaw) {
              value = JSON.stringify(value);
            }

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
                    <Typography variant="body1">{value}</Typography>
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
