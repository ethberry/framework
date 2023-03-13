import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Box, Typography } from "@mui/material";

import { ContractEventType, IEventHistory } from "@framework/types";

export interface IEventDataViewProps {
  row: IEventHistory;
}

export const EventDataView: FC<IEventDataViewProps> = props => {
  const {
    row: { eventData, eventType },
  } = props;

  switch (eventType) {
    case ContractEventType.Snapshot:
    default: {
      return (
        <Box sx={{ p: 2.5 }}>
          {Object.keys(eventData).map((key: string, i) => {
            // @ts-ignore
            const value = eventData[key];
            const showRaw = typeof value === "number" || typeof value === "string";

            return (
              <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1, "&:last-of-type": { mb: 0 } }}>
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
