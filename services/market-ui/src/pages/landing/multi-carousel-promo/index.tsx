import { FC } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { IPromo } from "@framework/types";

import { PromoBanner } from "./banner";
import { useStyles } from "./styles";

declare interface IMultiCarouselPromoProps {
  promos: Array<IPromo>;
}

export enum IResolutions {
  DESKTOP = "DESKTOP",
  TABLET = "TABLET",
  MOBILE = "MOBILE",
}

export const MultiCarouselPromo: FC<IMultiCarouselPromoProps> = ({ promos }) => {
  const classes = useStyles();
  const theme = useTheme();

  const responsive = {
    [IResolutions.DESKTOP]: {
      breakpoint: {
        max: document.documentElement.clientWidth + 50,
        min: theme.breakpoints.values.md,
      },
      items: 1,
    },
    [IResolutions.TABLET]: {
      breakpoint: {
        max: theme.breakpoints.values.md,
        min: theme.breakpoints.values.sm,
      },
      items: 1,
    },
    [IResolutions.MOBILE]: {
      breakpoint: {
        max: theme.breakpoints.values.sm,
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
      {promos.map(promo => (
        <PromoBanner key={promo.id} promo={promo} />
      ))}
    </Carousel>
  );
};
