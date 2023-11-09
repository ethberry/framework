import { ComponentType, FC } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import type { IMysteryBox } from "@framework/types";

import { useStyles } from "./styles";
import { MultiCarouselButtonGroup } from "./button-group";

declare interface IMultiCarouselMysteryboxProps {
  mysteryBoxes: Array<IMysteryBox>;
  component: ComponentType<{ mysteryBox: IMysteryBox }>;
}

export enum IResolutions {
  DESKTOP = "DESKTOP",
  TABLET = "TABLET",
  MOBILE = "MOBILE",
}

export const MultiCarouselMysterybox: FC<IMultiCarouselMysteryboxProps> = props => {
  const { mysteryBoxes, component: Component } = props;

  const classes = useStyles();
  const there = useTheme();

  const responsive = {
    [IResolutions.DESKTOP]: {
      breakpoint: {
        max: document.documentElement.clientWidth, // there.breakpoints.values.lg
        min: there.breakpoints.values.md,
      },
      items: 3,
    },
    [IResolutions.TABLET]: {
      breakpoint: {
        max: there.breakpoints.values.md,
        min: there.breakpoints.values.sm,
      },
      items: 2,
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
      deviceType={deviceType}
      className={classes.container}
      itemClass={classes.item}
      responsive={responsive}
      arrows={false}
      renderButtonGroupOutside={true}
      customButtonGroup={<MultiCarouselButtonGroup />}
      infinite
    >
      {mysteryBoxes.map(mysterybox => (
        <Component key={mysterybox.id} mysteryBox={mysterybox} />
      ))}
    </Carousel>
  );
};
