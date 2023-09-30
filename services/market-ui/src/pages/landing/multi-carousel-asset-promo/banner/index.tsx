import { FC, useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { formatDuration, intervalToDuration } from "date-fns";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { IAssetPromo } from "@framework/types";

import { PromoPurchaseButton } from "../../../../components/buttons";
import {
  StyledButtonWrapper,
  StyledContainer,
  StyledContent,
  StyledDescription,
  StyledImage,
  StyledTime,
} from "./styled";

interface IBannerProps {
  promo: IAssetPromo;
}

export const AssetPromoBanner: FC<IBannerProps> = props => {
  const { promo } = props;
  const [time, setTime] = useState("");

  let interval: NodeJS.Timeout;

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
    <StyledContainer container data-testid="PromoBanner">
      <Grid item xs={12} sm={6}>
        <StyledImage component="img" src={promo.item?.components[0].template?.imageUrl} alt="banner" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledContent>
          <Typography variant="h3">{promo.item?.components[0].template?.title}</Typography>
          <StyledDescription>
            <RichTextDisplay data={promo.item?.components[0].template?.description} />
          </StyledDescription>
          <StyledTime>{time}</StyledTime>
          <StyledButtonWrapper>
            <PromoPurchaseButton promo={promo} />
          </StyledButtonWrapper>
        </StyledContent>
      </Grid>
    </StyledContainer>
  );
};
