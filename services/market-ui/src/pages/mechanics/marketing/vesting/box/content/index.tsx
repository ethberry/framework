import React, { FC } from "react";
import { useIntl } from "react-intl";
import { Typography } from "@mui/material";

import { formatItem } from "@framework/exchange";
import { IVestingBox } from "@framework/types";

import { Root, StyledCardContent } from "./styled";
import { formatDateFromUnixTime, getPeriodFromSecondsInDays, secondFromUnixConverter } from "./utils";

interface ICurrentBoxContent {
  selected: IVestingBox;
}

export const CurrentBoxContent: FC<ICurrentBoxContent> = props => {
  const { selected } = props;

  const { formatMessage } = useIntl();

  const startTimestampInSeconds = secondFromUnixConverter(new Date(selected.startTimestamp));
  const start = Number(startTimestampInSeconds) + selected.cliff; // start of unlock

  return (
    <Root>
      <StyledCardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          {`${formatMessage({ id: "form.labels.price" })}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {formatItem(selected.template?.price)}
        </Typography>
      </StyledCardContent>

      <StyledCardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          {`${formatMessage({ id: "form.labels.startDate" })}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {formatDateFromUnixTime(startTimestampInSeconds, "dd/MM/yyyy")}
        </Typography>
      </StyledCardContent>

      <StyledCardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          {`${formatMessage({ id: "pages.vesting.box.unlockStart" })}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {formatDateFromUnixTime(start, "dd/MM/yyyy")}
        </Typography>
      </StyledCardContent>

      {!!selected.afterCliffBasisPoints && (
        <StyledCardContent>
          <Typography variant="body1" color="textSecondary" component="p">
            {`${formatMessage({ id: "pages.vesting.box.immediateRelease" })}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {`${formatItem(selected.content).split(" ")[0]} ${(Number(formatItem(selected.content).split(" ")[1]) * selected.afterCliffBasisPoints) / 10000}`}
          </Typography>
        </StyledCardContent>
      )}

      <StyledCardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          {`${formatMessage({ id: "form.labels.duration" })}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {getPeriodFromSecondsInDays(selected.duration + selected.cliff)}
        </Typography>
      </StyledCardContent>

      <StyledCardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          {`${formatMessage({ id: "pages.vesting.box.endDate" })}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {formatDateFromUnixTime(start + selected.duration, "dd/MM/yyyy")}
        </Typography>
      </StyledCardContent>
    </Root>
  );
};
