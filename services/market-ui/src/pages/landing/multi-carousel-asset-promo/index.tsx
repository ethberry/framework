import { FC } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { IAssetPromo } from "@framework/types";

import { AssetPromoBanner } from "./banner";
import { useStyles } from "./styles";

declare interface IMultiCarouselAssetPromoProps {
  promo: Array<IAssetPromo>;
}

export enum IResolutions {
  DESKTOP = "DESKTOP",
  TABLET = "TABLET",
  MOBILE = "MOBILE",
}

export const MultiCarouselAssetPromo: FC<IMultiCarouselAssetPromoProps> = ({ promo }) => {
  const classes = useStyles();
  const there = useTheme();

  const responsive = {
    [IResolutions.DESKTOP]: {
      breakpoint: {
        max: window.innerWidth + 50,
        min: there.breakpoints.values.md,
      },
      items: 1,
    },
    [IResolutions.TABLET]: {
      breakpoint: {
        max: there.breakpoints.values.md,
        min: there.breakpoints.values.sm,
      },
      items: 1,
    },
    [IResolutions.MOBILE]: {
      breakpoint: {
        max: there.breakpoints.values.sm,
        min: 0,
      },
      items: 1,
    },
  };

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("md"));

  const deviceType = isSmallScreen ? IResolutions.MOBILE : isMediumScreen ? IResolutions.TABLET : IResolutions.DESKTOP;

  return (
    <Carousel
      ssr
      autoPlay
      autoPlaySpeed={5000}
      arrows={false}
      draggable={false}
      showDots
      renderDotsOutside
      dotListClass={classes.dotList}
      deviceType={deviceType}
      className={classes.container}
      itemClass={classes.item}
      responsive={responsive}
      infinite
    >
      {promo.map(promo => (
        <AssetPromoBanner key={promo.id} promo={promo} />
      ))}
    </Carousel>
  );
};
