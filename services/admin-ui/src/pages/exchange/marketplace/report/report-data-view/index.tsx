import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Typography } from "@mui/material";

import { ContractEventType, IEventHistoryReport, IExchangePurchaseEvent } from "@framework/types";
import { formatEther } from "../../../../../utils/money";
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
    // case ContractEventType.Purchase:
    //   return (
    //     <Box sx={{ p: 2.5 }}>
    //       {Object.keys(eventData).map((key: string) => {
    //         // @ts-ignore
    //         const value = eventData[key];
    //         const showRaw = typeof value === "number" || typeof value === "string";

    //         const itemAsset = items[0];
    //         const priceAsset = price[0];

    //         return (
    //           <Box key={key} sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
    //             <Typography fontWeight={500}>
    //               <FormattedMessage id={`enums.eventDataLabel.${key}`} />:
    //             </Typography>
    //             <Box sx={{ ml: 1 }}>
    //               {key === "item" ? (
    //                 <Box>
    //                   <Typography variant="body1">
    //                     {itemAsset?.token?.template?.title} - {itemAsset?.amount}
    //                   </Typography>
    //                 </Box>
    //               ) : key === "price" ? (
    //                 <Box>
    //                   <Typography variant="body1">
    //                     {priceAsset?.token?.template?.title} -{" "}
    //                     {formatEther(priceAsset?.amount, priceAsset?.contract?.decimals, priceAsset?.contract?.symbol)}
    //                   </Typography>
    //                 </Box>
    //               ) : key === "from" || key === "to" ? (
    //                 <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
    //                   <AddressLink address={value} />
    //                 </Box>
    //               ) : (
    //                 <Typography variant="body1">{showRaw ? value : JSON.stringify(value)}</Typography>
    //               )}
    //             </Box>
    //           </Box>
    //         );
    //       })}
    //     </Box>
    //   );
    //
    case ContractEventType.Purchase:
      return (
        <Box sx={{ p: 2.5 }}>
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
          <Box sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
            <Typography fontWeight={500}>
              <FormattedMessage id={`enums.eventDataLabel.item`} />:
            </Typography>
            <Box sx={{ ml: 1 }}>
              <Box>
                <Typography variant="body1">
                  {itemAsset?.contract?.contractType} - {itemAsset?.token?.template?.title} -{" "}
                  {itemAsset?.amount === "1" && itemAsset?.token?.tokenId !== "0"
                    ? itemAsset?.tokenId
                    : formatEther(itemAsset?.amount, itemAsset?.contract?.decimals, itemAsset?.contract?.symbol)}
                </Typography>
              </Box>
            </Box>
          </Box>
          {price.map((pr: any, i: number) => {
            return (
              <Box key={i} sx={{ display: "flex", mb: 1, "&:last-of-type": { mb: 0 } }}>
                <Typography fontWeight={500}>
                  <FormattedMessage id={`enums.eventDataLabel.price`} /> {i + 1}:
                </Typography>
                <Box sx={{ ml: 1 }}>
                  <Box>
                    <Typography variant="body1">
                      {pr?.contract?.contractType} - {pr?.token?.template?.title} -{" "}
                      {pr?.amount === "1" && pr?.token?.tokenId !== "0"
                        ? pr?.tokenId
                        : formatEther(pr?.amount, pr?.contract?.decimals, pr?.contract?.symbol)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* {Object.keys(eventData).map((key: string) => {
            // @ts-ignore
            const value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";

            const itemAsset = items[0];
            const priceAsset = price[0];

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
                        {formatEther(priceAsset?.amount, priceAsset?.contract?.decimals, priceAsset?.contract?.symbol)}
                      </Typography>
                    </Box>
                  ) : key === "from" || key === "to" ? (
                    <Box sx={{ fontSize: 16, lineHeight: "24px" }}>
                      <AddressLink address={value} />
                    </Box>
                  ) : (
                    <Typography variant="body1">{showRaw ? value : JSON.stringify(value)}</Typography>
                  )}
                </Box>
              </Box>
            );
          })} */}
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
