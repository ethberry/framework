import { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";
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
  StyledTitle,
} from "./styled";
import { getChainIconParams } from "../../../../components/common/header/network/utils";
import { StyledSvgIcon } from "../../../../components/common/header/network/styled";

interface IBannerProps {
  promo: IAssetPromo;
}

export const AssetPromoBanner: FC<IBannerProps> = props => {
  const { promo } = props;
  const { chainIcon, viewBox } = getChainIconParams(promo.item?.components[0].contract?.chainId || 56);

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
          <StyledTitle>{promo.item?.components[0].template?.title}</StyledTitle>
          <StyledDescription>
            <RichTextDisplay data={promo.item?.components[0].template?.description} />
          </StyledDescription>
          <StyledTime>{time}</StyledTime>
          <StyledButtonWrapper>
            <Grid container spacing={1} justifyContent="center" alignItems="center">
              <Grid item xs={12} alignItems="center">
                <PromoPurchaseButton promo={promo} />
              </Grid>
              <Grid item xs={12} alignItems="center">
                <StyledSvgIcon component={chainIcon} viewBox={viewBox} />
              </Grid>
            </Grid>
          </StyledButtonWrapper>
        </StyledContent>
      </Grid>
    </StyledContainer>
  );
};
