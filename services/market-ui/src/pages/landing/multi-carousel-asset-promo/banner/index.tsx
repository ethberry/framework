import { FC, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { formatDuration, intervalToDuration } from "date-fns";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IAssetPromo } from "@framework/types";

import { PromoPurchaseButton } from "../../../../components/buttons";
import { StyledContainer, StyledImage } from "./styled";

interface IBannerProps {
  promo: IAssetPromo;
}

export const AssetPromoBanner: FC<IBannerProps> = props => {
  const { promo } = props;
  const [time, setTime] = useState("");

  let interval: NodeJS.Timer;

  useEffect(() => {
    if (!interval) {
      interval = setInterval(() => {
        setTime(
          formatDuration(
            intervalToDuration({
              start: new Date(),
              end: new Date(promo.endTimestamp),
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
    <StyledContainer container sx={{ my: 6 }} data-testid="PromoBanner">
      <Grid item xs={12} sm={6}>
        <StyledImage component="img" src={promo.item?.components[0].template?.imageUrl} alt="banner" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ pr: { xs: 0, sm: 6 } }}>
          <Typography variant="h3">{promo.item?.components[0].template?.title}</Typography>
          <Box sx={{ my: 3 }}>
            <RichTextDisplay data={promo.item?.components[0].template?.description} />
          </Box>
          <Box sx={{ my: 3, color: "red", height: "1em", textAlign: "center" }}>{time}</Box>
          <Box sx={{ my: 3, textAlign: "center", pr: { xs: 0, sm: 6 } }}>
            <PromoPurchaseButton promo={promo} />
          </Box>
        </Box>
      </Grid>
    </StyledContainer>
  );
};
