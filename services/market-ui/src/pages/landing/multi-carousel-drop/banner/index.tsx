import { FC, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { formatDuration, intervalToDuration } from "date-fns";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IDrop } from "@framework/types";

import { DropPurchaseButton } from "../../../../components/buttons";
import { StyledContainer, StyledImage } from "./styled";

interface IBannerProps {
  drop: IDrop;
}

export const DropBanner: FC<IBannerProps> = props => {
  const { drop } = props;
  const [time, setTime] = useState("");

  let interval: NodeJS.Timer;

  useEffect(() => {
    if (!interval) {
      interval = setInterval(() => {
        setTime(
          formatDuration(
            intervalToDuration({
              start: new Date(),
              end: new Date(drop.endTimestamp),
            }),
          ),
        );
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <StyledContainer container sx={{ my: 6 }} data-testid="DropBanner">
      <Grid item xs={12} sm={6}>
        <StyledImage component="img" src={drop.item?.components[0].template?.imageUrl} alt="banner" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ pr: { xs: 0, sm: 6 } }}>
          <Typography variant="h3">{drop.item?.components[0].template?.title}</Typography>
          <Box sx={{ my: 3 }}>
            <RichTextDisplay data={drop.item?.components[0].template?.description} />
          </Box>
          <Box sx={{ my: 3, color: "red", height: "1em", textAlign: "center" }}>{time}</Box>
          <Box sx={{ my: 3, textAlign: "center", pr: { xs: 0, sm: 6 } }}>
            <DropPurchaseButton drop={drop} />
          </Box>
        </Box>
      </Grid>
    </StyledContainer>
  );
};
