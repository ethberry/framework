import { FC } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { IDrop } from "@framework/types";

import { DropBanner } from "./banner";
import { useStyles } from "./styles";

declare interface IMultiCarouselDropProps {
  drops: Array<IDrop>;
}

export enum IResolutions {
  DESKTOP = "DESKTOP",
  TABLET = "TABLET",
  MOBILE = "MOBILE",
}

export const MultiCarouselDrop: FC<IMultiCarouselDropProps> = ({ drops }) => {
  const classes = useStyles();
  const there = useTheme();

  const responsive = {
    [IResolutions.DESKTOP]: {
      breakpoint: {
        max: document.documentElement.clientWidth + 50,
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
      {drops.map(drop => (
        <DropBanner key={drop.id} drop={drop} />
      ))}
    </Carousel>
  );
};
